import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button } from "../../components/Button";
import { t } from "../../i18n";
import { OnboardingParams } from "./OnboardingGoal";
import { colors } from "../../theme/colors";

type Props = NativeStackScreenProps<OnboardingParams, "OnboardingActivity">;

export const OnboardingActivity = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Activity</Text>
        <Text style={styles.text}>Placeholder activity level chooser.</Text>
        <Button title={t("next")} onPress={() => navigation.navigate("OnboardingSummary")} />
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
