import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Card } from "../../components/Card";
import { t } from "../../i18n";
import { Locale, useAuthStore } from "../../store/authStore";
import { colors } from "../../theme/colors";

const locales: Locale[] = ["ru", "kk", "en"];

export const SettingsScreen = () => {
  const selected = useAuthStore((s) => s.user.locale);
  const setLocale = useAuthStore((s) => s.setLocale);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>{t("settings")}</Text>
        <Card style={styles.card}>
          <Text style={styles.subTitle}>{t("language")}</Text>
          {locales.map((locale) => (
            <Pressable key={locale} onPress={() => setLocale(locale)} style={styles.row}>
              <Text style={styles.label}>{locale.toUpperCase()}</Text>
              <View style={[styles.dot, selected === locale && styles.dotActive]} />
            </Pressable>
          ))}
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 20, gap: 16 },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: "700" },
  card: { padding: 0 },
  subTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: "600", marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 },
  label: { color: colors.textSecondary, fontWeight: "600" },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "transparent"
  },
  dotActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent
  }
});
