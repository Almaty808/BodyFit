import { Platform } from "react-native";
import { colors } from "./colors";

export const typography = {
  fontFamily:
    Platform.OS === "android" ? ("Inter" as const) : ("System" as const),
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700" as const,
    color: colors.textPrimary
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700" as const,
    color: colors.textPrimary
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600" as const,
    color: colors.textPrimary
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400" as const,
    color: colors.textPrimary
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500" as const,
    color: colors.textSecondary
  }
};
