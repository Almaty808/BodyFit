import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "../../components/Card";
import { ProgressRing } from "../../components/ProgressRing";
import {
  calculateGoalCalories,
  calculateGoalProjection,
  calculateMaintenanceCalories,
  calculateMacroTargets,
  getCoachInsights,
  getConsumedNutrition,
  getTodaysMealPlan,
  getWorkoutCompletion,
  useDataStore
} from "../../store/dataStore";
import { colors } from "../../theme/colors";

export const HomeScreen = () => {
  const profile = useDataStore((s) => s.profile);
  const weeklyMealPlan = useDataStore((s) => s.weeklyMealPlan);
  const foodLogs = useDataStore((s) => s.foodLogs);
  const foodCatalog = useDataStore((s) => s.foodCatalog);
  const preferredLocation = useDataStore((s) => s.preferredLocation);
  const workoutsByLocation = useDataStore((s) => s.workoutsByLocation);
  const workoutLogs = useDataStore((s) => s.workoutLogs);

  const caloriesTarget = calculateGoalCalories(profile);
  const maintenance = calculateMaintenanceCalories(profile);
  const macros = calculateMacroTargets(profile);
  const consumed = getConsumedNutrition(foodLogs, foodCatalog);
  const caloriesLeft = Math.max(0, caloriesTarget - consumed.kcal);
  const progress = Math.min(consumed.kcal / caloriesTarget, 1);
  const todaysMeals = getTodaysMealPlan(weeklyMealPlan);
  const projection = calculateGoalProjection(profile);
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

        <View style={styles.bentoRow}>
          <Card style={[styles.card, styles.halfCard]}>
            <Text style={styles.cardTitle}>Goal ETA</Text>
            <Text style={styles.metricBig}>{projection.etaLabel}</Text>
            <Text style={styles.metricSmall}>
              About {projection.weeks} weeks to reach {profile.goalWeightKg} kg
            </Text>
          </Card>
          <Card style={[styles.card, styles.halfCard]}>
            <Text style={styles.cardTitle}>Workout streak</Text>
            <Text style={styles.metricBig}>
              {workoutCompletion.completed}/{workoutCompletion.total}
            </Text>
            <Text style={styles.metricSmall}>{preferredLocation} plan completed</Text>
          </Card>
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Plan snapshot</Text>
          <Text style={styles.metricSmall}>
            Maintenance: {maintenance} kcal
          </Text>
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
  note: { color: colors.textSecondary, lineHeight: 21, marginTop: 8 }
});
