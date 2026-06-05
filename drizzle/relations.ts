import { relations } from "drizzle-orm";
import {
  users,
  pets,
  places,
  reviews,
  favorites,
  communityPosts,
  communityComments,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  pets:      many(pets),
  reviews:   many(reviews),
  favorites: many(favorites),
  posts:     many(communityPosts),
  comments:  many(communityComments),
}));

export const petsRelations = relations(pets, ({ one }) => ({
  user: one(users, { fields: [pets.userId], references: [users.id] }),
}));

export const placesRelations = relations(places, ({ many }) => ({
  reviews:   many(reviews),
  favorites: many(favorites),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  place: one(places, { fields: [reviews.placeId], references: [places.id] }),
  user:  one(users,  { fields: [reviews.userId],  references: [users.id] }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  place: one(places, { fields: [favorites.placeId], references: [places.id] }),
  user:  one(users,  { fields: [favorites.userId],  references: [users.id] }),
}));

export const communityPostsRelations = relations(communityPosts, ({ one, many }) => ({
  user:     one(users, { fields: [communityPosts.userId], references: [users.id] }),
  comments: many(communityComments),
}));

export const communityCommentsRelations = relations(communityComments, ({ one }) => ({
  post: one(communityPosts, { fields: [communityComments.postId], references: [communityPosts.id] }),
  user: one(users,          { fields: [communityComments.userId], references: [users.id] }),
}));
