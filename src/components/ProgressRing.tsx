import Svg, { Circle } from "react-native-svg";
import { View } from "react-native";
import { colors } from "../theme/colors";

type ProgressRingProps = {
  size?: number;
  progress?: number;
  strokeWidth?: number;
};

export const ProgressRing = ({ size = 92, progress = 0.7, strokeWidth = 10 }: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View>
      <Svg width={size} height={size}>
        <Circle
          stroke="rgba(255,255,255,0.14)"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={colors.accent2}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation={-90}
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
    </View>
  );
};
