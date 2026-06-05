import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PlaceCard } from "@/components/PlaceCard";
import { EmptyState } from "@/components/EmptyState";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { SORT_LABELS, type SortOption } from "@/shared/types";

const CATEGORIES = [
  { key: "all", label: "전체" },
  { key: "cafe", label: "카페" },
  { key: "restaurant", label: "식당" },
  { key: "hospital", label: "동물병원" },
  { key: "grooming", label: "미용실" },
  { key: "kindergarten", label: "유치원" },
  { key: "hotel", label: "호텔/위탁" },
  { key: "park", label: "놀이터/공원" },
  { key: "petshop", label: "펫샵" },
];

const SORTS: Array<{ key: SortOption; label: string }> = [
  { key: "distance", label: "거리순" },
  { key: "rating", label: "평점순" },
  { key: "reviews", label: "리뷰순" },
];

export default function SearchScreen() {
  const params = useLocalSearchParams<{ category?: string; sort?: string }>();
  const colors = useColors();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(params.category ?? "all");
  const [selectedSort, setSelectedSort] = useState<SortOption>((params.sort as SortOption) ?? "reviews");

  const { data: places, isLoading } = trpc.places.list.useQuery({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    sort: selectedSort,
    search: query.trim() || undefined,
    limit: 50,
  });

  const handlePlacePress = useCallback((id: number) => {
    router.push({ pathname: "/place/[id]", params: { id } });
  }, [router]);

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={[styles.searchHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}>
          <IconSymbol name="arrow.left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={[styles.searchInputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <IconSymbol name="magnifyingglass" size={18} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="장소 이름, 주소로 검색"
            placeholderTextColor={colors.muted}
            style={[styles.searchInput, { color: colors.foreground }]}
            returnKeyType="search"
            autoFocus
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <IconSymbol name="xmark.circle.fill" size={18} color={colors.muted} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={[styles.filterSection, { borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.key}
              onPress={() => setSelectedCategory(cat.key)}
              style={({ pressed }) => [
                styles.filterChip,
                {
                  backgroundColor: selectedCategory === cat.key ? colors.primary : colors.surface,
                  borderColor: selectedCategory === cat.key ? colors.primary : colors.border,
                },
                pressed && { opacity: 0.75 },
              ]}
            >
              <Text style={[styles.filterChipText, { color: selectedCategory === cat.key ? "#FFFFFF" : colors.foreground }]}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.sortSection, { borderBottomColor: colors.border }]}>
        <View style={styles.sortRow}>
          {SORTS.map((sort) => (
            <Pressable
              key={sort.key}
              onPress={() => setSelectedSort(sort.key)}
              style={({ pressed }) => [
                styles.sortChip,
                selectedSort === sort.key && [styles.sortChipActive, { borderColor: colors.primary }],
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={[styles.sortChipText, { color: selectedSort === sort.key ? colors.primary : colors.muted }, selectedSort === sort.key && styles.sortChipTextActive]}>
                {sort.label}
              </Text>
            </Pressable>
          ))}
        </View>
        {places && <Text style={[styles.resultCount, { color: colors.muted }]}>{places.length}개 장소</Text>}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : !places || places.length === 0 ? (
        <EmptyState
          icon="magnifyingglass"
          title="검색 결과가 없어요"
          description={query ? `'${query}'에 대한 결과가 없어요` : "해당 카테고리의 장소가 없어요"}
        />
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <PlaceCard place={item} onPress={() => handlePlacePress(item.id)} horizontal />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
  },
  backBtn: { padding: 4 },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, lineHeight: 20 },
  filterSection: { borderBottomWidth: 1 },
  filterContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8, flexDirection: "row" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, marginRight: 4 },
  filterChipText: { fontSize: 13, fontWeight: "600" },
  sortSection: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  sortRow: { flexDirection: "row", gap: 8 },
  sortChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16, borderWidth: 1, borderColor: "transparent" },
  sortChipActive: { borderWidth: 1 },
  sortChipText: { fontSize: 13, fontWeight: "500" },
  sortChipTextActive: { fontWeight: "700" },
  resultCount: { fontSize: 13 },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  listContent: { padding: 16, paddingBottom: 24 },
});
