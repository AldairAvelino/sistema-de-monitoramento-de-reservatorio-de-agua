import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/Card";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/hooks/useTheme";

export default function ProfileScreen() {
  const { user, logout, primaryTankLevel, secondaryTankLevel, events } =
    useApp();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Warning
          );
          await logout();
          router.replace("/auth");
        },
      },
    ]);
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const stats = [
    { label: "Primary Tank", value: `${primaryTankLevel}%` },
    { label: "Secondary Tank", value: `${secondaryTankLevel}%` },
    { label: "Total Events", value: String(events.length) },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingTop: topPad + 16,
        paddingBottom:
          (Platform.OS === "web"
            ? Math.max(insets.bottom, 34)
            : insets.bottom) + 100,
        paddingHorizontal: 20,
        gap: 14,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: colors.text }]}>Profile</Text>

      <Card colors={colors}>
        <View style={styles.profileBlock}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.primaryLight, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {initials}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.name ?? "Unknown User"}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {user?.email ?? ""}
            </Text>
            <View
              style={[styles.roleTag, { backgroundColor: colors.primaryLight }]}
            >
              <Text style={[styles.roleText, { color: colors.primary }]}>
                System Admin
              </Text>
            </View>
          </View>
        </View>
      </Card>

      <View style={styles.statsRow}>
        {stats.map((stat) => (
          <Card key={stat.label} colors={colors} style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stat.value}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              {stat.label}
            </Text>
          </Card>
        ))}
      </View>

      <Card colors={colors} noPadding>
        <MenuItem
          icon="settings"
          label="Settings"
          colors={colors}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/(tabs)/settings");
          }}
        />
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
        <MenuItem
          icon="bell"
          label="Notifications"
          colors={colors}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/(tabs)/settings");
          }}
        />
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
        <MenuItem
          icon="shield"
          label="Security"
          colors={colors}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/(tabs)/security");
          }}
        />
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
        <MenuItem
          icon="help-circle"
          label="Help & Support"
          colors={colors}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/(tabs)/help");
          }}
        />
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
        <MenuItem
          icon="code"
          label="Developer"
          colors={colors}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/(tabs)/developer");
          }}
        />
      </Card>

      <TouchableOpacity
        style={[styles.logoutBtn, { borderColor: colors.danger }]}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Feather name="log-out" size={16} color={colors.danger} />
        <Text style={[styles.logoutText, { color: colors.danger }]}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function MenuItem({
  icon,
  label,
  colors,
  onPress,
}: {
  icon: any;
  label: string;
  colors: any;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[styles.menuIcon, { backgroundColor: colors.surfaceSecondary }]}
      >
        <Feather name={icon} size={16} color={colors.textSecondary} />
      </View>
      <Text style={[styles.menuLabel, { color: colors.text }]}>{label}</Text>
      <Feather name="chevron-right" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pageTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  profileBlock: { flexDirection: "row", alignItems: "center", gap: 16 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 22, fontFamily: "Inter_700Bold" },
  userName: { fontSize: 17, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  userEmail: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  roleTag: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  roleText: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.3 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, alignItems: "center", paddingVertical: 14 },
  statValue: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  statLabel: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 2, textAlign: "center" },
  separator: { height: 1, marginHorizontal: 16 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 4,
  },
  logoutText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
