import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { ThemeColors } from "@/constants/colors";

interface PumpIndicatorProps {
  isOn: boolean;
  colors: ThemeColors;
  compact?: boolean;
}

export function PumpIndicator({ isOn, colors, compact = false }: PumpIndicatorProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isOn) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.4,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isOn]);

  const dotColor = isOn ? colors.pumpOn : colors.pumpOff;
  const bgColor = isOn ? colors.pumpOnLight : colors.pumpOffLight;

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <View
        style={[
          styles.badge,
          {
            backgroundColor: bgColor,
            paddingHorizontal: compact ? 10 : 14,
            paddingVertical: compact ? 5 : 7,
          },
        ]}
      >
        <View style={styles.dotWrapper}>
          <Animated.View
            style={[
              styles.dotPulse,
              {
                backgroundColor: dotColor,
                opacity: 0.3,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
        </View>
        <Text
          style={[
            styles.label,
            {
              color: dotColor,
              fontSize: compact ? 11 : 13,
            },
          ]}
        >
          PUMP {isOn ? "ON" : "OFF"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  containerCompact: {},
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    gap: 6,
  },
  dotWrapper: {
    width: 8,
    height: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  dotPulse: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: "absolute",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
  },
});
