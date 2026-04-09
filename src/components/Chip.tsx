import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

type ChipProps = {
  label: string;
};

export const Chip = ({ label }: ChipProps) => {
  return (
    <View style={styles.chip}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface2,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600"
  }
});
