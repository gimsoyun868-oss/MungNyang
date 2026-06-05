import React, { useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PlaceCard } from "@/components/PlaceCard";
import { EmptyState } from "@/components/EmptyState";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

export default function FavoritesScreen() {
  const colors = useColors();
  const router = useRouter();

  const { data: favorites, isLoading } = trpc.favorites.list.useQuery();

  const handlePlacePress = useCallback((id: number) => {
    router.push({ pathname: "/place/[id]", params: { id } });
  }, [router]);

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}>
          <IconSymbol name="arrow.left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>찜한 장소</Text>
        <View style={{ width: 30 }} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : !favorites || favorites.length === 0 ? (
        <EmptyState
          icon="heart"
          title="찜한 장소가 없어요"
          description="마음에 드는 장소를 찜해보세요!"
        />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <PlaceCard
              place={{
                id: item.placeId,
                name: item.placeName ?? "",
                category: item.placeCategory ?? "cafe",
                address: item.placeAddress ?? "",
                imageUrl: item.placeImageUrl,
                avgRating: item.placeAvgRating,
                reviewCount: item.placeReviewCount,
              }}
              onPress={() => handlePlacePress(item.placeId)}
              horizontal
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  listContent: { padding: 16, paddingBottom: 24 },
});
