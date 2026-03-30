import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemeColors } from "@/constants/colors";

interface StatusBadgeProps {
  online: boolean;
  colors: ThemeColors;
  compact?: boolean;
}

export function StatusBadge({ online, colors, compact = false }: StatusBadgeProps) {
  const dotColor = online ? colors.online : colors.offline;
  const bgColor = online ? colors.successLight : colors.dangerLight;
  const textColor = online ? colors.success : colors.danger;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bgColor,
          paddingHorizontal: compact ? 8 : 10,
          paddingVertical: compact ? 4 : 5,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text
        style={[
          styles.label,
          { color: textColor, fontSize: compact ? 10 : 11 },
        ]}
      >
        {online ? "ONLINE" : "OFFLINE"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
  },
});
