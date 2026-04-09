import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Card } from "../../components/Card";
import { Chip } from "../../components/Chip";
import {
  calculateGoalCalories,
  calculateMacroTargets,
  getConsumedNutrition,
  getTodaysMealPlan,
  useDataStore
} from "../../store/dataStore";
import { colors } from "../../theme/colors";

export type NutritionStackParams = {
  NutritionMain: undefined;
  RecipeDetail: { mealId: string; day: string };
};

type Props = NativeStackScreenProps<NutritionStackParams, "NutritionMain">;

export const NutritionScreen = ({ navigation }: Props) => {
  const profile = useDataStore((s) => s.profile);
  const weeklyMealPlan = useDataStore((s) => s.weeklyMealPlan);
  const monthlyMealThemes = useDataStore((s) => s.monthlyMealThemes);
  const foodCatalog = useDataStore((s) => s.foodCatalog);
  const foodLogs = useDataStore((s) => s.foodLogs);
  const addFoodLog = useDataStore((s) => s.addFoodLog);

  const todayPlan = getTodaysMealPlan(weeklyMealPlan);
  const consumed = getConsumedNutrition(foodLogs, foodCatalog);
  const targetCalories = calculateGoalCalories(profile);
  const macros = calculateMacroTargets(profile);
  const caloriesLeft = Math.max(0, targetCalories - consumed.kcal);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Nutrition planner</Text>
        <Text style={styles.subtitle}>
          Today: {consumed.kcal}/{targetCalories} kcal, {caloriesLeft} kcal left
        </Text>

        <Card style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Macro targets</Text>
          <View style={styles.summaryRow}>
            <Chip label={`Protein ${consumed.macros.protein}/${macros.protein}g`} />
            <Chip label={`Carbs ${consumed.macros.carbs}/${macros.carbs}g`} />
            <Chip label={`Fat ${consumed.macros.fat}/${macros.fat}g`} />
          </View>
        </Card>

        <Card style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Daily meal plan</Text>
          <Text style={styles.summaryCopy}>
            Planned eating times keep hunger predictable and make calorie adherence easier.
          </Text>
        </Card>

        <View style={styles.timeline}>
          <View style={styles.line} />
          {todayPlan.meals.map((meal) => (
            <View key={meal.id} style={styles.timelineRow}>
              <View style={styles.leftCol}>
                <View style={styles.dot} />
                <Text style={styles.time}>{meal.time}</Text>
              </View>
              <Pressable
                style={styles.flex}
                onPress={() =>
                  navigation.navigate("RecipeDetail", {
                    mealId: meal.id,
                    day: todayPlan.day
                  })
                }
              >
                <Card style={styles.card}>
                  <Text style={styles.mealTitle}>{meal.title}</Text>
                  <Text style={styles.goalText}>{meal.goal}</Text>
                  <Text style={styles.kcal}>{meal.kcal} kcal</Text>
                  <View style={styles.chips}>
                    <Chip label={`P ${meal.macros.protein}g`} />
                    <Chip label={`C ${meal.macros.carbs}g`} />
                    <Chip label={`F ${meal.macros.fat}g`} />
                  </View>
                </Card>
              </Pressable>
            </View>
          ))}
        </View>

        <Card style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Weekly structure</Text>
          {weeklyMealPlan.map((day) => (
            <Text key={day.day} style={styles.weekRow}>
              {day.day}: {day.meals.map((meal) => meal.time).join(" • ")}
            </Text>
          ))}
        </Card>

        <Card style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Monthly focus</Text>
          {monthlyMealThemes.map((theme) => (
            <Text key={theme} style={styles.weekRow}>
              {theme}
            </Text>
          ))}
        </Card>

        <Card style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Calorie counter</Text>
          <Text style={styles.summaryCopy}>
            Tap Add when you eat something and BodyFlow updates remaining calories automatically.
          </Text>
          {foodCatalog.map((food) => (
            <View key={food.id} style={styles.foodRow}>
              <View style={styles.foodMain}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodMeta}>
                  {food.serving} • {food.kcal} kcal
                </Text>
                <Text style={styles.foodMeta}>{food.note}</Text>
              </View>
              <Pressable style={styles.addButton} onPress={() => addFoodLog(food.id)}>
                <Text style={styles.addLabel}>Add</Text>
              </Pressable>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 120 },
  title: { color: colors.textPrimary, fontSize: 30, fontWeight: "700" },
  subtitle: { color: colors.textSecondary, marginTop: 8, marginBottom: 16 },
  summaryCard: { padding: 0, marginBottom: 14 },
  sectionTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: "700" },
  summaryRow: { flexDirection: "row", gap: 8, marginTop: 12, flexWrap: "wrap" },
  summaryCopy: { color: colors.textSecondary, marginTop: 10, lineHeight: 20 },
  timeline: { position: "relative", paddingLeft: 4 },
  line: {
    position: "absolute",
    left: 18,
    top: 8,
    bottom: 8,
    width: 2,
    backgroundColor: "rgba(255,255,255,0.12)"
  },
  timelineRow: { flexDirection: "row", marginBottom: 14 },
  leftCol: { width: 62, alignItems: "center" },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginTop: 8,
    marginBottom: 10,
    shadowColor: colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 }
  },
  time: { color: colors.textSecondary, fontSize: 12 },
  flex: { flex: 1 },
  card: { padding: 0 },
  mealTitle: { color: colors.textPrimary, fontWeight: "600", fontSize: 15, flexShrink: 1 },
  goalText: { color: colors.textSecondary, marginTop: 8, lineHeight: 20 },
  kcal: { color: colors.accent2, fontWeight: "700", fontSize: 13, marginTop: 10 },
  chips: { flexDirection: "row", gap: 8, marginTop: 12, flexWrap: "wrap" },
  weekRow: { color: colors.textSecondary, lineHeight: 22, marginTop: 8 },
  foodRow: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 14,
    flexDirection: "row",
    gap: 12
  },
  foodMain: { flex: 1 },
  foodName: { color: colors.textPrimary, fontSize: 15, fontWeight: "600" },
  foodMeta: { color: colors.textSecondary, marginTop: 4, lineHeight: 18 },
  addButton: {
    alignSelf: "center",
    backgroundColor: "rgba(56,189,248,0.14)",
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.35)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  addLabel: { color: colors.accent2, fontWeight: "700" }
});
