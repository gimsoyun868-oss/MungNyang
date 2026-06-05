import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { startOAuthLogin } from "@/constants/oauth";

export default function LoginScreen() {
  const colors = useColors();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // If already logged in, go back
  if (isAuthenticated) {
    router.back();
    return null;
  }

  const handleGoogleLogin = useCallback(async () => {
    try {
      await startOAuthLogin();
    } catch (err) {
      Alert.alert("로그인 실패", "다시 시도해주세요.");
    }
  }, []);

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right", "bottom"]}>
      {/* Close Button */}
      <View style={styles.topRow}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}
        >
          <IconSymbol name="xmark" size={22} color={colors.foreground} />
        </Pressable>
      </View>

      {/* Hero */}
      <View style={styles.heroSection}>
        <View style={[styles.logoContainer, { backgroundColor: colors.secondary }]}>
          <Text style={styles.logoEmoji}>🐾</Text>
        </View>
        <Text style={[styles.appName, { color: colors.foreground }]}>멍냥</Text>
        <Text style={[styles.tagline, { color: colors.muted }]}>
          반려동물과 함께하는 모든 장소{"\n"}한 곳에서 찾아보세요
        </Text>
      </View>

      {/* Login Buttons */}
      <View style={styles.loginSection}>
        <Pressable
          onPress={handleGoogleLogin}
          style={({ pressed }) => [
            styles.loginBtn,
            { backgroundColor: "#FFFFFF", borderColor: colors.border },
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={[styles.loginBtnText, { color: "#3C4043" }]}>Google로 계속하기</Text>
        </Pressable>

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.muted }]}>또는</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <View style={[styles.benefitCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.benefitTitle, { color: colors.foreground }]}>로그인하면 이런 게 가능해요</Text>
          {[
            { icon: "heart.fill", text: "마음에 드는 장소 찜하기" },
            { icon: "star.fill", text: "방문 후기 작성하기" },
            { icon: "bubble.left.fill", text: "커뮤니티 참여하기" },
            { icon: "pawprint.fill", text: "반려동물 프로필 등록하기" },
          ].map((benefit) => (
            <View key={benefit.text} style={styles.benefitItem}>
              <IconSymbol name={benefit.icon as any} size={16} color={colors.primary} />
              <Text style={[styles.benefitText, { color: colors.foreground }]}>{benefit.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Terms */}
      <View style={styles.termsSection}>
        <Text style={[styles.termsText, { color: colors.muted }]}>
          로그인 시 멍냥의 이용약관 및 개인정보처리방침에{"\n"}동의하는 것으로 간주됩니다.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: "flex-end",
  },
  closeBtn: { padding: 8 },
  heroSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  logoEmoji: { fontSize: 40 },
  appName: {
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  loginSection: {
    paddingHorizontal: 24,
    gap: 16,
    paddingBottom: 16,
  },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: "900",
    color: "#4285F4",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 13 },
  benefitCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  benefitText: { fontSize: 14 },
  termsSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: "center",
  },
  termsText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});
