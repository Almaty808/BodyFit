import { SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Card } from "../../components/Card";
import { useDataStore } from "../../store/dataStore";
import { colors } from "../../theme/colors";
import { WorkoutsStackParams } from "./WorkoutsScreen";

type Props = NativeStackScreenProps<WorkoutsStackParams, "WorkoutDetail">;

export const WorkoutDetailScreen = ({ route }: Props) => {
  const preferredLocation = useDataStore((s) => s.preferredLocation);
  const selected = useDataStore((s) =>
    s.workoutsByLocation[preferredLocation].find((w) => w.id === route.params.workoutId)
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{selected?.focus ?? "Workout"}</Text>
        <Text style={styles.subtitle}>
          {selected?.day} • {selected?.location} • {selected?.durationMin} min • est.{" "}
          {selected?.estimatedBurn} kcal
        </Text>

        {selected?.exercises.map((item) => (
          <Card key={item.name} style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>
              {item.sets} sets • {item.reps}
            </Text>
            <Text style={styles.meta}>{item.note}</Text>
          </Card>
        ))}

        <Card style={styles.card}>
          <Text style={styles.name}>Why this session works</Text>
          <Text style={styles.meta}>
            This workout matches your selected environment so the plan stays realistic and repeatable.
          </Text>
          <Text style={styles.meta}>
            Logged completion feeds the app&apos;s adherence analysis, calorie-burn estimate, and weekly progress score.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 12, paddingBottom: 44 },
  title: { color: colors.textPrimary, fontSize: 30, fontWeight: "700", marginBottom: 4 },
  subtitle: { color: colors.textSecondary, lineHeight: 20, marginBottom: 4, textTransform: "capitalize" },
  card: { padding: 0 },
  name: { color: colors.textPrimary, fontSize: 16, fontWeight: "600" },
  meta: { color: colors.textSecondary, marginTop: 8, lineHeight: 20 }
});
