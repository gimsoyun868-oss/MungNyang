import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  // ─── Health ──────────────────────────────────────────────────────────────
  health: publicProcedure.query(() => ({ status: "ok", app: "멍냥" })),

  // ─── Places ──────────────────────────────────────────────────────────────
  places: router({
    list: publicProcedure
      .input(
        z.object({
          category: z.string().optional(),
          sort: z.enum(["rating", "reviews", "distance"]).optional(),
          search: z.string().optional(),
          limit: z.number().min(1).max(50).optional(),
          offset: z.number().min(0).optional(),
        }).optional()
      )
      .query(({ input }) => db.getPlaces(input)),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getPlaceById(input.id)),

    popular: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(20).optional() }).optional())
      .query(({ input }) => db.getPopularPlaces(input?.limit)),

    nearby: publicProcedure
      .input(
        z.object({
          lat: z.number(),
          lng: z.number(),
          limit: z.number().min(1).max(50).optional(),
        })
      )
      .query(({ input }) => db.getNearbyPlaces(input.lat, input.lng, input.limit)),

    search: publicProcedure
      .input(z.object({ keyword: z.string().min(1), limit: z.number().optional() }))
      .query(({ input }) => db.searchPlaces(input.keyword, input.limit)),

    seed: publicProcedure
      .input(
        z.array(
          z.object({
            name: z.string(),
            category: z.enum(["cafe", "restaurant", "hospital", "grooming", "kindergarten", "hotel", "park", "petshop"]),
            address: z.string(),
            addressDetail: z.string().optional(),
            lat: z.number(),
            lng: z.number(),
            phone: z.string().optional(),
            website: z.string().optional(),
            description: z.string().optional(),
            openingHours: z.string().optional(),
            priceInfo: z.string().optional(),
            imageUrl: z.string().optional(),
            allowSmallDog: z.boolean().optional(),
            allowMediumDog: z.boolean().optional(),
            allowLargeDog: z.boolean().optional(),
            allowCat: z.boolean().optional(),
            hasParking: z.boolean().optional(),
            hasReservation: z.boolean().optional(),
          })
        )
      )
      .mutation(({ input }) => db.seedPlaces(input)),
  }),

  // ─── Reviews ─────────────────────────────────────────────────────────────
  reviews: router({
    listByPlace: publicProcedure
      .input(z.object({ placeId: z.number(), limit: z.number().optional() }))
      .query(({ input }) => db.getReviewsByPlace(input.placeId, input.limit)),

    listByUser: protectedProcedure
      .query(({ ctx }) => db.getReviewsByUser(ctx.user.id)),

    create: protectedProcedure
      .input(
        z.object({
          placeId: z.number(),
          rating: z.number().min(1).max(5),
          content: z.string().max(1000).optional(),
          imageUrl: z.string().optional(),
          petType: z.enum(["dog", "cat", "other"]).optional(),
          tags: z.array(z.string()).optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        db.createReview({
          placeId: input.placeId,
          userId: ctx.user.id,
          rating: input.rating,
          content: input.content,
          imageUrl: input.imageUrl,
          petType: input.petType,
          tags: input.tags ? JSON.stringify(input.tags) : undefined,
        })
      ),
  }),

  // ─── Pets ─────────────────────────────────────────────────────────────────
  pets: router({
    list: protectedProcedure
      .query(({ ctx }) => db.getPetsByUser(ctx.user.id)),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1).max(100),
          type: z.enum(["dog", "cat", "other"]),
          breed: z.string().max(100).optional(),
          ageYears: z.number().min(0).max(30).optional(),
          weightKg: z.number().min(0).max(200).optional(),
          gender: z.enum(["male", "female", "unknown"]).optional(),
          personality: z.string().max(500).optional(),
          notes: z.string().max(500).optional(),
          imageUrl: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        db.createPet({
          userId: ctx.user.id,
          name: input.name,
          type: input.type,
          breed: input.breed,
          ageYears: input.ageYears,
          weightKg: input.weightKg ? String(input.weightKg) : undefined,
          gender: input.gender,
          personality: input.personality,
          notes: input.notes,
          imageUrl: input.imageUrl,
        })
      ),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(1).max(100).optional(),
          breed: z.string().max(100).optional(),
          ageYears: z.number().min(0).max(30).optional(),
          weightKg: z.number().min(0).max(200).optional(),
          gender: z.enum(["male", "female", "unknown"]).optional(),
          personality: z.string().max(500).optional(),
          notes: z.string().max(500).optional(),
          imageUrl: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) => {
        const { id, weightKg, ...rest } = input;
        return db.updatePet(id, ctx.user.id, {
          ...rest,
          weightKg: weightKg !== undefined ? String(weightKg) : undefined,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ ctx, input }) => db.deletePet(input.id, ctx.user.id)),
  }),

  // ─── Favorites ───────────────────────────────────────────────────────────
  favorites: router({
    list: protectedProcedure
      .query(({ ctx }) => db.getFavoritesByUser(ctx.user.id)),

    check: protectedProcedure
      .input(z.object({ placeId: z.number() }))
      .query(({ ctx, input }) => db.isFavorite(ctx.user.id, input.placeId)),

    toggle: protectedProcedure
      .input(z.object({ placeId: z.number() }))
      .mutation(({ ctx, input }) => db.toggleFavorite(ctx.user.id, input.placeId)),
  }),

  // ─── Community ───────────────────────────────────────────────────────────

  // --- Auth ---
  auth: router({
    logout: protectedProcedure.mutation(({ ctx }) => {
      const headers = ctx.req.headers as Record<string, string>;
      const isSecure = ctx.req.protocol === 'https' || headers['x-forwarded-proto'] === 'https';
      ctx.res.clearCookie('app_session_id', {
        maxAge: -1,
        secure: isSecure,
        sameSite: 'none',
        httpOnly: true,
        path: '/',
      });
      return { success: true };
    }),
  }),

  community: router({
    posts: router({
      list: publicProcedure
        .input(
          z.object({
            category: z.enum(["all", "question", "walk", "review", "free"]).optional(),
            limit: z.number().min(1).max(50).optional(),
            offset: z.number().min(0).optional(),
          }).optional()
        )
        .query(({ input }) => db.getCommunityPosts(input)),

      getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input }) => db.getCommunityPostById(input.id)),

      create: protectedProcedure
        .input(
          z.object({
            category: z.enum(["question", "walk", "review", "free"]),
            title: z.string().min(1).max(200),
            content: z.string().min(1),
            imageUrl: z.string().optional(),
          })
        )
        .mutation(({ ctx, input }) =>
          db.createCommunityPost({
            userId: ctx.user.id,
            category: input.category,
            title: input.title,
            content: input.content,
            imageUrl: input.imageUrl,
          })
        ),
    }),

    comments: router({
      listByPost: publicProcedure
        .input(z.object({ postId: z.number() }))
        .query(({ input }) => db.getCommentsByPost(input.postId)),

      create: protectedProcedure
        .input(
          z.object({
            postId: z.number(),
            content: z.string().min(1).max(1000),
          })
        )
        .mutation(({ ctx, input }) =>
          db.createComment({
            postId: input.postId,
            userId: ctx.user.id,
            content: input.content,
          })
        ),
    }),
  }),
});

export type AppRouter = typeof appRouter;
