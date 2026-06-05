import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { EmptyState } from "@/components/EmptyState";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import { COMMUNITY_LABELS } from "@/shared/types";

const CATEGORY_COLORS: Record<string, string> = {
  question: "#6BAF6B",
  walk:     "#C8956C",
  review:   "#A0522D",
  free:     "#8B6F5E",
};

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const postId = parseInt(id ?? "0", 10);

  const [commentText, setCommentText] = useState("");

  const { data: post, isLoading } = trpc.community.posts.getById.useQuery({ id: postId }, { enabled: !!postId });
  const { data: comments, isLoading: loadingComments, refetch: refetchComments } = trpc.community.comments.listByPost.useQuery({ postId }, { enabled: !!postId });

  const createCommentMutation = trpc.community.comments.create.useMutation({
    onSuccess: () => {
      setCommentText("");
      refetchComments();
    },
  });

  const handleSubmitComment = useCallback(async () => {
    if (!isAuthenticated) {
      Alert.alert("로그인 필요", "댓글 작성은 로그인 후 이용할 수 있어요.");
      return;
    }
    if (!commentText.trim()) return;
    await createCommentMutation.mutateAsync({ postId, content: commentText.trim() });
  }, [isAuthenticated, commentText, postId, createCommentMutation]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.primary} style={{ flex: 1 }} />
      </ScreenContainer>
    );
  }

  if (!post) {
    return (
      <ScreenContainer>
        <EmptyState icon="exclamationmark.triangle.fill" title="게시글을 찾을 수 없어요" />
      </ScreenContainer>
    );
  }

  const categoryLabel = COMMUNITY_LABELS[post.category as keyof typeof COMMUNITY_LABELS] ?? post.category;
  const categoryColor = CATEGORY_COLORS[post.category] ?? colors.muted;
  const dateStr = new Date(post.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}>
            <IconSymbol name="arrow.left" size={22} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>게시글</Text>
          <View style={{ width: 30 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Post Content */}
          <View style={[styles.postCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.postMeta}>
              <View style={[styles.categoryBadge, { backgroundColor: categoryColor + "20", borderColor: categoryColor }]}>
                <Text style={[styles.categoryText, { color: categoryColor }]}>{categoryLabel}</Text>
              </View>
              <Text style={[styles.dateText, { color: colors.muted }]}>{dateStr}</Text>
            </View>
            <Text style={[styles.postTitle, { color: colors.foreground }]}>{post.title}</Text>
            <View style={styles.authorRow}>
              <View style={[styles.authorAvatar, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.authorAvatarText, { color: colors.accent }]}>
                  {(post.userName ?? "익명")[0]}
                </Text>
              </View>
              <Text style={[styles.authorName, { color: colors.muted }]}>{post.userName ?? "익명"}</Text>
            </View>
            <Text style={[styles.postContent, { color: colors.foreground }]}>{post.content}</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <IconSymbol name="eye.fill" size={14} color={colors.muted} />
                <Text style={[styles.statText, { color: colors.muted }]}>{post.viewCount ?? 0}</Text>
              </View>
              <View style={styles.stat}>
                <IconSymbol name="hand.thumbsup.fill" size={14} color={colors.muted} />
                <Text style={[styles.statText, { color: colors.muted }]}>{post.likeCount ?? 0}</Text>
              </View>
              <View style={styles.stat}>
                <IconSymbol name="bubble.left.fill" size={14} color={colors.muted} />
                <Text style={[styles.statText, { color: colors.muted }]}>{post.commentCount ?? 0}</Text>
              </View>
            </View>
          </View>

          {/* Comments */}
          <View style={styles.commentsSection}>
            <Text style={[styles.commentsTitle, { color: colors.foreground }]}>
              댓글 ({comments?.length ?? 0})
            </Text>
            {loadingComments ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
            ) : !comments || comments.length === 0 ? (
              <View style={styles.emptyComments}>
                <Text style={[styles.emptyCommentsText, { color: colors.muted }]}>
                  첫 번째 댓글을 남겨보세요!
                </Text>
              </View>
            ) : (
              comments.map((comment) => (
                <View key={comment.id} style={[styles.commentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={styles.commentHeader}>
                    <View style={[styles.commentAvatar, { backgroundColor: colors.secondary }]}>
                      <Text style={[styles.commentAvatarText, { color: colors.accent }]}>
                        {(comment.userName ?? "익명")[0]}
                      </Text>
                    </View>
                    <View style={styles.commentMeta}>
                      <Text style={[styles.commentAuthor, { color: colors.foreground }]}>
                        {comment.userName ?? "익명"}
                      </Text>
                      <Text style={[styles.commentDate, { color: colors.muted }]}>
                        {new Date(comment.createdAt).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.commentContent, { color: colors.foreground }]}>{comment.content}</Text>
                </View>
              ))
            )}
          </View>

          <View style={{ height: 80 }} />
        </ScrollView>

        {/* Comment Input */}
        <View style={[styles.commentInputBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder={isAuthenticated ? "댓글을 입력하세요..." : "로그인 후 댓글을 남길 수 있어요"}
            placeholderTextColor={colors.muted}
            style={[styles.commentInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
            multiline
            returnKeyType="done"
            editable={isAuthenticated}
          />
          <Pressable
            onPress={handleSubmitComment}
            disabled={!commentText.trim() || createCommentMutation.isPending}
            style={({ pressed }) => [
              styles.sendBtn,
              { backgroundColor: commentText.trim() ? colors.primary : colors.border },
              pressed && { opacity: 0.8 },
            ]}
          >
            {createCommentMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <IconSymbol name="paperplane.fill" size={18} color="#FFFFFF" />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: "700" },
  postCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  postMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryText: { fontSize: 12, fontWeight: "600" },
  dateText: { fontSize: 12 },
  postTitle: { fontSize: 20, fontWeight: "800", lineHeight: 28 },
  authorRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  authorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  authorAvatarText: { fontSize: 12, fontWeight: "700" },
  authorName: { fontSize: 13 },
  postContent: { fontSize: 15, lineHeight: 24 },
  statsRow: { flexDirection: "row", gap: 16, paddingTop: 4, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
  stat: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { fontSize: 13 },
  commentsSection: { paddingHorizontal: 16, gap: 10 },
  commentsTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  emptyComments: { paddingVertical: 24, alignItems: "center" },
  emptyCommentsText: { fontSize: 14 },
  commentCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 8,
    marginBottom: 8,
  },
  commentHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  commentAvatarText: { fontSize: 12, fontWeight: "700" },
  commentMeta: { gap: 1 },
  commentAuthor: { fontSize: 13, fontWeight: "600" },
  commentDate: { fontSize: 11 },
  commentContent: { fontSize: 14, lineHeight: 22 },
  commentInputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 10,
  },
  commentInput: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
    lineHeight: 20,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
});
