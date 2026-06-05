import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PostCard } from "@/components/PostCard";
import { EmptyState } from "@/components/EmptyState";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { COMMUNITY_LABELS, type CommunityCategory } from "@/shared/types";

const TABS: Array<{ key: string; label: string }> = [
  { key: "all", label: "전체" },
  { key: "question", label: "질문" },
  { key: "walk", label: "산책친구" },
  { key: "review", label: "후기" },
  { key: "free", label: "자유" },
];

export default function CommunityScreen() {
  const colors = useColors();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");

  const { data: posts, isLoading, refetch } = trpc.community.posts.list.useQuery({
    category: activeTab === "all" ? undefined : activeTab as CommunityCategory,
    limit: 30,
  });

  const handlePostPress = useCallback((id: number) => {
    router.push({ pathname: "/community/post/[id]", params: { id } });
  }, [router]);

  const handleWrite = useCallback(() => {
    router.push("/community/write");
  }, [router]);

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>커뮤니티</Text>
        <Pressable
          onPress={handleWrite}
          style={({ pressed }) => [
            styles.writeBtn,
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.8 },
          ]}
        >
          <IconSymbol name="plus" size={16} color="#FFFFFF" />
          <Text style={styles.writeBtnText}>글쓰기</Text>
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[
              styles.tab,
              activeTab === tab.key && [styles.activeTab, { borderBottomColor: colors.primary }],
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab.key ? colors.primary : colors.muted },
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Post List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : !posts || posts.length === 0 ? (
        <EmptyState
          icon="bubble.left.fill"
          title="아직 게시글이 없어요"
          description="첫 번째 글을 작성해보세요!"
        />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <PostCard post={item} onPress={() => handlePostPress(item.id)} />
          )}
          onRefresh={refetch}
          refreshing={isLoading}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <Pressable
        onPress={handleWrite}
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: colors.primary },
          pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
        ]}
      >
        <IconSymbol name="plus" size={26} color="#FFFFFF" />
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  writeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  writeBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
  },
  activeTabText: {
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
});
