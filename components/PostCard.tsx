import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { COMMUNITY_LABELS } from "@/shared/types";

export type PostData = {
  id: number;
  category: string;
  title: string;
  content: string;
  viewCount?: number | null;
  likeCount?: number | null;
  commentCount?: number | null;
  createdAt: Date | string;
  userName?: string | null;
};

type Props = {
  post: PostData;
  onPress: () => void;
};

const CATEGORY_COLORS: Record<string, string> = {
  question: "#6BAF6B",
  walk:     "#C8956C",
  review:   "#A0522D",
  free:     "#8B6F5E",
};

export function PostCard({ post, onPress }: Props) {
  const colors = useColors();
  const categoryLabel = COMMUNITY_LABELS[post.category as keyof typeof COMMUNITY_LABELS] ?? post.category;
  const categoryColor = CATEGORY_COLORS[post.category] ?? colors.muted;
  const dateStr = new Date(post.createdAt).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor + "20", borderColor: categoryColor }]}>
          <Text style={[styles.categoryText, { color: categoryColor }]}>{categoryLabel}</Text>
        </View>
        <Text style={[styles.date, { color: colors.muted }]}>{dateStr}</Text>
      </View>
      <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
        {post.title}
      </Text>
      <Text style={[styles.content, { color: colors.muted }]} numberOfLines={2}>
        {post.content}
      </Text>
      <View style={styles.footer}>
        <Text style={[styles.author, { color: colors.muted }]}>{post.userName ?? "익명"}</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <IconSymbol name="eye.fill" size={13} color={colors.muted} />
            <Text style={[styles.statText, { color: colors.muted }]}>{post.viewCount ?? 0}</Text>
          </View>
          <View style={styles.stat}>
            <IconSymbol name="bubble.left.fill" size={13} color={colors.muted} />
            <Text style={[styles.statText, { color: colors.muted }]}>{post.commentCount ?? 0}</Text>
          </View>
          <View style={styles.stat}>
            <IconSymbol name="hand.thumbsup.fill" size={13} color={colors.muted} />
            <Text style={[styles.statText, { color: colors.muted }]}>{post.likeCount ?? 0}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
  },
  content: {
    fontSize: 13,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  author: {
    fontSize: 12,
    fontWeight: "500",
  },
  stats: {
    flexDirection: "row",
    gap: 12,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  statText: {
    fontSize: 12,
  },
});
