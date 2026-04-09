import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { t } from "../../i18n";
import { useAuthStore } from "../../store/authStore";
import { colors } from "../../theme/colors";

export const LoginScreen = () => {
  const login = useAuthStore((s) => s.login);
  const locale = useAuthStore((s) => s.user.locale);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>BodyFlow</Text>
        <Text style={styles.subtitle}>Smart fitness companion</Text>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>{t("login")}</Text>
          <Text style={styles.cardText}>Mock auth flow for UI scaffolding.</Text>
          <Button title={t("login")} onPress={login} style={styles.button} />
        </Card>

        <Text style={styles.locale}>Locale: {locale.toUpperCase()}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 20, justifyContent: "center", gap: 18 },
  title: { color: colors.textPrimary, fontSize: 36, fontWeight: "700" },
  subtitle: { color: colors.textSecondary, marginBottom: 16 },
  card: { padding: 0 },
  cardTitle: { color: colors.textPrimary, fontSize: 22, fontWeight: "700" },
  cardText: { color: colors.textSecondary, marginTop: 8 },
  button: { marginTop: 18 },
  locale: { color: colors.textSecondary, textAlign: "center", marginTop: 8 }
});
