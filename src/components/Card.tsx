import { PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { colors } from "../theme/colors";
import { componentTokens } from "../theme/components";

type CardProps = PropsWithChildren<{
  style?: ViewStyle;
}>;

export const Card = ({ children, style }: CardProps) => {
  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={componentTokens.blur} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.overlay} />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: componentTokens.radiusCard,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surface2
  },
  content: {
    padding: 16
  }
});
