import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/Card";
import { PumpIndicator } from "@/components/PumpIndicator";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/hooks/useTheme";

export default function PumpScreen() {
  const {
    pumpStatus,
    autoMode,
    setAutoMode,
    togglePump,
    primaryTankLevel,
    secondaryTankLevel,
    autoTransferThreshold,
  } = useApp();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [confirmVisible, setConfirmVisible] = useState(false);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const handleAutoModeToggle = async (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!value && pumpStatus) {
      Alert.alert(
        "Disable Auto Mode",
        "The pump is currently running. Switching to manual will keep the pump in its current state. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            onPress: () => setAutoMode(false),
          },
        ]
      );
    } else {
      await setAutoMode(value);
    }
  };

  const handleManualToggle = () => {
    if (autoMode) {
      Alert.alert(
        "Auto Mode Active",
        "Disable auto mode first to manually control the pump.",
        [{ text: "OK" }]
      );
      return;
    }

    if (!pumpStatus && primaryTankLevel < 15) {
      Alert.alert(
        "Low Primary Tank",
        "Primary tank is critically low. Running the pump may cause dry running damage.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Start Anyway",
            style: "destructive",
            onPress: () => {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
              );
              togglePump();
            },
          },
        ]
      );
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    togglePump();
  };

  const safeToRun = primaryTankLevel > 20 && secondaryTankLevel < 90;

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
      <Text style={[styles.pageTitle, { color: colors.text }]}>
        Pump Control
      </Text>

      <Card colors={colors}>
        <View style={styles.statusCenter}>
          <PumpIndicator isOn={pumpStatus} colors={colors} />
          <Text style={[styles.pumpStatusText, { color: colors.text }]}>
            Pump is currently {pumpStatus ? "running" : "idle"}
          </Text>
          <Text style={[styles.pumpModeLabel, { color: colors.textMuted }]}>
            {autoMode ? "Controlled automatically" : "Manual override active"}
          </Text>
        </View>
      </Card>

      <Card colors={colors}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleLeft}>
            <View
              style={[
                styles.toggleIcon,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <Feather name="cpu" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.toggleTitle, { color: colors.text }]}>
                Automatic Mode
              </Text>
              <Text
                style={[styles.toggleSubtitle, { color: colors.textMuted }]}
              >
                Pump manages itself based on levels
              </Text>
            </View>
          </View>
          <Switch
            value={autoMode}
            onValueChange={handleAutoModeToggle}
            trackColor={{
              false: colors.border,
              true: colors.primary + "80",
            }}
            thumbColor={autoMode ? colors.primary : colors.textMuted}
          />
        </View>

        {autoMode && (
          <View
            style={[
              styles.autoInfoBox,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <Feather name="info" size={13} color={colors.primary} />
            <Text style={[styles.autoInfoText, { color: colors.primary }]}>
              Pump activates when secondary tank drops below {autoTransferThreshold}%
            </Text>
          </View>
        )}
      </Card>

      {!autoMode && (
        <Card colors={colors} style={{ borderColor: colors.warning + "40" }}>
          <View style={styles.warningRow}>
            <Feather name="alert-triangle" size={16} color={colors.warning} />
            <Text style={[styles.warningText, { color: colors.warning }]}>
              Manual control active
            </Text>
          </View>
          <Text style={[styles.warningDetail, { color: colors.textSecondary }]}>
            You are responsible for preventing dry running. Ensure the primary tank has sufficient water before running the pump.
          </Text>
        </Card>
      )}

      <Card colors={colors}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          Manual Override
        </Text>
        <TouchableOpacity
          style={[
            styles.manualBtn,
            {
              backgroundColor: pumpStatus
                ? colors.dangerLight
                : colors.successLight,
              borderColor: pumpStatus ? colors.danger : colors.success,
              opacity: autoMode ? 0.45 : 1,
            },
          ]}
          onPress={handleManualToggle}
          activeOpacity={0.8}
        >
          <Feather
            name={pumpStatus ? "power" : "play-circle"}
            size={20}
            color={pumpStatus ? colors.danger : colors.success}
          />
          <Text
            style={[
              styles.manualBtnText,
              { color: pumpStatus ? colors.danger : colors.success },
            ]}
          >
            {pumpStatus ? "Stop Pump" : "Start Pump"}
          </Text>
        </TouchableOpacity>
        {autoMode && (
          <Text style={[styles.disabledHint, { color: colors.textMuted }]}>
            Disable auto mode to control manually
          </Text>
        )}
      </Card>

      <Card colors={colors}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          Safety Status
        </Text>
        <View style={styles.safetyList}>
          <SafetyRow
            label="Primary tank level"
            ok={primaryTankLevel > 20}
            value={`${primaryTankLevel}%`}
            okMsg="Sufficient"
            warnMsg="Too low"
            colors={colors}
          />
          <SafetyRow
            label="Secondary tank"
            ok={secondaryTankLevel < 90}
            value={`${secondaryTankLevel}%`}
            okMsg="Space available"
            warnMsg="Nearly full"
            colors={colors}
          />
          <SafetyRow
            label="Safe to run pump"
            ok={safeToRun}
            value={safeToRun ? "Yes" : "No"}
            okMsg="Conditions met"
            warnMsg="Conditions not met"
            colors={colors}
          />
        </View>
      </Card>
    </ScrollView>
  );
}

function SafetyRow({
  label,
  ok,
  value,
  okMsg,
  warnMsg,
  colors,
}: {
  label: string;
  ok: boolean;
  value: string;
  okMsg: string;
  warnMsg: string;
  colors: any;
}) {
  return (
    <View style={styles.safetyRow}>
      <View
        style={[
          styles.safetyDot,
          { backgroundColor: ok ? colors.success : colors.warning },
        ]}
      />
      <View style={{ flex: 1 }}>
        <Text style={[styles.safetyLabel, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.safetyStatus, { color: ok ? colors.success : colors.warning }]}>
          {ok ? okMsg : warnMsg}
        </Text>
      </View>
      <Text style={[styles.safetyValue, { color: colors.textSecondary }]}>
        {value}
      </Text>
    </View>
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
  statusCenter: { alignItems: "center", gap: 8, paddingVertical: 8 },
  pumpStatusText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  pumpModeLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  toggleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  toggleSubtitle: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  autoInfoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
  },
  autoInfoText: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 17 },
  warningRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  warningText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  warningDetail: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  sectionLabel: { fontSize: 12, fontFamily: "Inter_500Medium", letterSpacing: 0.3, marginBottom: 12 },
  manualBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
  },
  manualBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  disabledHint: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 8 },
  safetyList: { gap: 14 },
  safetyRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  safetyDot: { width: 8, height: 8, borderRadius: 4 },
  safetyLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  safetyStatus: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  safetyValue: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
});
