import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
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
import { StatusBadge } from "@/components/StatusBadge";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/hooks/useTheme";

export default function SettingsScreen() {
  const {
    esp32Online,
    notificationsEnabled,
    setNotificationsEnabled,
    lowLevelThreshold,
    setLowLevelThreshold,
    criticalLevelThreshold,
    setCriticalLevelThreshold,
    autoTransferThreshold,
    setAutoTransferThreshold,
    theme,
    setTheme,
    simulateRefill,
  } = useApp();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const themeOptions: { label: string; value: "light" | "dark" | "system" }[] =
    [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
      { label: "System", value: "system" },
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
      <Text style={[styles.pageTitle, { color: colors.text }]}>Settings</Text>

      <SectionHeader label="Device" colors={colors} />
      <Card colors={colors}>
        <View style={styles.deviceRow}>
          <View style={styles.deviceLeft}>
            <View
              style={[styles.devIcon, { backgroundColor: colors.primaryLight }]}
            >
              <Feather name="cpu" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.deviceName, { color: colors.text }]}>
                ESP32 Controller
              </Text>
              <Text style={[styles.deviceId, { color: colors.textMuted }]}>
                ID: AQG-001 · v2.4.1
              </Text>
            </View>
          </View>
          <StatusBadge online={esp32Online} colors={colors} compact />
        </View>
        <View
          style={[styles.divider, { backgroundColor: colors.border }]}
        />
        <View style={styles.deviceRow}>
          <Text style={[styles.deviceProp, { color: colors.textSecondary }]}>
            Connection
          </Text>
          <Text style={[styles.deviceVal, { color: colors.text }]}>
            Wi-Fi (2.4 GHz)
          </Text>
        </View>
        <View style={styles.deviceRow}>
          <Text style={[styles.deviceProp, { color: colors.textSecondary }]}>
            IP Address
          </Text>
          <Text style={[styles.deviceVal, { color: colors.text }]}>
            192.168.1.42
          </Text>
        </View>
        <View style={styles.deviceRow}>
          <Text style={[styles.deviceProp, { color: colors.textSecondary }]}>
            Last Seen
          </Text>
          <Text style={[styles.deviceVal, { color: colors.text }]}>
            Just now
          </Text>
        </View>
      </Card>

      <SectionHeader label="Notifications" colors={colors} />
      <Card colors={colors}>
        <SettingsToggle
          label="Enable Notifications"
          subtitle="Receive alerts for critical levels"
          icon="bell"
          value={notificationsEnabled}
          onChange={(v) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setNotificationsEnabled(v);
          }}
          colors={colors}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingsToggle
          label="Low Level Alerts"
          subtitle="When tanks drop below threshold"
          icon="alert-triangle"
          value={notificationsEnabled}
          onChange={() => {}}
          colors={colors}
          disabled={!notificationsEnabled}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingsToggle
          label="Pump Events"
          subtitle="Pump start / stop notifications"
          icon="activity"
          value={notificationsEnabled}
          onChange={() => {}}
          colors={colors}
          disabled={!notificationsEnabled}
        />
      </Card>

      <SectionHeader label="System Thresholds" colors={colors} />
      <Card colors={colors}>
        <ThresholdSlider
          label="Low Level Alert"
          value={lowLevelThreshold}
          min={10}
          max={50}
          color={colors.warning}
          unit="%"
          colors={colors}
          onChange={setLowLevelThreshold}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <ThresholdSlider
          label="Critical Level"
          value={criticalLevelThreshold}
          min={5}
          max={20}
          color={colors.danger}
          unit="%"
          colors={colors}
          onChange={setCriticalLevelThreshold}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <ThresholdSlider
          label="Auto Transfer Threshold"
          value={autoTransferThreshold}
          min={10}
          max={40}
          color={colors.primary}
          unit="%"
          colors={colors}
          onChange={setAutoTransferThreshold}
        />
      </Card>

      <SectionHeader label="Appearance" colors={colors} />
      <Card colors={colors}>
        <Text style={[styles.themeLabel, { color: colors.textSecondary }]}>
          Theme
        </Text>
        <View style={styles.themeButtons}>
          {themeOptions.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.themeBtn,
                {
                  backgroundColor:
                    theme === opt.value
                      ? colors.primary
                      : colors.surfaceSecondary,
                  borderColor:
                    theme === opt.value ? colors.primary : colors.border,
                },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setTheme(opt.value);
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.themeBtnText,
                  {
                    color:
                      theme === opt.value ? "#fff" : colors.textSecondary,
                  },
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <SectionHeader label="Debug / Simulation" colors={colors} />
      <Card colors={colors}>
        <TouchableOpacity
          style={[
            styles.simBtn,
            { backgroundColor: colors.primaryLight },
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            simulateRefill();
          }}
          activeOpacity={0.8}
        >
          <Feather name="droplet" size={16} color={colors.primary} />
          <Text style={[styles.simBtnText, { color: colors.primary }]}>
            Simulate Primary Tank Refill
          </Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
}

function SectionHeader({
  label,
  colors,
}: {
  label: string;
  colors: any;
}) {
  return (
    <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>
      {label.toUpperCase()}
    </Text>
  );
}

function SettingsToggle({
  label,
  subtitle,
  icon,
  value,
  onChange,
  colors,
  disabled = false,
}: {
  label: string;
  subtitle: string;
  icon: any;
  value: boolean;
  onChange: (v: boolean) => void;
  colors: any;
  disabled?: boolean;
}) {
  return (
    <View
      style={[styles.toggleRow, disabled && { opacity: 0.4 }]}
    >
      <View
        style={[styles.toggleIcon, { backgroundColor: colors.surfaceSecondary }]}
      >
        <Feather name={icon} size={16} color={colors.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.toggleTitle, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.toggleSub, { color: colors.textMuted }]}>
          {subtitle}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ false: colors.border, true: colors.primary + "80" }}
        thumbColor={value ? colors.primary : colors.textMuted}
      />
    </View>
  );
}

function ThresholdSlider({
  label,
  value,
  min,
  max,
  color,
  unit,
  colors,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  color: string;
  unit: string;
  colors: any;
  onChange: (v: number) => void;
}) {
  const step = 1;
  const canDecrease = value > min;
  const canIncrease = value < max;
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <View style={styles.sliderBlock}>
      <View style={styles.sliderHeader}>
        <Text style={[styles.sliderLabel, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.sliderValue, { color }]}>
          {value}{unit}
        </Text>
      </View>
      <View style={styles.stepperRow}>
        <TouchableOpacity
          style={[
            styles.stepBtn,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.border,
              opacity: canDecrease ? 1 : 0.35,
            },
          ]}
          disabled={!canDecrease}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onChange(Math.max(min, value - step));
          }}
        >
          <Feather name="minus" size={14} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={[styles.trackOuter, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.trackFill,
              { backgroundColor: color, width: `${pct}%` as any },
            ]}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.stepBtn,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.border,
              opacity: canIncrease ? 1 : 0.35,
            },
          ]}
          disabled={!canIncrease}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onChange(Math.min(max, value + step));
          }}
        >
          <Feather name="plus" size={14} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <View style={styles.sliderRange}>
        <Text style={[styles.rangeText, { color: colors.textMuted }]}>
          {min}{unit}
        </Text>
        <Text style={[styles.rangeText, { color: colors.textMuted }]}>
          {max}{unit}
        </Text>
      </View>
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
  sectionHeader: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    marginBottom: -4,
    marginLeft: 2,
  },
  divider: { height: 1 },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    gap: 12,
  },
  deviceLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  devIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  deviceName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  deviceId: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  deviceProp: { fontSize: 13, fontFamily: "Inter_400Regular" },
  deviceVal: { fontSize: 13, fontFamily: "Inter_500Medium" },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  toggleIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleTitle: { fontSize: 14, fontFamily: "Inter_500Medium" },
  toggleSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  themeLabel: { fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 10 },
  themeButtons: { flexDirection: "row", gap: 8 },
  themeBtn: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 9,
    alignItems: "center",
  },
  themeBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  sliderBlock: { paddingVertical: 6 },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sliderLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  sliderValue: { fontSize: 14, fontFamily: "Inter_700Bold" },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  trackOuter: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  trackFill: {
    height: "100%",
    borderRadius: 3,
  },
  sliderRange: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  rangeText: { fontSize: 10, fontFamily: "Inter_400Regular" },
  simBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
    paddingVertical: 12,
  },
  simBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
