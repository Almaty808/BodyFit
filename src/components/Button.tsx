import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { colors } from "../theme/colors";
import { componentTokens } from "../theme/components";

type ButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
};

export const Button = ({ title, onPress, style }: ButtonProps) => {
  return (
    <Pressable style={({ pressed }) => [styles.button, style, pressed && styles.pressed]} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: componentTokens.radiusButton,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.accent,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 8
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }]
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600"
  }
});
