import { Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
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
  const openLink = (url?: string) => {
    if (!url) {
      return;
    }

    void Linking.openURL(url);
  };

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
            <View style={styles.linkRow}>
              <Pressable style={styles.linkButton} onPress={() => openLink(item.googleUrl)}>
                <Text style={styles.linkLabel}>Google form</Text>
              </Pressable>
              <Pressable style={styles.linkButton} onPress={() => openLink(item.youtubeUrl)}>
                <Text style={styles.linkLabel}>YouTube demo</Text>
              </Pressable>
            </View>
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
  meta: { color: colors.textSecondary, marginTop: 8, lineHeight: 20 },
  linkRow: { flexDirection: "row", gap: 10, marginTop: 14, flexWrap: "wrap" },
  linkButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.35)",
    backgroundColor: "rgba(56,189,248,0.14)"
  },
  linkLabel: { color: colors.accent2, fontWeight: "700" }
});
