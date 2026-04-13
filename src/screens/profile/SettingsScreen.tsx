import { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { t } from "../../i18n";
import { Locale, useAuthStore } from "../../store/authStore";
import {
  ActivityLevel,
  GoalDirection,
  HealthProfile,
  Sex,
  UserLocation,
  useDataStore
} from "../../store/dataStore";
import { colors } from "../../theme/colors";

const locales: Locale[] = ["ru", "kk", "en"];
const sexOptions: Sex[] = ["male", "female"];
const activityOptions: ActivityLevel[] = ["light", "moderate", "active"];
const goalOptions: GoalDirection[] = ["lose", "gain"];
const locationOptions: UserLocation[] = ["home", "gym", "office"];

type DraftProfile = {
  name: string;
  sex: Sex;
  age: string;
  heightCm: string;
  currentWeightKg: string;
  goalWeightKg: string;
  activityLevel: ActivityLevel;
  goalDirection: GoalDirection;
};

const toDraft = (profile: HealthProfile): DraftProfile => ({
  name: profile.name,
  sex: profile.sex,
  age: String(profile.age),
  heightCm: String(profile.heightCm),
  currentWeightKg: String(profile.currentWeightKg),
  goalWeightKg: String(profile.goalWeightKg),
  activityLevel: profile.activityLevel,
  goalDirection: profile.goalDirection
});

const parsePositiveNumber = (value: string) => {
  const normalized = value.replace(",", ".").trim();
  const number = Number(normalized);

  return Number.isFinite(number) && number > 0 ? number : null;
};

export const SettingsScreen = () => {
  const selectedLocale = useAuthStore((s) => s.user.locale);
  const setLocale = useAuthStore((s) => s.setLocale);
  const profile = useDataStore((s) => s.profile);
  const preferredLocation = useDataStore((s) => s.preferredLocation);
  const updateProfile = useDataStore((s) => s.updateProfile);
  const setPreferredLocation = useDataStore((s) => s.setPreferredLocation);
  const [draft, setDraft] = useState<DraftProfile>(() => toDraft(profile));
  const [selectedLocation, setSelectedLocation] = useState<UserLocation>(preferredLocation);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setDraft(toDraft(profile));
  }, [profile]);

  useEffect(() => {
    setSelectedLocation(preferredLocation);
  }, [preferredLocation]);

  const updateDraft = <K extends keyof DraftProfile>(key: K, value: DraftProfile[K]) => {
    setDraft((current) => ({
      ...current,
      [key]: value
    }));
  };

  const saveProfile = () => {
    const age = parsePositiveNumber(draft.age);
    const heightCm = parsePositiveNumber(draft.heightCm);
    const currentWeightKg = parsePositiveNumber(draft.currentWeightKg);
    const goalWeightKg = parsePositiveNumber(draft.goalWeightKg);

    if (!draft.name.trim() || !age || !heightCm || !currentWeightKg || !goalWeightKg) {
      setMessage("Please fill in your name, age, height, current weight, and goal weight.");
      return;
    }

    updateProfile({
      name: draft.name.trim(),
      sex: draft.sex,
      age: Math.round(age),
      heightCm: Number(heightCm.toFixed(1)),
      currentWeightKg: Number(currentWeightKg.toFixed(1)),
      goalWeightKg: Number(goalWeightKg.toFixed(1)),
      activityLevel: draft.activityLevel,
      goalDirection: draft.goalDirection
    });
    setPreferredLocation(selectedLocation);
    setMessage("Profile updated. BodyFlow is now recalculating your targets and plans.");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Profile & settings</Text>
        <Text style={styles.copy}>
          Set your real body data and goal so nutrition, calorie targets, BMI, and workout plans
          adapt to you.
        </Text>

        <Card style={styles.card}>
          <Text style={styles.subTitle}>Personal profile</Text>
          <View style={styles.formGrid}>
            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                value={draft.name}
                onChangeText={(value) => updateDraft("name", value)}
                placeholder="Your name"
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                value={draft.age}
                onChangeText={(value) => updateDraft("age", value)}
                keyboardType="numeric"
                placeholder="29"
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                value={draft.heightCm}
                onChangeText={(value) => updateDraft("heightCm", value)}
                keyboardType="decimal-pad"
                placeholder="178"
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Current weight (kg)</Text>
              <TextInput
                value={draft.currentWeightKg}
                onChangeText={(value) => updateDraft("currentWeightKg", value)}
                keyboardType="decimal-pad"
                placeholder="82.9"
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Goal weight (kg)</Text>
              <TextInput
                value={draft.goalWeightKg}
                onChangeText={(value) => updateDraft("goalWeightKg", value)}
                keyboardType="decimal-pad"
                placeholder="75"
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
              />
            </View>
          </View>

          <Text style={styles.groupTitle}>Sex</Text>
          <View style={styles.optionRow}>
            {sexOptions.map((option) => (
              <Pressable
                key={option}
                onPress={() => updateDraft("sex", option)}
                style={[styles.pill, draft.sex === option && styles.pillActive]}
              >
                <Text style={[styles.pillLabel, draft.sex === option && styles.pillLabelActive]}>
                  {option === "male" ? "Male" : "Female"}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.groupTitle}>Goal</Text>
          <View style={styles.optionRow}>
            {goalOptions.map((option) => (
              <Pressable
                key={option}
                onPress={() => updateDraft("goalDirection", option)}
                style={[styles.pill, draft.goalDirection === option && styles.pillActive]}
              >
                <Text
                  style={[
                    styles.pillLabel,
                    draft.goalDirection === option && styles.pillLabelActive
                  ]}
                >
                  {option === "lose" ? "Lose weight" : "Gain weight"}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.groupTitle}>Activity level</Text>
          <View style={styles.optionRow}>
            {activityOptions.map((option) => (
              <Pressable
                key={option}
                onPress={() => updateDraft("activityLevel", option)}
                style={[styles.pill, draft.activityLevel === option && styles.pillActive]}
              >
                <Text
                  style={[
                    styles.pillLabel,
                    draft.activityLevel === option && styles.pillLabelActive
                  ]}
                >
                  {option === "light"
                    ? "Light"
                    : option === "moderate"
                      ? "Moderate"
                      : "Active"}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.groupTitle}>Workout location</Text>
          <View style={styles.optionRow}>
            {locationOptions.map((option) => (
              <Pressable
                key={option}
                onPress={() => setSelectedLocation(option)}
                style={[styles.pill, selectedLocation === option && styles.pillActive]}
              >
                <Text
                  style={[
                    styles.pillLabel,
                    selectedLocation === option && styles.pillLabelActive
                  ]}
                >
                  {option === "home"
                    ? "Home"
                    : option === "gym"
                      ? "Gym"
                      : "Office"}
                </Text>
              </Pressable>
            ))}
          </View>

          <Button title="Save personal profile" onPress={saveProfile} style={styles.saveButton} />
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </Card>

        <Card style={styles.card}>
          <Text style={styles.subTitle}>{t("language")}</Text>
          {locales.map((locale) => (
            <Pressable key={locale} onPress={() => setLocale(locale)} style={styles.row}>
              <Text style={styles.rowLabel}>{locale.toUpperCase()}</Text>
              <View style={[styles.dot, selectedLocale === locale && styles.dotActive]} />
            </Pressable>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 20, gap: 16, paddingBottom: 120 },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: "700" },
  copy: { color: colors.textSecondary, lineHeight: 22 },
  card: { padding: 0 },
  subTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: "700", marginBottom: 14 },
  formGrid: { gap: 12 },
  field: { gap: 8 },
  label: { color: colors.textSecondary, fontSize: 13, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    color: colors.textPrimary,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  groupTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 10
  },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.04)"
  },
  pillActive: {
    backgroundColor: "rgba(37,99,235,0.22)",
    borderColor: "rgba(56,189,248,0.40)"
  },
  pillLabel: { color: colors.textSecondary, fontWeight: "600" },
  pillLabelActive: { color: colors.textPrimary },
  saveButton: { marginTop: 20 },
  message: { color: colors.accent2, marginTop: 12, lineHeight: 20, fontWeight: "600" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10
  },
  rowLabel: { color: colors.textSecondary, fontWeight: "600" },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "transparent"
  },
  dotActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent
  }
});
