import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { CATEGORY_LABELS } from "@/shared/types";

export type PlaceCardData = {
  id: number;
  name: string;
  category: string;
  address: string;
  imageUrl?: string | null;
  avgRating?: string | number | null;
  reviewCount?: number | null;
  distance?: number | null;
  allowSmallDog?: boolean | null;
  allowMediumDog?: boolean | null;
  allowLargeDog?: boolean | null;
  allowCat?: boolean | null;
  hasParking?: boolean | null;
};

type Props = {
  place: PlaceCardData;
  onPress: () => void;
  horizontal?: boolean;
};

export function PlaceCard({ place, onPress, horizontal = false }: Props) {
  const colors = useColors();
  const rating = place.avgRating ? Number(place.avgRating).toFixed(1) : "0.0";
  const categoryLabel = CATEGORY_LABELS[place.category as keyof typeof CATEGORY_LABELS] ?? place.category;

  if (horizontal) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.horizontalCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
          pressed && { opacity: 0.85 },
        ]}
      >
        <View style={[styles.horizontalImageWrapper, { backgroundColor: colors.secondary }]}>
          {place.imageUrl ? (
            <Image source={{ uri: place.imageUrl }} style={styles.horizontalImage} />
          ) : (
            <View style={[styles.horizontalImagePlaceholder, { backgroundColor: colors.secondary }]}>
              <IconSymbol name="pawprint.fill" size={28} color={colors.primary} />
            </View>
          )}
        </View>
        <View style={styles.horizontalContent}>
          <View style={styles.categoryBadgeRow}>
            <View style={[styles.categoryBadge, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.categoryBadgeText, { color: colors.accent }]}>{categoryLabel}</Text>
            </View>
          </View>
          <Text style={[styles.placeName, { color: colors.foreground }]} numberOfLines={1}>
            {place.name}
          </Text>
          <Text style={[styles.placeAddress, { color: colors.muted }]} numberOfLines={1}>
            {place.address}
          </Text>
          <View style={styles.ratingRow}>
            <IconSymbol name="star.fill" size={12} color="#F59E0B" />
            <Text style={[styles.ratingText, { color: colors.foreground }]}>{rating}</Text>
            <Text style={[styles.reviewCount, { color: colors.muted }]}>({place.reviewCount ?? 0})</Text>
            {place.distance != null && (
              <Text style={[styles.distance, { color: colors.muted }]}>
                · {place.distance < 1 ? `${Math.round(place.distance * 1000)}m` : `${place.distance.toFixed(1)}km`}
              </Text>
            )}
          </View>
          <View style={styles.tagsRow}>
            {place.allowSmallDog && <PetTag label="소형견" color={colors.primary} />}
            {place.allowMediumDog && <PetTag label="중형견" color={colors.primary} />}
            {place.allowLargeDog && <PetTag label="대형견" color={colors.primary} />}
            {place.allowCat && <PetTag label="고양이" color={colors.accent} />}
            {place.hasParking && <PetTag label="주차" color={colors.muted} />}
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.verticalCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={[styles.verticalImageWrapper, { backgroundColor: colors.secondary }]}>
        {place.imageUrl ? (
          <Image source={{ uri: place.imageUrl }} style={styles.verticalImage} />
        ) : (
          <View style={[styles.verticalImagePlaceholder, { backgroundColor: colors.secondary }]}>
            <IconSymbol name="pawprint.fill" size={36} color={colors.primary} />
          </View>
        )}
      </View>
      <View style={styles.verticalContent}>
        <View style={[styles.categoryBadge, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.categoryBadgeText, { color: colors.accent }]}>{categoryLabel}</Text>
        </View>
        <Text style={[styles.placeName, { color: colors.foreground }]} numberOfLines={2}>
          {place.name}
        </Text>
        <View style={styles.ratingRow}>
          <IconSymbol name="star.fill" size={12} color="#F59E0B" />
          <Text style={[styles.ratingText, { color: colors.foreground }]}>{rating}</Text>
          <Text style={[styles.reviewCount, { color: colors.muted }]}>({place.reviewCount ?? 0})</Text>
        </View>
      </View>
    </Pressable>
  );
}

function PetTag({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.petTag, { borderColor: color }]}>
      <Text style={[styles.petTagText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Horizontal (list) card
  horizontalCard: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  horizontalImageWrapper: {
    width: 110,
    height: 110,
  },
  horizontalImage: {
    width: 110,
    height: 110,
  },
  horizontalImagePlaceholder: {
    width: 110,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  horizontalContent: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  categoryBadgeRow: {
    flexDirection: "row",
  },
  // Vertical (grid) card
  verticalCard: {
    width: 160,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginRight: 12,
  },
  verticalImageWrapper: {
    width: "100%",
    height: 110,
  },
  verticalImage: {
    width: "100%",
    height: 110,
  },
  verticalImagePlaceholder: {
    width: "100%",
    height: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  verticalContent: {
    padding: 10,
    gap: 4,
  },
  // Shared
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 2,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  placeName: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
  placeAddress: {
    fontSize: 12,
    lineHeight: 16,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "600",
  },
  reviewCount: {
    fontSize: 12,
  },
  distance: {
    fontSize: 12,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 2,
  },
  petTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  petTagText: {
    fontSize: 10,
    fontWeight: "500",
  },
});
