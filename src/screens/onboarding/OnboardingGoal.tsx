import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button } from "../../components/Button";
import { t } from "../../i18n";
import { colors } from "../../theme/colors";

export type OnboardingParams = {
  OnboardingGoal: undefined;
  OnboardingSex: undefined;
  OnboardingAge: undefined;
  OnboardingHeight: undefined;
  OnboardingWeight: undefined;
  OnboardingActivity: undefined;
  OnboardingSummary: undefined;
};

type Props = NativeStackScreenProps<OnboardingParams, "OnboardingGoal">;

export const OnboardingGoal = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Goal</Text>
        <Text style={styles.text}>Select body recomposition target.</Text>
        <Button title={t("next")} onPress={() => navigation.navigate("OnboardingSex")} />
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
