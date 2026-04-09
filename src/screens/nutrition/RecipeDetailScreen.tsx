import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Card } from "../../components/Card";
import { useDataStore } from "../../store/dataStore";
import { colors } from "../../theme/colors";
import { NutritionStackParams } from "./NutritionScreen";

type Props = NativeStackScreenProps<NutritionStackParams, "RecipeDetail">;

export const RecipeDetailScreen = ({ route }: Props) => {
  const weeklyMealPlan = useDataStore((s) => s.weeklyMealPlan);
  const meal = weeklyMealPlan
    .find((entry) => entry.day === route.params.day)
    ?.meals.find((item) => item.id === route.params.mealId);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>{route.params.day}</Text>
          <Text style={styles.heroTime}>{meal?.time}</Text>
        </View>
        <Text style={styles.title}>{meal?.title ?? "Meal"}</Text>
        <Text style={styles.subtitle}>{meal?.goal}</Text>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Meal composition</Text>
          {meal?.foods.map((food) => (
            <Text key={food} style={styles.item}>
              • {food}
            </Text>
          ))}
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Nutrition targets</Text>
          <Text style={styles.item}>Calories: {meal?.kcal} kcal</Text>
          <Text style={styles.item}>Protein: {meal?.macros.protein} g</Text>
          <Text style={styles.item}>Carbs: {meal?.macros.carbs} g</Text>
          <Text style={styles.item}>Fat: {meal?.macros.fat} g</Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Execution notes</Text>
          <Text style={styles.item}>
            Build this meal around lean protein first, then match carbs to your day&apos;s energy demand.
          </Text>
          <Text style={styles.item}>
            If you already ate a higher-calorie snack, reduce fats or starch here to stay on target.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 14, paddingBottom: 44 },
  hero: {
    width: "100%",
    height: 180,
    borderRadius: 24,
    backgroundColor: "rgba(37,99,235,0.18)",
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    padding: 20
  },
  heroLabel: { color: colors.accent2, fontWeight: "700", fontSize: 14 },
  heroTime: { color: colors.textPrimary, fontWeight: "700", fontSize: 30, marginTop: 8 },
  title: { color: colors.textPrimary, fontSize: 26, fontWeight: "700" },
  subtitle: { color: colors.textSecondary, lineHeight: 20 },
  card: { padding: 0 },
  cardTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: "700", marginBottom: 10 },
  item: { color: colors.textSecondary, marginBottom: 8, lineHeight: 20 }
});
