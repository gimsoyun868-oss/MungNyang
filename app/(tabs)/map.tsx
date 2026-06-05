import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Platform,
  FlatList,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PlaceCard } from "@/components/PlaceCard";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { CATEGORY_LABELS, CATEGORY_ICONS, type PlaceCategory } from "@/shared/types";

const CATEGORIES: Array<{ key: string; label: string }> = [
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

const SEOUL_REGION: Region = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const CATEGORY_MARKER_COLORS: Record<string, string> = {
  cafe:         "#C8956C",
  restaurant:   "#E8A838",
  hospital:     "#6BAF6B",
  grooming:     "#A0522D",
  kindergarten: "#8B6F5E",
  hotel:        "#C8956C",
  park:         "#6BAF6B",
  petshop:      "#E8A838",
};

export default function MapScreen() {
  const colors = useColors();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [locationError, setLocationError] = useState(false);

  const { data: places, isLoading } = trpc.places.list.useQuery({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    limit: 50,
  });

  useEffect(() => {
    (async () => {
      if (Platform.OS === "web") return;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationError(true);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setUserLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        mapRef.current?.animateToRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }, 800);
      } catch {
        setLocationError(true);
      }
    })();
  }, []);

  const handleMyLocation = useCallback(() => {
    if (userLocation) {
      mapRef.current?.animateToRegion({
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 600);
    }
  }, [userLocation]);

  const selectedPlace = places?.find((p) => p.id === selectedPlaceId);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Category Filter */}
      <View style={[styles.filterBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
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
              <Text
                style={[
                  styles.filterChipText,
                  { color: selectedCategory === cat.key ? "#FFFFFF" : colors.foreground },
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        {Platform.OS === "web" ? (
          <View style={[styles.webMapFallback, { backgroundColor: colors.secondary }]}>
            <IconSymbol name="map.fill" size={48} color={colors.primary} />
            <Text style={[styles.webMapText, { color: colors.foreground }]}>
              지도는 모바일 앱에서 확인하세요
            </Text>
            <Text style={[styles.webMapSub, { color: colors.muted }]}>
              Expo Go 앱으로 QR 코드를 스캔하세요
            </Text>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            initialRegion={SEOUL_REGION}
            showsUserLocation
            showsMyLocationButton={false}
          >
            {places?.map((place) => (
              <Marker
                key={place.id}
                coordinate={{ latitude: place.lat, longitude: place.lng }}
                onPress={() => setSelectedPlaceId(place.id)}
                pinColor={CATEGORY_MARKER_COLORS[place.category] ?? colors.primary}
                title={place.name}
              />
            ))}
          </MapView>
        )}

        {/* My Location Button */}
        {Platform.OS !== "web" && (
          <Pressable
            onPress={handleMyLocation}
            style={({ pressed }) => [
              styles.myLocationBtn,
              { backgroundColor: colors.surface, borderColor: colors.border },
              pressed && { opacity: 0.75 },
            ]}
          >
            <IconSymbol name="scope" size={22} color={colors.primary} />
          </Pressable>
        )}

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={colors.primary} size="small" />
          </View>
        )}
      </View>

      {/* Bottom Sheet - Selected Place or Place List */}
      <View style={[styles.bottomSheet, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        {selectedPlace ? (
          <View style={styles.selectedPlaceContainer}>
            <View style={styles.selectedPlaceHeader}>
              <Text style={[styles.selectedPlaceTitle, { color: colors.foreground }]} numberOfLines={1}>
                {selectedPlace.name}
              </Text>
              <Pressable onPress={() => setSelectedPlaceId(null)}>
                <IconSymbol name="xmark" size={20} color={colors.muted} />
              </Pressable>
            </View>
            <Text style={[styles.selectedPlaceAddress, { color: colors.muted }]} numberOfLines={1}>
              {selectedPlace.address}
            </Text>
            <Pressable
              onPress={() => router.push({ pathname: "/place/[id]", params: { id: selectedPlace.id } })}
              style={[styles.detailBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.detailBtnText}>상세 보기</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.placeListContainer}>
            <Text style={[styles.placeListTitle, { color: colors.foreground }]}>
              {selectedCategory === "all" ? "주변 장소" : CATEGORY_LABELS[selectedCategory as PlaceCategory]}
              {places && ` (${places.length})`}
            </Text>
            {isLoading ? (
              <ActivityIndicator color={colors.primary} style={{ marginTop: 12 }} />
            ) : !places || places.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.muted }]}>
                해당 카테고리의 장소가 없어요
              </Text>
            ) : (
              <FlatList
                data={places.slice(0, 5)}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
                renderItem={({ item }) => (
                  <PlaceCard
                    place={item}
                    onPress={() => {
                      setSelectedPlaceId(item.id);
                      mapRef.current?.animateToRegion({
                        latitude: item.lat,
                        longitude: item.lng,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }, 600);
                    }}
                  />
                )}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterBar: {
    borderBottomWidth: 1,
    paddingTop: 52,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: "row",
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 4,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  webMapFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  webMapText: {
    fontSize: 16,
    fontWeight: "700",
  },
  webMapSub: {
    fontSize: 13,
  },
  myLocationBtn: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingOverlay: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: 8,
  },
  bottomSheet: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    maxHeight: 220,
  },
  selectedPlaceContainer: {
    gap: 6,
  },
  selectedPlaceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedPlaceTitle: {
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  selectedPlaceAddress: {
    fontSize: 13,
  },
  detailBtn: {
    marginTop: 8,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  detailBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  placeListContainer: {
    gap: 10,
  },
  placeListTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 12,
  },
});
