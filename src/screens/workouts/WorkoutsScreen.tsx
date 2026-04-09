import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Card } from "../../components/Card";
import {
  UserLocation,
  getWorkoutCompletion,
  useDataStore
} from "../../store/dataStore";
import { colors } from "../../theme/colors";

export type WorkoutsStackParams = {
  WorkoutsMain: undefined;
  WorkoutDetail: { workoutId: string };
};

type Props = NativeStackScreenProps<WorkoutsStackParams, "WorkoutsMain">;

export const WorkoutsScreen = ({ navigation }: Props) => {
  const preferredLocation = useDataStore((s) => s.preferredLocation);
  const setPreferredLocation = useDataStore((s) => s.setPreferredLocation);
  const workoutsByLocation = useDataStore((s) => s.workoutsByLocation);
  const workoutLogs = useDataStore((s) => s.workoutLogs);
  const completeWorkout = useDataStore((s) => s.completeWorkout);
  const workouts = workoutsByLocation[preferredLocation];
  const locations: UserLocation[] = ["gym", "home", "office"];
  const completedIds = new Set(workoutLogs.map((item) => item.workoutId));
  const completion = getWorkoutCompletion(preferredLocation, workoutsByLocation, workoutLogs);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Workout planner</Text>
        <Text style={styles.subtitle}>
          Choose your environment and follow a realistic plan for each day of the week.
        </Text>

        <View style={styles.locationRow}>
          {locations.map((location) => (
            <Pressable
              key={location}
              onPress={() => setPreferredLocation(location)}
              style={[
                styles.locationChip,
                preferredLocation === location && styles.locationChipActive
              ]}
            >
              <Text
                style={[
                  styles.locationLabel,
                  preferredLocation === location && styles.locationLabelActive
                ]}
              >
                {location}
              </Text>
            </Pressable>
          ))}
        </View>

        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            Weekly completion: {completion.completed}/{completion.total}
          </Text>
          <Text style={styles.summaryCopy}>
            Each completed session feeds your daily analysis and consistency score.
          </Text>
        </Card>

        {workouts.map((workout) => (
          <Pressable
            key={workout.id}
            onPress={() => navigation.navigate("WorkoutDetail", { workoutId: workout.id })}
          >
            <Card style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.name}>
                  {workout.day}: {workout.focus}
                </Text>
                <Text style={styles.meta}>{workout.durationMin} min</Text>
              </View>
              <Text style={styles.meta}>
                {workout.exercises.length} exercises • est. {workout.estimatedBurn} kcal
              </Text>
              <Text style={styles.meta}>
                {workout.exercises.map((exercise) => exercise.name).join(" • ")}
              </Text>
              <Pressable
                onPress={() => completeWorkout(workout.id)}
                style={[
                  styles.completeButton,
                  completedIds.has(workout.id) && styles.completeButtonDone
                ]}
              >
                <Text
                  style={[
                    styles.completeLabel,
                    completedIds.has(workout.id) && styles.completeLabelDone
                  ]}
                >
                  {completedIds.has(workout.id) ? "Logged" : "Mark done"}
                </Text>
              </Pressable>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 12, paddingBottom: 120 },
  title: { color: colors.textPrimary, fontSize: 30, fontWeight: "700" },
  subtitle: { color: colors.textSecondary, marginBottom: 4, lineHeight: 20 },
  locationRow: { flexDirection: "row", gap: 10, marginBottom: 2 },
  locationChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2
  },
  locationChipActive: {
    backgroundColor: "rgba(37,99,235,0.24)",
    borderColor: "rgba(56,189,248,0.34)"
  },
  locationLabel: { color: colors.textSecondary, fontWeight: "600", textTransform: "capitalize" },
  locationLabelActive: { color: colors.textPrimary },
  summaryCard: { padding: 0 },
  summaryTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: "700" },
  summaryCopy: { color: colors.textSecondary, marginTop: 8, lineHeight: 20 },
  card: { padding: 0 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { color: colors.textPrimary, fontSize: 16, fontWeight: "600" },
  meta: { color: colors.textSecondary, marginTop: 8, lineHeight: 20 },
  completeButton: {
    marginTop: 14,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(16,185,129,0.14)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.25)"
  },
  completeButtonDone: {
    backgroundColor: "rgba(56,189,248,0.14)",
    borderColor: "rgba(56,189,248,0.3)"
  },
  completeLabel: { color: colors.success, fontWeight: "700" },
  completeLabelDone: { color: colors.accent2 }
});
