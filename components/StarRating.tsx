import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";

type Props = {
  rating: number;
  maxStars?: number;
  size?: number;
  color?: string;
  onRate?: (rating: number) => void;
};

export function StarRating({ rating, maxStars = 5, size = 20, color = "#F59E0B", onRate }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= Math.round(rating);
        return (
          <Pressable
            key={i}
            onPress={() => onRate?.(starValue)}
            style={({ pressed }) => pressed && onRate ? { opacity: 0.7 } : {}}
            disabled={!onRate}
          >
            <IconSymbol
              name={filled ? "star.fill" : "star"}
              size={size}
              color={filled ? color : "#D1D5DB"}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 2,
  },
});
