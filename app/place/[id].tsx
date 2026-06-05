import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StarRating } from "@/components/StarRating";
import { ReviewCard } from "@/components/ReviewCard";
import { EmptyState } from "@/components/EmptyState";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import { CATEGORY_LABELS } from "@/shared/types";

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const placeId = parseInt(id ?? "0", 10);

  const { data: place, isLoading } = trpc.places.getById.useQuery({ id: placeId }, { enabled: !!placeId });
  const { data: reviews, isLoading: loadingReviews } = trpc.reviews.listByPlace.useQuery({ placeId }, { enabled: !!placeId });
  const { data: favoriteData, refetch: refetchFavorite } = trpc.favorites.check.useQuery(
    { placeId },
    { enabled: isAuthenticated && !!placeId }
  );

  const toggleFavoriteMutation = trpc.favorites.toggle.useMutation({
    onSuccess: () => refetchFavorite(),
  });

  const isFavorite = favoriteData ?? false;

  const handleFavorite = useCallback(async () => {
    if (!isAuthenticated) {
      Alert.alert("로그인 필요", "찜하기는 로그인 후 이용할 수 있어요.", [
        { text: "취소" },
        { text: "로그인", onPress: () => router.push("/login" as any) },
      ]);
      return;
    }
    await toggleFavoriteMutation.mutateAsync({ placeId });
  }, [isAuthenticated, placeId, toggleFavoriteMutation, router]);

  const handleCall = useCallback(() => {
    if (place?.phone) {
      Linking.openURL(`tel:${place.phone}`);
    }
  }, [place?.phone]);

  const handleDirections = useCallback(() => {
    if (place) {
      const url = `https://maps.apple.com/?daddr=${place.lat},${place.lng}&dirflg=d`;
      Linking.openURL(url);
    }
  }, [place]);

  const handleWriteReview = useCallback(() => {
    if (!isAuthenticated) {
      Alert.alert("로그인 필요", "리뷰 작성은 로그인 후 이용할 수 있어요.", [
        { text: "취소" },
        { text: "로그인", onPress: () => router.push("/login" as any) },
      ]);
      return;
    }
  }, [isAuthenticated, placeId, router]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.primary} style={{ flex: 1 }} />
      </ScreenContainer>
    );
  }

  if (!place) {
    return (
      <ScreenContainer>
        <EmptyState icon="exclamationmark.triangle.fill" title="장소를 찾을 수 없어요" />
      </ScreenContainer>
    );
  }

  const avgRating = Number(place.avgRating ?? 0);
  const categoryLabel = CATEGORY_LABELS[place.category as keyof typeof CATEGORY_LABELS] ?? place.category;

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image / Placeholder */}
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.secondary }]}>
          <IconSymbol name="pawprint.fill" size={60} color={colors.primary} />
        </View>

        {/* Back & Favorite */}
        <View style={styles.topActions}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.topBtn, { backgroundColor: colors.surface }, pressed && { opacity: 0.7 }]}
          >
            <IconSymbol name="arrow.left" size={20} color={colors.foreground} />
          </Pressable>
          <Pressable
            onPress={handleFavorite}
            style={({ pressed }) => [styles.topBtn, { backgroundColor: colors.surface }, pressed && { opacity: 0.7 }]}
          >
            <IconSymbol
              name={isFavorite ? "heart.fill" : "heart"}
              size={20}
              color={isFavorite ? "#E53E3E" : colors.foreground}
            />
          </Pressable>
        </View>

        {/* Place Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.categoryBadge, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.categoryText, { color: colors.accent }]}>{categoryLabel}</Text>
          </View>
          <Text style={[styles.placeName, { color: colors.foreground }]}>{place.name}</Text>

          <View style={styles.ratingRow}>
            <StarRating rating={avgRating} size={18} />
            <Text style={[styles.ratingValue, { color: colors.foreground }]}>{avgRating.toFixed(1)}</Text>
            <Text style={[styles.reviewCountText, { color: colors.muted }]}>
              리뷰 {place.reviewCount ?? 0}개
            </Text>
          </View>

          <View style={styles.addressRow}>
            <IconSymbol name="location.fill" size={14} color={colors.muted} />
            <Text style={[styles.addressText, { color: colors.muted }]}>{place.address}</Text>
          </View>

          {place.phone && (
            <View style={styles.infoRow}>
              <IconSymbol name="phone.fill" size={14} color={colors.muted} />
              <Text style={[styles.infoText, { color: colors.muted }]}>{place.phone}</Text>
            </View>
          )}

          {place.openingHours && (
            <View style={styles.infoRow}>
              <IconSymbol name="clock" size={14} color={colors.muted} />
              <Text style={[styles.infoText, { color: colors.muted }]}>{place.openingHours}</Text>
            </View>
          )}

          {place.priceInfo && (
            <View style={styles.infoRow}>
              <IconSymbol name="tag.fill" size={14} color={colors.muted} />
              <Text style={[styles.infoText, { color: colors.muted }]}>{place.priceInfo}</Text>
            </View>
          )}
        </View>

        {/* Pet Info Tags */}
        <View style={[styles.petInfoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.subSectionTitle, { color: colors.foreground }]}>반려동물 정보</Text>
          <View style={styles.petTagsGrid}>
            <PetInfoTag label="소형견" enabled={place.allowSmallDog ?? false} colors={colors} />
            <PetInfoTag label="중형견" enabled={place.allowMediumDog ?? false} colors={colors} />
            <PetInfoTag label="대형견" enabled={place.allowLargeDog ?? false} colors={colors} />
            <PetInfoTag label="고양이" enabled={place.allowCat ?? false} colors={colors} />
            <PetInfoTag label="주차 가능" enabled={place.hasParking ?? false} colors={colors} />
            <PetInfoTag label="예약 가능" enabled={place.hasReservation ?? false} colors={colors} />
          </View>
        </View>

        {/* Description */}
        {place.description && (
          <View style={[styles.descCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.subSectionTitle, { color: colors.foreground }]}>소개</Text>
            <Text style={[styles.descText, { color: colors.muted }]}>{place.description}</Text>
          </View>
        )}

        {/* Reviews */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={[styles.subSectionTitle, { color: colors.foreground }]}>
              리뷰 ({place.reviewCount ?? 0})
            </Text>
            <Pressable
              onPress={handleWriteReview}
              style={({ pressed }) => [
                styles.writeReviewBtn,
                { backgroundColor: colors.primary },
                pressed && { opacity: 0.8 },
              ]}
            >
              <IconSymbol name="pencil" size={14} color="#FFFFFF" />
              <Text style={styles.writeReviewBtnText}>리뷰 작성</Text>
            </Pressable>
          </View>

          {loadingReviews ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
          ) : !reviews || reviews.length === 0 ? (
            <EmptyState
              icon="star"
              title="아직 리뷰가 없어요"
              description="첫 번째 리뷰를 작성해보세요!"
            />
          ) : (
            reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <Pressable
          onPress={handleCall}
          style={({ pressed }) => [
            styles.actionBtn,
            { borderColor: colors.border },
            pressed && { opacity: 0.7 },
          ]}
          disabled={!place.phone}
        >
          <IconSymbol name="phone.fill" size={18} color={place.phone ? colors.primary : colors.muted} />
          <Text style={[styles.actionBtnText, { color: place.phone ? colors.primary : colors.muted }]}>
            전화하기
          </Text>
        </Pressable>
        <Pressable
          onPress={handleDirections}
          style={({ pressed }) => [
            styles.actionBtn,
            { borderColor: colors.border },
            pressed && { opacity: 0.7 },
          ]}
        >
          <IconSymbol name="car.fill" size={18} color={colors.primary} />
          <Text style={[styles.actionBtnText, { color: colors.primary }]}>길찾기</Text>
        </Pressable>
        <Pressable
          onPress={handleWriteReview}
          style={({ pressed }) => [
            styles.actionBtnPrimary,
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.85 },
          ]}
        >
          <IconSymbol name="pencil" size={18} color="#FFFFFF" />
          <Text style={styles.actionBtnPrimaryText}>리뷰 작성</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

function PetInfoTag({
  label,
  enabled,
  colors,
}: {
  label: string;
  enabled: boolean;
  colors: any;
}) {
  return (
    <View
      style={[
        styles.petInfoTag,
        {
          backgroundColor: enabled ? colors.primary + "20" : colors.secondary,
          borderColor: enabled ? colors.primary : colors.border,
        },
      ]}
    >
      <IconSymbol
        name={enabled ? "checkmark.circle.fill" : "xmark.circle.fill"}
        size={14}
        color={enabled ? colors.primary : colors.muted}
      />
      <Text style={[styles.petInfoTagText, { color: enabled ? colors.primary : colors.muted }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  imagePlaceholder: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  topActions: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  placeName: {
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 30,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  reviewCountText: {
    fontSize: 13,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 4,
  },
  addressText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    flex: 1,
  },
  petInfoCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  petTagsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  petInfoTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  petInfoTagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  descCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  descText: {
    fontSize: 14,
    lineHeight: 22,
  },
  reviewsSection: {
    paddingHorizontal: 16,
    gap: 10,
  },
  reviewsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  writeReviewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  writeReviewBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  bottomBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 10,
    alignItems: "center",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  actionBtnPrimary: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionBtnPrimaryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
