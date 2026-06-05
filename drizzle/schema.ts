import {
  boolean,
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  float,
} from "drizzle-orm/mysql-core";

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id:           int("id").autoincrement().primaryKey(),
  openId:       varchar("openId", { length: 64 }).notNull().unique(),
  name:         text("name"),
  email:        varchar("email", { length: 320 }),
  role:         mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  loginMethod:  varchar("loginMethod", { length: 32 }),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
  createdAt:    timestamp("createdAt").defaultNow().notNull(),
  updatedAt:    timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Pets ─────────────────────────────────────────────────────────────────────
export const pets = mysqlTable("pets", {
  id:          int("id").autoincrement().primaryKey(),
  userId:      int("userId").notNull(),
  name:        varchar("name", { length: 100 }).notNull(),
  type:        mysqlEnum("type", ["dog", "cat", "other"]).notNull(),
  breed:       varchar("breed", { length: 100 }),
  ageYears:    int("ageYears"),
  weightKg:    decimal("weightKg", { precision: 5, scale: 2 }),
  gender:      mysqlEnum("gender", ["male", "female", "unknown"]).default("unknown"),
  personality: text("personality"),
  notes:       text("notes"),
  imageUrl:    text("imageUrl"),
  createdAt:   timestamp("createdAt").defaultNow().notNull(),
  updatedAt:   timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Places ───────────────────────────────────────────────────────────────────
export const places = mysqlTable("places", {
  id:               int("id").autoincrement().primaryKey(),
  name:             varchar("name", { length: 200 }).notNull(),
  category:         mysqlEnum("category", [
    "cafe", "restaurant", "hospital", "grooming",
    "kindergarten", "hotel", "park", "petshop"
  ]).notNull(),
  address:          text("address").notNull(),
  addressDetail:    text("addressDetail"),
  lat:              float("lat").notNull(),
  lng:              float("lng").notNull(),
  phone:            varchar("phone", { length: 20 }),
  website:          text("website"),
  description:      text("description"),
  openingHours:     text("openingHours"),
  priceInfo:        text("priceInfo"),
  imageUrl:         text("imageUrl"),
  // 반려동물 관련 정보
  allowSmallDog:    boolean("allowSmallDog").default(false),
  allowMediumDog:   boolean("allowMediumDog").default(false),
  allowLargeDog:    boolean("allowLargeDog").default(false),
  allowCat:         boolean("allowCat").default(false),
  hasParking:       boolean("hasParking").default(false),
  hasReservation:   boolean("hasReservation").default(false),
  // 집계 (캐시)
  avgRating:        decimal("avgRating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount:      int("reviewCount").default(0),
  favoriteCount:    int("favoriteCount").default(0),
  isVerified:       boolean("isVerified").default(false),
  createdAt:        timestamp("createdAt").defaultNow().notNull(),
  updatedAt:        timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const reviews = mysqlTable("reviews", {
  id:        int("id").autoincrement().primaryKey(),
  placeId:   int("placeId").notNull(),
  userId:    int("userId").notNull(),
  rating:    int("rating").notNull(),           // 1~5
  content:   text("content"),
  imageUrl:  text("imageUrl"),
  petType:   mysqlEnum("petType", ["dog", "cat", "other"]),
  tags:      text("tags"),                      // JSON array string
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Favorites ────────────────────────────────────────────────────────────────
export const favorites = mysqlTable("favorites", {
  id:        int("id").autoincrement().primaryKey(),
  userId:    int("userId").notNull(),
  placeId:   int("placeId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Community Posts ──────────────────────────────────────────────────────────
export const communityPosts = mysqlTable("community_posts", {
  id:         int("id").autoincrement().primaryKey(),
  userId:     int("userId").notNull(),
  category:   mysqlEnum("category", ["question", "walk", "review", "free"]).notNull(),
  title:      varchar("title", { length: 200 }).notNull(),
  content:    text("content").notNull(),
  imageUrl:   text("imageUrl"),
  viewCount:  int("viewCount").default(0),
  likeCount:  int("likeCount").default(0),
  commentCount: int("commentCount").default(0),
  createdAt:  timestamp("createdAt").defaultNow().notNull(),
  updatedAt:  timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Community Comments ───────────────────────────────────────────────────────
export const communityComments = mysqlTable("community_comments", {
  id:        int("id").autoincrement().primaryKey(),
  postId:    int("postId").notNull(),
  userId:    int("userId").notNull(),
  content:   text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Types ────────────────────────────────────────────────────────────────────
export type User              = typeof users.$inferSelect;
export type InsertUser        = typeof users.$inferInsert;
export type Pet               = typeof pets.$inferSelect;
export type InsertPet         = typeof pets.$inferInsert;
export type Place             = typeof places.$inferSelect;
export type InsertPlace       = typeof places.$inferInsert;
export type Review            = typeof reviews.$inferSelect;
export type InsertReview      = typeof reviews.$inferInsert;
export type Favorite          = typeof favorites.$inferSelect;
export type InsertFavorite    = typeof favorites.$inferInsert;
export type CommunityPost     = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = typeof communityPosts.$inferInsert;
export type CommunityComment  = typeof communityComments.$inferSelect;
export type InsertCommunityComment = typeof communityComments.$inferInsert;
