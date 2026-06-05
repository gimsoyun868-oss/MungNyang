import React, { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PlaceCard } from "@/components/PlaceCard";
import { EmptyState } from "@/components/EmptyState";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { CATEGORY_LABELS, CATEGORY_ICONS, type PlaceCategory } from "@/shared/types";

const CATEGORIES: PlaceCategory[] = [
  "cafe", "restaurant", "hospital", "grooming",
  "kindergarten", "hotel", "park", "petshop",
];

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();

  const { data: popularPlaces, isLoading: loadingPopular } = trpc.places.popular.useQuery({ limit: 10 });
  const { data: recentPlaces, isLoading: loadingRecent } = trpc.places.list.useQuery({ sort: "reviews", limit: 8 });

  const handleCategoryPress = useCallback((category: PlaceCategory) => {
    router.push({ pathname: "/search", params: { category } });
  }, [router]);

  const handlePlacePress = useCallback((id: number) => {
    router.push({ pathname: "/place/[id]", params: { id } });
  }, [router]);

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.logoRow}>
            <IconSymbol name="pawprint.fill" size={28} color={colors.primary} />
            <Text style={[styles.logoText, { color: colors.foreground }]}>멍냥</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => router.push("/search")}
              style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
            >
              <IconSymbol name="magnifyingglass" size={24} color={colors.foreground} />
            </Pressable>
          </View>
        </View>

        {/* Hero Banner */}
        <View style={[styles.heroBanner, { backgroundColor: colors.primary }]}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>반려동물과 함께{"\n"}어디든 갈 수 있어요 🐾</Text>
            <Text style={styles.heroSubtitle}>카페, 식당, 병원, 미용실까지{"\n"}한 번에 찾아보세요</Text>
          </View>
          <View style={styles.heroPawContainer}>
            <Text style={styles.heroPaw}>🐶🐱</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>카테고리</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => handleCategoryPress(cat)}
                style={({ pressed }) => [
                  styles.categoryItem,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  pressed && { opacity: 0.75, transform: [{ scale: 0.96 }] },
                ]}
              >
                <View style={[styles.categoryIconWrapper, { backgroundColor: colors.secondary }]}>
                  <IconSymbol
                    name={CATEGORY_ICONS[cat] as any}
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <Text style={[styles.categoryLabel, { color: colors.foreground }]}>
                  {CATEGORY_LABELS[cat]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Popular Places */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>인기 장소</Text>
            <Pressable onPress={() => router.push({ pathname: "/search", params: { sort: "reviews" } })}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>전체보기</Text>
            </Pressable>
          </View>
          {loadingPopular ? (
            <ActivityIndicator color={colors.primary} style={styles.loader} />
          ) : !popularPlaces || popularPlaces.length === 0 ? (
            <EmptyState
              icon="pawprint"
              title="아직 등록된 장소가 없어요"
              description="첫 번째 장소를 등록해보세요!"
            />
          ) : (
            <FlatList
              data={popularPlaces}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <PlaceCard
                  place={item}
                  onPress={() => handlePlacePress(item.id)}
                />
              )}
            />
          )}
        </View>

        {/* Review-based Recommendations */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>리뷰 많은 장소</Text>
            <Pressable onPress={() => router.push({ pathname: "/search", params: { sort: "rating" } })}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>전체보기</Text>
            </Pressable>
          </View>
          {loadingRecent ? (
            <ActivityIndicator color={colors.primary} style={styles.loader} />
          ) : !recentPlaces || recentPlaces.length === 0 ? (
            <EmptyState
              icon="star"
              title="아직 리뷰가 없어요"
              description="방문 후 리뷰를 남겨보세요!"
            />
          ) : (
            recentPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onPress={() => handlePlacePress(place.id)}
                horizontal
              />
            ))
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    padding: 4,
  },
  heroBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  heroContent: {
    flex: 1,
    gap: 6,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 26,
  },
  heroSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 20,
  },
  heroPawContainer: {
    marginLeft: 12,
  },
  heroPaw: {
    fontSize: 40,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  lastSection: {
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "600",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryItem: {
    width: "22%",
    aspectRatio: 0.9,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 8,
  },
  categoryIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  horizontalList: {
    paddingRight: 16,
  },
  loader: {
    marginVertical: 20,
  },
});
