import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card } from "../../components/Card";
import { ProgressRing } from "../../components/ProgressRing";
import {
  calculateBmi,
  calculateGoalCalories,
  calculateGoalProjection,
  calculateMaintenanceCalories,
  calculateMacroTargets,
  getBmiCategory,
  getCoachInsights,
  getConsumedNutrition,
  getTodaysMealPlan,
  getWorkoutPlanForLocation,
  getWorkoutCompletion,
  useDataStore
} from "../../store/dataStore";
import { colors } from "../../theme/colors";

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const profile = useDataStore((s) => s.profile);
  const weeklyMealPlan = useDataStore((s) => s.weeklyMealPlan);
  const foodLogs = useDataStore((s) => s.foodLogs);
  const foodCatalog = useDataStore((s) => s.foodCatalog);
  const preferredLocation = useDataStore((s) => s.preferredLocation);
  const workoutsByLocation = useDataStore((s) => s.workoutsByLocation);
  const workoutLogs = useDataStore((s) => s.workoutLogs);
  const addFoodLog = useDataStore((s) => s.addFoodLog);
  const completeWorkout = useDataStore((s) => s.completeWorkout);

  const caloriesTarget = calculateGoalCalories(profile);
  const maintenance = calculateMaintenanceCalories(profile);
  const macros = calculateMacroTargets(profile);
  const consumed = getConsumedNutrition(foodLogs, foodCatalog);
  const caloriesLeft = Math.max(0, caloriesTarget - consumed.kcal);
  const progress = Math.min(consumed.kcal / caloriesTarget, 1);
  const todaysMeals = getTodaysMealPlan(weeklyMealPlan);
  const projection = calculateGoalProjection(profile);
  const bmi = calculateBmi(profile);
  const bmiCategory = getBmiCategory(bmi);
  const todaysWorkout =
    getWorkoutPlanForLocation(preferredLocation, workoutsByLocation).find(
      (workout) => workout.day === todaysMeals.day
    ) ?? getWorkoutPlanForLocation(preferredLocation, workoutsByLocation)[0];
  const todaysWorkoutDone = workoutLogs.some((item) => item.workoutId === todaysWorkout.id);
  const workoutCompletion = getWorkoutCompletion(
    preferredLocation,
    workoutsByLocation,
    workoutLogs
  );
  const insights = getCoachInsights(
    profile,
    foodLogs,
    workoutLogs,
    foodCatalog,
    preferredLocation,
    workoutsByLocation
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>BodyFlow</Text>
        <Text style={styles.subtitle}>
          Daily calorie coaching, meal timing, workouts, and recovery analysis.
        </Text>

        <View style={styles.bentoRow}>
          <Card style={[styles.card, styles.largeCard]}>
            <Text style={styles.cardTitle}>Today&apos;s calories</Text>
            <View style={styles.goalRow}>
              <ProgressRing progress={progress} />
              <View>
                <Text style={styles.metricBig}>{caloriesLeft}</Text>
                <Text style={styles.metricSmall}>kcal left</Text>
                <Text style={styles.inlineMeta}>
                  {consumed.kcal} / {caloriesTarget} kcal
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <Card style={styles.card}>
          <View style={styles.quickHeader}>
            <View>
              <Text style={styles.cardTitle}>Quick actions</Text>
              <Text style={styles.quickCopy}>
                Jump into logging fast or use one tap for your most common entries.
              </Text>
            </View>
          </View>
          <View style={styles.quickGrid}>
            <Pressable
              style={[styles.quickAction, styles.quickPrimary]}
              onPress={() => navigation.navigate("Nutrition")}
            >
              <Text style={styles.quickEyebrow}>Food</Text>
              <Text style={styles.quickTitle}>Log food</Text>
              <Text style={styles.quickMeta}>Open calorie lookup and add meals</Text>
            </Pressable>
            <Pressable
              style={[styles.quickAction, styles.quickSecondary]}
              onPress={() => navigation.navigate("Workouts")}
            >
              <Text style={styles.quickEyebrow}>Training</Text>
              <Text style={styles.quickTitle}>Log workout</Text>
              <Text style={styles.quickMeta}>Open today&apos;s plan and mark it done</Text>
            </Pressable>
          </View>
          <View style={styles.shortcutRow}>
            <Pressable style={styles.shortcut} onPress={() => addFoodLog("food-banana")}>
              <Text style={styles.shortcutLabel}>+ Banana</Text>
            </Pressable>
            <Pressable style={styles.shortcut} onPress={() => addFoodLog("food-protein-shake")}>
              <Text style={styles.shortcutLabel}>+ Shake</Text>
            </Pressable>
            <Pressable
              style={[styles.shortcut, todaysWorkoutDone && styles.shortcutActive]}
              onPress={() => completeWorkout(todaysWorkout.id)}
            >
              <Text
                style={[styles.shortcutLabel, todaysWorkoutDone && styles.shortcutActiveLabel]}
              >
                {todaysWorkoutDone ? "Workout done" : "+ Today workout"}
              </Text>
            </Pressable>
          </View>
        </Card>

        <View style={styles.bentoRow}>
          <Card style={[styles.card, styles.halfCard]}>
            <Text style={styles.cardTitle}>Goal ETA</Text>
            <Text style={styles.metricBig}>{projection.etaLabel}</Text>
            <Text style={styles.metricSmall}>
              About {projection.weeks} weeks to reach {profile.goalWeightKg} kg
            </Text>
          </Card>
          <Card style={[styles.card, styles.halfCard]}>
            <Text style={styles.cardTitle}>BMI</Text>
            <Text style={styles.metricBig}>{bmi}</Text>
            <Text style={styles.metricSmall}>{bmiCategory}</Text>
            <Text style={styles.inlineMeta}>
              Based on {profile.currentWeightKg} kg and {profile.heightCm} cm
            </Text>
          </Card>
        </View>

        <View style={styles.bentoRow}>
          <Card style={[styles.card, styles.halfCard]}>
            <Text style={styles.cardTitle}>Workout streak</Text>
            <Text style={styles.metricBig}>
              {workoutCompletion.completed}/{workoutCompletion.total}
            </Text>
            <Text style={styles.metricSmall}>{preferredLocation} plan completed</Text>
          </Card>
          <Card style={[styles.card, styles.halfCard]}>
            <Text style={styles.cardTitle}>Today&apos;s workout</Text>
            <Text style={styles.metricSmall}>{todaysWorkout.focus}</Text>
            <Text style={styles.inlineMeta}>
              {todaysWorkout.durationMin} min • {todaysWorkout.estimatedBurn} kcal burn
            </Text>
          </Card>
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Plan snapshot</Text>
          <Text style={styles.metricSmall}>Maintenance: {maintenance} kcal</Text>
          <Text style={styles.metricSmall}>
            Macros target: P {macros.protein}g / C {macros.carbs}g / F {macros.fat}g
          </Text>
          <Text style={styles.metricSmall}>
            Meal timing today: {todaysMeals.meals.map((meal) => meal.time).join(" • ")}
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Coach notes</Text>
          {insights.map((note) => (
            <Text key={note} style={styles.note}>
              {note}
            </Text>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 14, paddingBottom: 110 },
  title: { color: colors.textPrimary, fontSize: 30, fontWeight: "700" },
  subtitle: { color: colors.textSecondary, marginBottom: 4 },
  bentoRow: { flexDirection: "row", gap: 12 },
  card: { padding: 0, flex: 1 },
  largeCard: { minHeight: 160 },
  halfCard: { minHeight: 130 },
  cardTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: "600" },
  goalRow: { marginTop: 14, flexDirection: "row", alignItems: "center", gap: 16 },
  metricBig: { color: colors.textPrimary, fontSize: 28, fontWeight: "700", marginTop: 12 },
  metricSmall: { color: colors.textSecondary, marginTop: 4, lineHeight: 20 },
  inlineMeta: { color: colors.textSecondary, marginTop: 6, fontSize: 12 },
  note: { color: colors.textSecondary, lineHeight: 21, marginTop: 8 },
  quickHeader: { gap: 6 },
  quickCopy: { color: colors.textSecondary, marginTop: 6, lineHeight: 20 },
  quickGrid: { flexDirection: "row", gap: 12, marginTop: 16 },
  quickAction: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1
  },
  quickPrimary: {
    backgroundColor: "rgba(37,99,235,0.20)",
    borderColor: "rgba(56,189,248,0.35)"
  },
  quickSecondary: {
    backgroundColor: "rgba(16,185,129,0.14)",
    borderColor: "rgba(16,185,129,0.35)"
  },
  quickEyebrow: {
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontSize: 11
  },
  quickTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8
  },
  quickMeta: { color: colors.textSecondary, marginTop: 8, lineHeight: 19 },
  shortcutRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 },
  shortcut: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: colors.border
  },
  shortcutActive: {
    backgroundColor: "rgba(16,185,129,0.18)",
    borderColor: "rgba(16,185,129,0.35)"
  },
  shortcutLabel: { color: colors.textPrimary, fontWeight: "600" },
  shortcutActiveLabel: { color: colors.success }
});
