import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import { COMMUNITY_LABELS, type CommunityCategory } from "@/shared/types";

const CATEGORIES: CommunityCategory[] = ["question", "walk", "review", "free"];

export default function WritePostScreen() {
  const colors = useColors();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [category, setCategory] = useState<CommunityCategory>("free");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const createPostMutation = trpc.community.posts.create.useMutation({
    onSuccess: () => {
      Alert.alert("완료", "게시글이 등록되었어요!", [
        { text: "확인", onPress: () => router.back() },
      ]);
    },
    onError: (err) => {
      Alert.alert("오류", err.message);
    },
  });

  const handleSubmit = useCallback(async () => {
    if (!isAuthenticated) {
      Alert.alert("로그인 필요", "글쓰기는 로그인 후 이용할 수 있어요.");
      return;
    }
    if (!title.trim()) {
      Alert.alert("알림", "제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      Alert.alert("알림", "내용을 입력해주세요.");
      return;
    }
    await createPostMutation.mutateAsync({ category, title: title.trim(), content: content.trim() });
  }, [isAuthenticated, category, title, content, createPostMutation]);

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.6 }]}>
            <IconSymbol name="xmark" size={22} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>글쓰기</Text>
          <Pressable
            onPress={handleSubmit}
            disabled={createPostMutation.isPending || !title.trim() || !content.trim()}
            style={({ pressed }) => [
              styles.submitBtn,
              { backgroundColor: title.trim() && content.trim() ? colors.primary : colors.border },
              pressed && { opacity: 0.8 },
            ]}
          >
            {createPostMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>등록</Text>
            )}
          </Pressable>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
          {/* Category */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>카테고리</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={({ pressed }) => [
                    styles.categoryChip,
                    {
                      backgroundColor: category === cat ? colors.primary : colors.surface,
                      borderColor: category === cat ? colors.primary : colors.border,
                    },
                    pressed && { opacity: 0.75 },
                  ]}
                >
                  <Text style={[styles.categoryChipText, { color: category === cat ? "#FFFFFF" : colors.foreground }]}>
                    {COMMUNITY_LABELS[cat]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Title */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>제목</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="제목을 입력하세요"
              placeholderTextColor={colors.muted}
              style={[styles.titleInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
              maxLength={200}
              returnKeyType="next"
            />
          </View>

          {/* Content */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>내용</Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="내용을 입력하세요"
              placeholderTextColor={colors.muted}
              style={[styles.contentInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
              multiline
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
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
  headerBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: "700" },
  submitBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 52,
    alignItems: "center",
  },
  submitBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  scrollContent: { padding: 16, gap: 20 },
  section: { gap: 8 },
  sectionLabel: { fontSize: 14, fontWeight: "600" },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: { fontSize: 13, fontWeight: "600" },
  titleInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 22,
  },
  contentInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    lineHeight: 24,
    minHeight: 200,
  },
});
