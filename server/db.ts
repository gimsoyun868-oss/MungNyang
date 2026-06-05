import { and, desc, eq, like, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  places,
  reviews,
  pets,
  favorites,
  communityPosts,
  communityComments,
  users,
  type InsertUser,
  type InsertPet,
  type InsertReview,
  type InsertFavorite,
  type InsertCommunityPost,
  type InsertCommunityComment,
  type InsertPlace,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

// ─── DB Connection ────────────────────────────────────────────────────────────

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users (required by _core/sdk.ts) ────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Places ───────────────────────────────────────────────────────────────────

export async function getPlaces(opts?: {
  category?: string;
  sort?: "rating" | "reviews" | "distance";
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  const limit = opts?.limit ?? 20;
  const offset = opts?.offset ?? 0;

  let query = db.select().from(places).$dynamic();
  const conditions = [];
  if (opts?.category && opts.category !== "all") {
    conditions.push(eq(places.category, opts.category as any));
  }
  if (opts?.search) {
    conditions.push(like(places.name, `%${opts.search}%`));
  }
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  if (opts?.sort === "rating") {
    query = query.orderBy(desc(places.avgRating));
  } else if (opts?.sort === "reviews") {
    query = query.orderBy(desc(places.reviewCount));
  } else {
    query = query.orderBy(desc(places.createdAt));
  }
  return query.limit(limit).offset(offset);
}

export async function getPlaceById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(places).where(eq(places.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getPopularPlaces(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(places).orderBy(desc(places.reviewCount)).limit(limit);
}

export async function getNearbyPlaces(lat: number, lng: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: places.id,
      name: places.name,
      category: places.category,
      address: places.address,
      addressDetail: places.addressDetail,
      lat: places.lat,
      lng: places.lng,
      phone: places.phone,
      imageUrl: places.imageUrl,
      avgRating: places.avgRating,
      reviewCount: places.reviewCount,
      favoriteCount: places.favoriteCount,
      allowSmallDog: places.allowSmallDog,
      allowMediumDog: places.allowMediumDog,
      allowLargeDog: places.allowLargeDog,
      allowCat: places.allowCat,
      hasParking: places.hasParking,
      hasReservation: places.hasReservation,
      isVerified: places.isVerified,
      createdAt: places.createdAt,
      updatedAt: places.updatedAt,
      description: places.description,
      openingHours: places.openingHours,
      priceInfo: places.priceInfo,
      website: places.website,
      distance: sql<number>`(
        6371 * acos(
          cos(radians(${lat})) * cos(radians(lat)) *
          cos(radians(lng) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(lat))
        )
      )`.as("distance"),
    })
    .from(places)
    .orderBy(sql`distance`)
    .limit(limit);
}

export async function createPlace(data: InsertPlace) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(places).values(data);
  return result[0].insertId;
}

export async function searchPlaces(keyword: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(places).where(like(places.name, `%${keyword}%`)).limit(limit);
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function getReviewsByPlace(placeId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: reviews.id,
      placeId: reviews.placeId,
      userId: reviews.userId,
      rating: reviews.rating,
      content: reviews.content,
      imageUrl: reviews.imageUrl,
      petType: reviews.petType,
      tags: reviews.tags,
      createdAt: reviews.createdAt,
      userName: users.name,
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.placeId, placeId))
    .orderBy(desc(reviews.createdAt))
    .limit(limit);
}

export async function getReviewsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: reviews.id,
      placeId: reviews.placeId,
      rating: reviews.rating,
      content: reviews.content,
      imageUrl: reviews.imageUrl,
      tags: reviews.tags,
      createdAt: reviews.createdAt,
      placeName: places.name,
      placeCategory: places.category,
    })
    .from(reviews)
    .leftJoin(places, eq(reviews.placeId, places.id))
    .where(eq(reviews.userId, userId))
    .orderBy(desc(reviews.createdAt));
}

export async function createReview(data: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(reviews).values(data);
  await db
    .update(places)
    .set({
      reviewCount: sql`review_count + 1`,
      avgRating: sql`(SELECT AVG(rating) FROM reviews WHERE place_id = ${data.placeId})`,
    })
    .where(eq(places.id, data.placeId));
  return result[0].insertId;
}

// ─── Pets ─────────────────────────────────────────────────────────────────────

export async function getPetsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pets).where(eq(pets.userId, userId)).orderBy(pets.createdAt);
}

export async function createPet(data: InsertPet) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(pets).values(data);
  return result[0].insertId;
}

export async function updatePet(id: number, userId: number, data: Partial<InsertPet>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(pets).set(data).where(and(eq(pets.id, id), eq(pets.userId, userId)));
}

export async function deletePet(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(pets).where(and(eq(pets.id, id), eq(pets.userId, userId)));
}

// ─── Favorites ────────────────────────────────────────────────────────────────

export async function getFavoritesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: favorites.id,
      placeId: favorites.placeId,
      createdAt: favorites.createdAt,
      placeName: places.name,
      placeCategory: places.category,
      placeAddress: places.address,
      placeImageUrl: places.imageUrl,
      placeAvgRating: places.avgRating,
      placeReviewCount: places.reviewCount,
    })
    .from(favorites)
    .leftJoin(places, eq(favorites.placeId, places.id))
    .where(eq(favorites.userId, userId))
    .orderBy(desc(favorites.createdAt));
}

export async function isFavorite(userId: number, placeId: number) {
  const db = await getDb();
  if (!db) return false;
  const rows = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.placeId, placeId)))
    .limit(1);
  return rows.length > 0;
}

export async function toggleFavorite(userId: number, placeId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const existing = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.placeId, placeId)))
    .limit(1);

  if (existing.length > 0) {
    await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.placeId, placeId)));
    await db.update(places).set({ favoriteCount: sql`favorite_count - 1` }).where(eq(places.id, placeId));
    return { isFavorite: false };
  } else {
    await db.insert(favorites).values({ userId, placeId });
    await db.update(places).set({ favoriteCount: sql`favorite_count + 1` }).where(eq(places.id, placeId));
    return { isFavorite: true };
  }
}

// ─── Community ────────────────────────────────────────────────────────────────

export async function getCommunityPosts(opts?: {
  category?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  const limit = opts?.limit ?? 20;
  const offset = opts?.offset ?? 0;

  let query = db
    .select({
      id: communityPosts.id,
      userId: communityPosts.userId,
      category: communityPosts.category,
      title: communityPosts.title,
      content: communityPosts.content,
      imageUrl: communityPosts.imageUrl,
      viewCount: communityPosts.viewCount,
      likeCount: communityPosts.likeCount,
      commentCount: communityPosts.commentCount,
      createdAt: communityPosts.createdAt,
      userName: users.name,
    })
    .from(communityPosts)
    .leftJoin(users, eq(communityPosts.userId, users.id))
    .$dynamic();

  if (opts?.category && opts.category !== "all") {
    query = query.where(eq(communityPosts.category, opts.category as any));
  }
  return query.orderBy(desc(communityPosts.createdAt)).limit(limit).offset(offset);
}

export async function getCommunityPostById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select({
      id: communityPosts.id,
      userId: communityPosts.userId,
      category: communityPosts.category,
      title: communityPosts.title,
      content: communityPosts.content,
      imageUrl: communityPosts.imageUrl,
      viewCount: communityPosts.viewCount,
      likeCount: communityPosts.likeCount,
      commentCount: communityPosts.commentCount,
      createdAt: communityPosts.createdAt,
      userName: users.name,
    })
    .from(communityPosts)
    .leftJoin(users, eq(communityPosts.userId, users.id))
    .where(eq(communityPosts.id, id))
    .limit(1);
  if (rows[0]) {
    await db.update(communityPosts).set({ viewCount: sql`view_count + 1` }).where(eq(communityPosts.id, id));
  }
  return rows[0] ?? null;
}

export async function createCommunityPost(data: InsertCommunityPost) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(communityPosts).values(data);
  return result[0].insertId;
}

export async function getCommentsByPost(postId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: communityComments.id,
      postId: communityComments.postId,
      userId: communityComments.userId,
      content: communityComments.content,
      createdAt: communityComments.createdAt,
      userName: users.name,
    })
    .from(communityComments)
    .leftJoin(users, eq(communityComments.userId, users.id))
    .where(eq(communityComments.postId, postId))
    .orderBy(communityComments.createdAt);
}

export async function createComment(data: InsertCommunityComment) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(communityComments).values(data);
  await db
    .update(communityPosts)
    .set({ commentCount: sql`comment_count + 1` })
    .where(eq(communityPosts.id, data.postId));
  return result[0].insertId;
}

// ─── Seed ─────────────────────────────────────────────────────────────────────

export async function seedPlaces(data: InsertPlace[]) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(places).values(data);
}
