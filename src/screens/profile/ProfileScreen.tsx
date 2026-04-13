import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Card } from "../../components/Card";
import {
  calculateBmr,
  calculateGoalCalories,
  calculateGoalProjection,
  calculateMaintenanceCalories,
  useDataStore
} from "../../store/dataStore";
import { colors } from "../../theme/colors";

export type ProfileStackParams = {
  ProfileMain: undefined;
  Settings: undefined;
};

type Props = NativeStackScreenProps<ProfileStackParams, "ProfileMain">;

export const ProfileScreen = ({ navigation }: Props) => {
  const profile = useDataStore((s) => s.profile);
  const weightLogs = useDataStore((s) => s.weightLogs);
  const projection = calculateGoalProjection(profile);
  const bmr = calculateBmr(profile);
  const maintenance = calculateMaintenanceCalories(profile);
  const target = calculateGoalCalories(profile);
  const latestLoss = (weightLogs[0]?.value ?? profile.currentWeightKg) - profile.currentWeightKg;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.avatar} />
            <View style={styles.phasePill}>
              <Text style={styles.phaseText}>
                {profile.goalDirection === "lose" ? "Cut phase" : "Gain phase"}
              </Text>
            </View>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.subtitle}>
            {profile.age} yrs • {profile.heightCm} cm • {profile.currentWeightKg} kg now
          </Text>
        </Card>

        <View style={styles.metricsRow}>
          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>BMR</Text>
            <Text style={styles.metricValue}>{bmr}</Text>
          </Card>
          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>Maintain</Text>
            <Text style={styles.metricValue}>{maintenance}</Text>
          </Card>
          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>Target</Text>
            <Text style={styles.metricValue}>{target}</Text>
          </Card>
        </View>

        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Goal projection</Text>
          <Text style={styles.copy}>
            Current weight: {profile.currentWeightKg} kg
          </Text>
          <Text style={styles.copy}>Goal weight: {profile.goalWeightKg} kg</Text>
          <Text style={styles.copy}>
            Estimated rate: {projection.weeklyRate} kg/week
          </Text>
          <Text style={styles.copy}>Estimated date: {projection.etaLabel}</Text>
        </Card>

        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Weight trend</Text>
          {weightLogs.map((entry) => (
            <View key={entry.id} style={styles.logRow}>
              <Text style={styles.copy}>{entry.date}</Text>
              <Text style={styles.copy}>{entry.value} kg</Text>
            </View>
          ))}
          <Text style={styles.deltaText}>
            Change across logged period: {latestLoss.toFixed(1)} kg
          </Text>
        </Card>

        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>How BodyFlow analyzes progress</Text>
          <Text style={styles.copy}>
            Every meal log updates calories left, macro intake, and adherence to your calorie target.
          </Text>
          <Text style={styles.copy}>
            Every workout completion updates weekly consistency and helps explain weight trend changes.
          </Text>
          <Text style={styles.copy}>
            Update your profile any time to rebuild calorie targets, BMI, goal timing, and the
            workout direction around your current body data.
          </Text>
        </Card>

        <Pressable onPress={() => navigation.navigate("Settings")}>
          <Card style={styles.settingsCard}>
            <Text style={styles.settingsText}>Edit profile & settings</Text>
          </Card>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 12, paddingBottom: 120 },
  headerCard: { padding: 0 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  phasePill: { backgroundColor: "rgba(37,99,235,0.25)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  phaseText: { color: colors.accent2, fontSize: 12, fontWeight: "700" },
  name: { color: colors.textPrimary, fontSize: 24, fontWeight: "700", marginTop: 12 },
  subtitle: { color: colors.textSecondary, marginTop: 4 },
  metricsRow: { flexDirection: "row", gap: 10 },
  metricCard: { flex: 1, padding: 0 },
  metricLabel: { color: colors.textSecondary, fontSize: 12 },
  metricValue: { color: colors.textPrimary, fontSize: 20, fontWeight: "700", marginTop: 6 },
  chartCard: { padding: 0 },
  chartTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: "600", marginBottom: 12 },
  copy: { color: colors.textSecondary, lineHeight: 22, marginBottom: 6 },
  logRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  deltaText: { color: colors.accent2, marginTop: 8, fontWeight: "700" },
  settingsCard: { padding: 0 },
  settingsText: { color: colors.textPrimary, fontSize: 16, fontWeight: "600" }
});
