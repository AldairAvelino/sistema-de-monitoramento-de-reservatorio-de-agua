import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/Card";
import { MiniLineChart } from "@/components/MiniLineChart";
import { PumpIndicator } from "@/components/PumpIndicator";
import { StatusBadge } from "@/components/StatusBadge";
import { TankBar } from "@/components/TankBar";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/hooks/useTheme";

export default function DashboardScreen() {
  const {
    esp32Online,
    primaryTankLevel,
    secondaryTankLevel,
    pumpStatus,
    autoMode,
    primaryHistory,
    secondaryHistory,
    events,
  } = useApp();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const criticalAlerts = events
    .filter((e) => e.severity === "critical" || e.type === "alert_empty")
    .slice(0, 2);

  const lastEvent = events[0];

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
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.greeting, { color: colors.textMuted }]}>
            Water System
          </Text>
          <Text style={[styles.pageTitle, { color: colors.text }]}>
            Dashboard
          </Text>
        </View>
        <StatusBadge online={esp32Online} colors={colors} />
      </View>

      {!esp32Online && (
        <Card
          colors={colors}
          style={{ borderColor: colors.danger, borderWidth: 1 }}
        >
          <View style={styles.alertRow}>
            <Feather name="wifi-off" size={18} color={colors.danger} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertTitle, { color: colors.danger }]}>
                ESP32 Offline
              </Text>
              <Text style={[styles.alertMsg, { color: colors.textSecondary }]}>
                Device not reachable. Check connection.
              </Text>
            </View>
          </View>
        </Card>
      )}

      {criticalAlerts.length > 0 && (
        <Card
          colors={colors}
          style={{ borderColor: colors.dangerLight, borderWidth: 1 }}
        >
          <View style={styles.alertHeader}>
            <Feather name="alert-triangle" size={15} color={colors.warning} />
            <Text style={[styles.alertSectionTitle, { color: colors.warning }]}>
              Active Alerts
            </Text>
          </View>
          {criticalAlerts.map((alert) => (
            <Text
              key={alert.id}
              style={[styles.alertMsg, { color: colors.textSecondary }]}
            >
              • {alert.message}
            </Text>
          ))}
        </Card>
      )}

      <Card colors={colors} noPadding>
        <View style={styles.tanksHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Tank Levels
          </Text>
          <TouchableOpacity
            style={[
              styles.detailBtn,
              { backgroundColor: colors.primaryLight },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(tabs)/tanks");
            }}
            activeOpacity={0.75}
          >
            <Text style={[styles.detailBtnText, { color: colors.primary }]}>
              Details
            </Text>
            <Feather name="chevron-right" size={12} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.tanksRow}>
          <View style={styles.tankBlock}>
            <TankBar
              level={primaryTankLevel}
              label="Primary"
              colors={colors}
              height={150}
            />
            <View style={styles.chartWrapper}>
              <MiniLineChart
                data={primaryHistory.slice(-8)}
                color={colors.tankHigh}
                width={80}
                height={36}
                colors={colors}
              />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.tankBlock}>
            <TankBar
              level={secondaryTankLevel}
              label="Secondary"
              colors={colors}
              height={150}
            />
            <View style={styles.chartWrapper}>
              <MiniLineChart
                data={secondaryHistory.slice(-8)}
                color={colors.secondary}
                width={80}
                height={36}
                colors={colors}
              />
            </View>
          </View>
        </View>
      </Card>

      <Card colors={colors}>
        <View style={styles.pumpCardRow}>
          <View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Pump Status
            </Text>
            <Text style={[styles.pumpMode, { color: colors.textMuted }]}>
              {autoMode ? "Auto mode" : "Manual override"}
            </Text>
          </View>
          <View style={styles.pumpRight}>
            <PumpIndicator isOn={pumpStatus} colors={colors} />
            <TouchableOpacity
              style={[
                styles.controlBtn,
                { backgroundColor: colors.primaryLight },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/(tabs)/pump");
              }}
              activeOpacity={0.75}
            >
              <Text style={[styles.controlBtnText, { color: colors.primary }]}>
                Control
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      {lastEvent && (
        <Card colors={colors}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Last Event
          </Text>
          <View style={styles.lastEventRow}>
            <View
              style={[
                styles.eventDot,
                {
                  backgroundColor:
                    lastEvent.severity === "critical"
                      ? colors.danger
                      : lastEvent.severity === "warning"
                      ? colors.warning
                      : colors.primary,
                },
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.eventMsg, { color: colors.textSecondary }]}>
                {lastEvent.message}
              </Text>
              <Text style={[styles.eventTime, { color: colors.textMuted }]}>
                {formatTime(lastEvent.timestamp)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/(tabs)/history");
              }}
            >
              <Text style={[styles.viewAll, { color: colors.primary }]}>
                View all
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}
    </ScrollView>
  );
}

function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 6,
  },
  greeting: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
  },
  pageTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  alertRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  alertSectionTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  alertTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  alertMsg: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
    marginTop: 2,
  },
  tanksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -0.2,
  },
  detailBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  detailBtnText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  tanksRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingBottom: 18,
    paddingTop: 4,
  },
  tankBlock: { flex: 1, alignItems: "center", gap: 6 },
  chartWrapper: { marginTop: 4 },
  divider: { width: 1, marginHorizontal: 8, marginVertical: 16 },
  pumpCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pumpMode: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  pumpRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  controlBtn: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  controlBtnText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  lastEventRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  eventDot: { width: 8, height: 8, borderRadius: 4, marginTop: 2 },
  eventMsg: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  eventTime: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  viewAll: { fontSize: 12, fontFamily: "Inter_500Medium" },
});
