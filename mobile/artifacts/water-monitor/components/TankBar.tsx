import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { ThemeColors } from "@/constants/colors";

interface TankBarProps {
  level: number;
  label: string;
  colors: ThemeColors;
  height?: number;
  showLabel?: boolean;
  compact?: boolean;
}

export function TankBar({
  level,
  label,
  colors,
  height = 160,
  showLabel = true,
  compact = false,
}: TankBarProps) {
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedHeight, {
      toValue: level,
      tension: 60,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [level]);

  const getTankColor = () => {
    if (level > 60) return colors.tankHigh;
    if (level > 30) return colors.tankMedium;
    if (level > 15) return colors.tankLow;
    return colors.tankEmpty;
  };

  const getStatusLabel = () => {
    if (level > 70) return "Full";
    if (level > 40) return "Medium";
    if (level > 15) return "Low";
    return "Empty";
  };

  const tankColor = getTankColor();

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      {showLabel && (
        <Text
          style={[
            styles.label,
            { color: colors.textSecondary },
            compact && styles.labelCompact,
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.tankOuter,
          {
            height,
            backgroundColor: colors.surfaceSecondary,
            borderColor: colors.border,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.tankFill,
            {
              backgroundColor: tankColor,
              height: animatedHeight.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
                extrapolate: "clamp",
              }),
              opacity: 0.9,
            },
          ]}
        />
        <View style={styles.ticksContainer}>
          {[75, 50, 25].map((tick) => (
            <View
              key={tick}
              style={[
                styles.tick,
                {
                  bottom: `${tick}%` as any,
                  backgroundColor: colors.border,
                },
              ]}
            />
          ))}
        </View>
      </View>
      <Text
        style={[
          styles.percentage,
          { color: tankColor },
          compact && styles.percentageCompact,
        ]}
      >
        {level}%
      </Text>
      {!compact && (
        <Text style={[styles.status, { color: colors.textMuted }]}>
          {getStatusLabel()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
  containerCompact: {
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    marginBottom: 10,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  labelCompact: {
    fontSize: 11,
    marginBottom: 6,
  },
  tankOuter: {
    width: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    overflow: "hidden",
    justifyContent: "flex-end",
    position: "relative",
  },
  tankFill: {
    width: "100%",
    borderRadius: 26,
  },
  ticksContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  tick: {
    position: "absolute",
    left: "25%",
    right: "25%",
    height: 1,
  },
  percentage: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    marginTop: 10,
    letterSpacing: -0.5,
  },
  percentageCompact: {
    fontSize: 15,
    marginTop: 6,
  },
  status: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
    letterSpacing: 0.2,
  },
});
