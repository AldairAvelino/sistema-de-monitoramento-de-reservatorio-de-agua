import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { ThemeColors } from "@/constants/colors";
import { TankReading } from "@/context/AppContext";

interface MiniLineChartProps {
  data: TankReading[];
  color: string;
  width: number;
  height: number;
  colors: ThemeColors;
  showGradient?: boolean;
}

export function MiniLineChart({
  data,
  color,
  width,
  height,
  colors,
  showGradient = true,
}: MiniLineChartProps) {
  if (!data || data.length < 2) return null;

  const padX = 4;
  const padY = 8;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const minVal = 0;
  const maxVal = 100;

  const points = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * chartW;
    const y = padY + chartH - ((d.level - minVal) / (maxVal - minVal)) * chartH;
    return { x, y };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cpx1 = prev.x + (p.x - prev.x) * 0.5;
    const cpx2 = prev.x + (p.x - prev.x) * 0.5;
    return `${acc} C ${cpx1} ${prev.y} ${cpx2} ${p.y} ${p.x} ${p.y}`;
  }, "");

  const fillD =
    pathD +
    ` L ${points[points.length - 1].x} ${padY + chartH} L ${padX} ${padY + chartH} Z`;

  const gradientId = `grad_${Math.random().toString(36).slice(2)}`;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        {showGradient && (
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color} stopOpacity="0.25" />
              <Stop offset="1" stopColor={color} stopOpacity="0" />
            </LinearGradient>
          </Defs>
        )}
        {showGradient && (
          <Path d={fillD} fill={`url(#${gradientId})`} />
        )}
        <Path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({});
