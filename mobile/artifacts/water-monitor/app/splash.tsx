import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.4)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;

  const colors = Colors.light;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(logoFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(ringScale, {
          toValue: 1.8,
          tension: 30,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(ringOpacity, {
            toValue: 0.5,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.timing(taglineFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace("/auth");
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: topPad,
          paddingBottom:
            Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom,
        },
      ]}
    >
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.ring,
              {
                borderColor: colors.primary,
                opacity: ringOpacity,
                transform: [{ scale: ringScale }],
              },
            ]}
          />
          <View
            style={[
              styles.logoCircle,
              { backgroundColor: colors.primaryLight, borderColor: colors.border },
            ]}
          >
            <Feather name="droplet" size={44} color={colors.primary} />
            <View
              style={[
                styles.circuitDot,
                { backgroundColor: colors.secondary },
              ]}
            />
            <View
              style={[
                styles.circuitLine,
                { backgroundColor: colors.secondary },
              ]}
            />
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: logoFade, alignItems: "center" }}>
          <Text style={[styles.appName, { color: colors.text }]}>
            AquaGuard
          </Text>
          <View style={styles.versionRow}>
            <View
              style={[styles.versionDot, { backgroundColor: colors.primary }]}
            />
            <Text style={[styles.version, { color: colors.textMuted }]}>
              IoT Water Monitoring
            </Text>
          </View>
        </Animated.View>

        <Animated.Text
          style={[
            styles.tagline,
            { color: colors.textSecondary, opacity: taglineFade },
          ]}
        >
          Smart. Reliable. Always on.
        </Animated.Text>
      </View>

      <Animated.Text
        style={[
          styles.footer,
          {
            color: colors.textMuted,
            opacity: taglineFade,
            paddingBottom:
              Platform.OS === "web"
                ? Math.max(insets.bottom, 34) + 8
                : insets.bottom + 8,
          },
        ]}
      >
        ESP32 Connected System
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  ring: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  circuitDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    bottom: 18,
    right: 18,
  },
  circuitLine: {
    position: "absolute",
    width: 20,
    height: 1.5,
    bottom: 21,
    right: 26,
    borderRadius: 1,
  },
  appName: {
    fontSize: 38,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
    marginBottom: 4,
  },
  versionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  versionDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  version: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.3,
    marginTop: 8,
  },
  footer: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.5,
    textAlign: "center",
  },
});
