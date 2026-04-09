import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button } from "../../components/Button";
import { t } from "../../i18n";
import { useAuthStore } from "../../store/authStore";
import { OnboardingParams } from "./OnboardingGoal";
import { colors } from "../../theme/colors";

type Props = NativeStackScreenProps<OnboardingParams, "OnboardingSummary">;

export const OnboardingSummary = ({}: Props) => {
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Summary</Text>
        <Text style={styles.text}>Profile setup complete. Enter app.</Text>
        <Button title={t("finish")} onPress={() => setOnboarded(true)} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 20, justifyContent: "center", gap: 16 },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: "700" },
  text: { color: colors.textSecondary }
});
