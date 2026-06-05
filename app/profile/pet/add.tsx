import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

type PetType = "dog" | "cat" | "other";
type Gender = "male" | "female" | "unknown";

const PET_TYPES: Array<{ key: PetType; label: string; emoji: string }> = [
  { key: "dog", label: "강아지", emoji: "🐶" },
  { key: "cat", label: "고양이", emoji: "🐱" },
  { key: "other", label: "기타", emoji: "🐾" },
];

const GENDERS: Array<{ key: Gender; label: string }> = [
  { key: "male", label: "수컷" },
  { key: "female", label: "암컷" },
  { key: "unknown", label: "모름" },
];

export default function AddPetScreen() {
  const colors = useColors();
  const router = useRouter();

  const [name, setName] = useState("");
  const [type, setType] = useState<PetType>("dog");
  const [breed, setBreed] = useState("");
  const [ageYears, setAgeYears] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [gender, setGender] = useState<Gender>("unknown");
  const [personality, setPersonality] = useState("");
  const [notes, setNotes] = useState("");

  const utils = trpc.useUtils();
  const createPetMutation = trpc.pets.create.useMutation({
    onSuccess: () => {
      utils.pets.list.invalidate();
      Alert.alert("완료", "반려동물이 등록되었어요!", [
        { text: "확인", onPress: () => router.back() },
      ]);
    },
    onError: (err) => {
      Alert.alert("오류", err.message);
    },
  });

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert("알림", "이름을 입력해주세요.");
      return;
    }
    await createPetMutation.mutateAsync({
      name: name.trim(),
      type,
      breed: breed.trim() || undefined,
      ageYears: ageYears ? parseInt(ageYears, 10) : undefined,
      weightKg: weightKg ? parseFloat(weightKg) : undefined,
      gender,
      personality: personality.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  }, [name, type, breed, ageYears, weightKg, gender, personality, notes, createPetMutation]);

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.6 }]}>
            <IconSymbol name="arrow.left" size={22} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>반려동물 등록</Text>
          <Pressable
            onPress={handleSubmit}
            disabled={createPetMutation.isPending || !name.trim()}
            style={({ pressed }) => [
              styles.submitBtn,
              { backgroundColor: name.trim() ? colors.primary : colors.border },
              pressed && { opacity: 0.8 },
            ]}
          >
            {createPetMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>저장</Text>
            )}
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Pet Type */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>종류 *</Text>
            <View style={styles.typeRow}>
              {PET_TYPES.map((pt) => (
                <Pressable
                  key={pt.key}
                  onPress={() => setType(pt.key)}
                  style={({ pressed }) => [
                    styles.typeChip,
                    {
                      backgroundColor: type === pt.key ? colors.primary : colors.surface,
                      borderColor: type === pt.key ? colors.primary : colors.border,
                    },
                    pressed && { opacity: 0.75 },
                  ]}
                >
                  <Text style={styles.typeEmoji}>{pt.emoji}</Text>
                  <Text style={[styles.typeLabel, { color: type === pt.key ? "#FFFFFF" : colors.foreground }]}>
                    {pt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Name */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>이름 *</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="반려동물 이름"
              placeholderTextColor={colors.muted}
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
              maxLength={100}
            />
          </View>

          {/* Breed */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>견종/묘종</Text>
            <TextInput
              value={breed}
              onChangeText={setBreed}
              placeholder="예: 말티즈, 코리안숏헤어"
              placeholderTextColor={colors.muted}
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
              maxLength={100}
            />
          </View>

          {/* Age & Weight */}
          <View style={styles.row}>
            <View style={[styles.section, { flex: 1 }]}>
              <Text style={[styles.sectionLabel, { color: colors.foreground }]}>나이 (살)</Text>
              <TextInput
                value={ageYears}
                onChangeText={setAgeYears}
                placeholder="0"
                placeholderTextColor={colors.muted}
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>
            <View style={[styles.section, { flex: 1 }]}>
              <Text style={[styles.sectionLabel, { color: colors.foreground }]}>몸무게 (kg)</Text>
              <TextInput
                value={weightKg}
                onChangeText={setWeightKg}
                placeholder="0.0"
                placeholderTextColor={colors.muted}
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
                keyboardType="decimal-pad"
                maxLength={5}
              />
            </View>
          </View>

          {/* Gender */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>성별</Text>
            <View style={styles.typeRow}>
              {GENDERS.map((g) => (
                <Pressable
                  key={g.key}
                  onPress={() => setGender(g.key)}
                  style={({ pressed }) => [
                    styles.genderChip,
                    {
                      backgroundColor: gender === g.key ? colors.primary : colors.surface,
                      borderColor: gender === g.key ? colors.primary : colors.border,
                    },
                    pressed && { opacity: 0.75 },
                  ]}
                >
                  <Text style={[styles.genderLabel, { color: gender === g.key ? "#FFFFFF" : colors.foreground }]}>
                    {g.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Personality */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>성격</Text>
            <TextInput
              value={personality}
              onChangeText={setPersonality}
              placeholder="예: 활발하고 사람을 좋아해요"
              placeholderTextColor={colors.muted}
              style={[styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>알레르기/주의사항</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="예: 닭고기 알레르기 있음"
              placeholderTextColor={colors.muted}
              style={[styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  headerBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: "700" },
  submitBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 52,
    alignItems: "center",
  },
  submitBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  scrollContent: { padding: 16, gap: 20, paddingBottom: 40 },
  section: { gap: 8 },
  sectionLabel: { fontSize: 14, fontWeight: "600" },
  row: { flexDirection: "row", gap: 12 },
  typeRow: { flexDirection: "row", gap: 10 },
  typeChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  typeEmoji: { fontSize: 20 },
  typeLabel: { fontSize: 14, fontWeight: "600" },
  genderChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  genderLabel: { fontSize: 13, fontWeight: "600" },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    lineHeight: 22,
  },
  textArea: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    lineHeight: 22,
    minHeight: 80,
  },
});
