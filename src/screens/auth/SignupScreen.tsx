import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { t } from "../../i18n";
import { useAuthStore } from "../../store/authStore";
import { colors } from "../../theme/colors";

export const SignupScreen = () => {
  const login = useAuthStore((s) => s.login);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.title}>{t("signup")}</Text>
          <Text style={styles.text}>Signup placeholder. Continue to mock app.</Text>
          <Button title={t("signup")} onPress={login} style={styles.button} />
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 20, justifyContent: "center" },
  card: { padding: 0 },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: "700" },
  text: { color: colors.textSecondary, marginTop: 8 },
  button: { marginTop: 18 }
});
