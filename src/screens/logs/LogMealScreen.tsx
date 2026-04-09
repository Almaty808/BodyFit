import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

export const LogMealScreen = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Log Meal</Text>
        <Text style={styles.subtitle}>Placeholder modal screen.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  title: { color: colors.textPrimary, fontSize: 26, fontWeight: "700" },
  subtitle: { color: colors.textSecondary }
});
