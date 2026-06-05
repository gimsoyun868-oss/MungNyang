import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { StarRating } from "@/components/StarRating";

export type ReviewData = {
  id: number;
  rating: number;
  content?: string | null;
  tags?: string | null;
  petType?: string | null;
  createdAt: Date | string;
  userName?: string | null;
  placeName?: string | null;
  placeCategory?: string | null;
};

type Props = {
  review: ReviewData;
  showPlace?: boolean;
};

const PET_TYPE_LABELS: Record<string, string> = {
  dog: "🐶 강아지",
  cat: "🐱 고양이",
  other: "🐾 기타",
};

export function ReviewCard({ review, showPlace = false }: Props) {
  const colors = useColors();
  const tags: string[] = review.tags ? JSON.parse(review.tags) : [];
  const dateStr = new Date(review.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.avatarText, { color: colors.accent }]}>
            {(review.userName ?? "익명")[0]}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.userName, { color: colors.foreground }]}>
            {review.userName ?? "익명"}
          </Text>
          <View style={styles.ratingDateRow}>
            <StarRating rating={review.rating} size={14} />
            <Text style={[styles.date, { color: colors.muted }]}>{dateStr}</Text>
          </View>
        </View>
        {review.petType && (
          <View style={[styles.petBadge, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.petBadgeText, { color: colors.accent }]}>
              {PET_TYPE_LABELS[review.petType] ?? review.petType}
            </Text>
          </View>
        )}
      </View>
      {review.content && (
        <Text style={[styles.content, { color: colors.foreground }]}>{review.content}</Text>
      )}
      {tags.length > 0 && (
        <View style={styles.tagsRow}>
          {tags.map((tag, i) => (
            <View key={i} style={[styles.tag, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.tagText, { color: colors.accent }]}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
  },
  headerInfo: {
    flex: 1,
    gap: 3,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
  },
  ratingDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  date: {
    fontSize: 12,
  },
  petBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  petBadgeText: {
    fontSize: 11,
    fontWeight: "500",
  },
  content: {
    fontSize: 14,
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
