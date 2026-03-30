import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { ThemeColors } from "@/constants/colors";

interface CardProps {
  children: React.ReactNode;
  colors: ThemeColors;
  style?: ViewStyle;
  noPadding?: boolean;
}

export function Card({ children, colors, style, noPadding = false }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadowDark,
        },
        !noPadding && styles.padding,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  padding: {
    padding: 18,
  },
});
