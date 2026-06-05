import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import { startOAuthLogin } from "@/constants/oauth";

const PET_TYPE_EMOJI: Record<string, string> = {
  dog: "🐶",
  cat: "🐱",
  other: "🐾",
};

const PET_TYPE_LABELS: Record<string, string> = {
  dog: "강아지",
  cat: "고양이",
  other: "기타",
};

export default function ProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user, isAuthenticated, loading, logout } = useAuth();

  const { data: pets, isLoading: loadingPets } = trpc.pets.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const handleLogin = useCallback(async () => {
    await startOAuthLogin();
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  const MenuItem = ({
    icon,
    label,
    onPress,
    danger = false,
  }: {
    icon: string;
    label: string;
    onPress: () => void;
    danger?: boolean;
  }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        { borderBottomColor: colors.border },
        pressed && { backgroundColor: colors.secondary },
      ]}
    >
      <View style={styles.menuItemLeft}>
        <IconSymbol name={icon as any} size={20} color={danger ? colors.error : colors.foreground} />
        <Text style={[styles.menuItemLabel, { color: danger ? colors.error : colors.foreground }]}>
          {label}
        </Text>
      </View>
      <IconSymbol name="chevron.right" size={18} color={colors.muted} />
    </Pressable>
  );

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.primary} style={{ flex: 1 }} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>마이페이지</Text>
        </View>

        {isAuthenticated && user ? (
          <>
            {/* Profile Card */}
            <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.avatarText, { color: colors.accent }]}>
                  {(user.name ?? user.email ?? "U")[0].toUpperCase()}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: colors.foreground }]}>
                  {user.name ?? "사용자"}
                </Text>
                {user.email && (
                  <Text style={[styles.profileEmail, { color: colors.muted }]}>{user.email}</Text>
                )}
              </View>
            </View>

            {/* My Pets */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>내 반려동물</Text>
                <Pressable
                  onPress={() => router.push("/profile/pet/add")}
                  style={({ pressed }) => [
                    styles.addPetBtn,
                    { backgroundColor: colors.primary },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <IconSymbol name="plus" size={14} color="#FFFFFF" />
                  <Text style={styles.addPetBtnText}>추가</Text>
                </Pressable>
              </View>

              {loadingPets ? (
                <ActivityIndicator color={colors.primary} />
              ) : !pets || pets.length === 0 ? (
                <Pressable
                  onPress={() => router.push("/profile/pet/add")}
                  style={[styles.addPetCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <IconSymbol name="plus.circle.fill" size={28} color={colors.primary} />
                  <Text style={[styles.addPetCardText, { color: colors.muted }]}>
                    반려동물을 등록해보세요
                  </Text>
                </Pressable>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petsScroll}>
                  {pets.map((pet) => (
                    <View
                      key={pet.id}
                      style={[styles.petCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    >
                      <Text style={styles.petEmoji}>
                        {PET_TYPE_EMOJI[pet.type] ?? "🐾"}
                      </Text>
                      <Text style={[styles.petName, { color: colors.foreground }]}>{pet.name}</Text>
                      <Text style={[styles.petBreed, { color: colors.muted }]}>
                        {pet.breed ?? PET_TYPE_LABELS[pet.type] ?? pet.type}
                      </Text>
                      {pet.ageYears != null && (
                        <Text style={[styles.petAge, { color: colors.muted }]}>{pet.ageYears}살</Text>
                      )}
                    </View>
                  ))}
                  <Pressable
                    onPress={() => router.push("/profile/pet/add")}
                    style={[styles.petCard, styles.addMorePetCard, { borderColor: colors.border }]}
                  >
                    <IconSymbol name="plus.circle.fill" size={28} color={colors.primary} />
                    <Text style={[styles.petName, { color: colors.primary }]}>추가</Text>
                  </Pressable>
                </ScrollView>
              )}
            </View>

            {/* Menu */}
            <View style={[styles.menuSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <MenuItem
                icon="heart.fill"
                label="찜한 장소"
                onPress={() => router.push("/profile/favorites")}
              />
              <MenuItem
                icon="star.fill"
                label="내가 쓴 리뷰"
                onPress={() => router.push("/profile/reviews" as any)}
              />
              <MenuItem
                icon="rectangle.portrait.and.arrow.right"
                label="로그아웃"
                onPress={handleLogout}
                danger
              />
            </View>
          </>
        ) : (
          /* Not Logged In */
          <View style={styles.loginContainer}>
            <View style={[styles.loginCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={styles.loginEmoji}>🐾</Text>
              <Text style={[styles.loginTitle, { color: colors.foreground }]}>
                로그인하고 더 많은 기능을 사용하세요
              </Text>
              <Text style={[styles.loginDesc, { color: colors.muted }]}>
                찜한 장소 저장, 리뷰 작성,{"\n"}반려동물 프로필 등록이 가능해요
              </Text>
              <Pressable
                onPress={handleLogin}
                style={({ pressed }) => [
                  styles.loginBtn,
                  { backgroundColor: colors.primary },
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Text style={styles.loginBtnText}>로그인 / 회원가입</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
  },
  profileEmail: {
    fontSize: 13,
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  addPetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addPetBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  addPetCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  addPetCardText: {
    fontSize: 14,
    fontWeight: "500",
  },
  petsScroll: {
    flexGrow: 0,
  },
  petCard: {
    width: 100,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    gap: 4,
    marginRight: 10,
  },
  addMorePetCard: {
    backgroundColor: "transparent",
    justifyContent: "center",
  },
  petEmoji: {
    fontSize: 28,
  },
  petName: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  petBreed: {
    fontSize: 11,
    textAlign: "center",
  },
  petAge: {
    fontSize: 11,
    textAlign: "center",
  },
  menuSection: {
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  loginContainer: {
    padding: 20,
  },
  loginCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
    gap: 12,
  },
  loginEmoji: {
    fontSize: 48,
  },
  loginTitle: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 26,
  },
  loginDesc: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  loginBtn: {
    marginTop: 8,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },
  loginBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
