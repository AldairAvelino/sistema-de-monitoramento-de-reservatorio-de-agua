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
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/hooks/useTheme";

export default function SecurityScreen() {
  const { user } = useApp();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [sessionAlerts, setSessionAlerts] = useState(true);

  const handleChangePassword = () => {
    Alert.alert(
      "Change Password",
      "A password reset link will be sent to " + user?.email,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Link",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("Sent", "Check your email for the reset link.");
          },
        },
      ]
    );
  };

  const handleRevokeSessions = () => {
    Alert.alert(
      "Revoke All Sessions",
      "This will sign you out from all other devices. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Revoke",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert("Done", "All other sessions have been revoked.");
          },
        },
      ]
    );
  };

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
      <Text style={[styles.pageTitle, { color: colors.text }]}>Security</Text>

      <Card colors={colors}>
        <View style={styles.accountRow}>
          <View
            style={[styles.avatarSmall, { backgroundColor: colors.primaryLight }]}
          >
            <Feather name="user" size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.accountName, { color: colors.text }]}>
              {user?.name ?? "User"}
            </Text>
            <Text style={[styles.accountEmail, { color: colors.textSecondary }]}>
              {user?.email ?? ""}
            </Text>
          </View>
          <View
            style={[styles.verifiedBadge, { backgroundColor: colors.successLight }]}
          >
            <Feather name="check" size={12} color={colors.success} />
            <Text style={[styles.verifiedText, { color: colors.success }]}>
              Verified
            </Text>
          </View>
        </View>
      </Card>

      <SectionLabel label="Authentication" colors={colors} />

      <Card colors={colors} noPadding>
        <ToggleRow
          icon="smartphone"
          iconBg={colors.primaryLight}
          iconColor={colors.primary}
          label="Two-Factor Authentication"
          subtitle="Add an extra layer of security"
          value={twoFactorEnabled}
          onChange={(v) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setTwoFactorEnabled(v);
            if (v)
              Alert.alert(
                "2FA Enabled",
                "Two-factor authentication is now active."
              );
          }}
          colors={colors}
        />
        <Divider colors={colors} />
        <ToggleRow
          icon="eye"
          iconBg={colors.secondaryLight}
          iconColor={colors.secondary}
          label="Biometric Login"
          subtitle="Use Face ID or fingerprint"
          value={biometricEnabled}
          onChange={(v) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setBiometricEnabled(v);
          }}
          colors={colors}
        />
        <Divider colors={colors} />
        <ToggleRow
          icon="bell"
          iconBg={colors.warningLight}
          iconColor={colors.warning}
          label="New Sign-in Alerts"
          subtitle="Get notified of new sessions"
          value={sessionAlerts}
          onChange={(v) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSessionAlerts(v);
          }}
          colors={colors}
        />
      </Card>

      <SectionLabel label="Password" colors={colors} />

      <Card colors={colors} noPadding>
        <ActionRow
          icon="lock"
          iconBg={colors.primaryLight}
          iconColor={colors.primary}
          label="Change Password"
          subtitle="Send a reset link to your email"
          colors={colors}
          onPress={handleChangePassword}
        />
      </Card>

      <SectionLabel label="Sessions" colors={colors} />

      <Card colors={colors} noPadding>
        <View style={styles.sessionItem}>
          <View
            style={[styles.sessionIcon, { backgroundColor: colors.successLight }]}
          >
            <Feather name="monitor" size={16} color={colors.success} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sessionDevice, { color: colors.text }]}>
              This device
            </Text>
            <Text style={[styles.sessionInfo, { color: colors.textMuted }]}>
              Active now · AquaGuard App
            </Text>
          </View>
          <View
            style={[styles.activeTag, { backgroundColor: colors.successLight }]}
          >
            <Text style={[styles.activeTagText, { color: colors.success }]}>
              Active
            </Text>
          </View>
        </View>
        <Divider colors={colors} />
        <TouchableOpacity
          style={styles.revokeBtn}
          onPress={handleRevokeSessions}
          activeOpacity={0.75}
        >
          <Feather name="log-out" size={14} color={colors.danger} />
          <Text style={[styles.revokeBtnText, { color: colors.danger }]}>
            Revoke All Other Sessions
          </Text>
        </TouchableOpacity>
      </Card>

      <SectionLabel label="Data & Privacy" colors={colors} />

      <Card colors={colors} noPadding>
        <ActionRow
          icon="download"
          iconBg={colors.primaryLight}
          iconColor={colors.primary}
          label="Export My Data"
          subtitle="Download all system logs and data"
          colors={colors}
          onPress={() =>
            Alert.alert("Export Data", "Your data export will be emailed to " + user?.email)
          }
        />
        <Divider colors={colors} />
        <ActionRow
          icon="trash-2"
          iconBg={colors.dangerLight}
          iconColor={colors.danger}
          label="Delete Account"
          subtitle="Permanently remove your account"
          colors={colors}
          onPress={() =>
            Alert.alert(
              "Delete Account",
              "This action is irreversible. Contact support to proceed.",
              [{ text: "OK" }]
            )
          }
          danger
        />
      </Card>
    </ScrollView>
  );
}

function SectionLabel({ label, colors }: { label: string; colors: any }) {
  return (
    <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
      {label.toUpperCase()}
    </Text>
  );
}

function Divider({ colors }: { colors: any }) {
  return (
    <View style={[styles.divider, { backgroundColor: colors.border }]} />
  );
}

function ToggleRow({
  icon,
  iconBg,
  iconColor,
  label,
  subtitle,
  value,
  onChange,
  colors,
}: {
  icon: any;
  iconBg: string;
  iconColor: string;
  label: string;
  subtitle: string;
  value: boolean;
  onChange: (v: boolean) => void;
  colors: any;
}) {
  return (
    <View style={styles.rowItem}>
      <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
        <Feather name={icon} size={16} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.rowSub, { color: colors.textMuted }]}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.primary + "80" }}
        thumbColor={value ? colors.primary : colors.textMuted}
      />
    </View>
  );
}

function ActionRow({
  icon,
  iconBg,
  iconColor,
  label,
  subtitle,
  colors,
  onPress,
  danger = false,
}: {
  icon: any;
  iconBg: string;
  iconColor: string;
  label: string;
  subtitle: string;
  colors: any;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.rowItem} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
        <Feather name={icon} size={16} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.rowLabel,
            { color: danger ? colors.danger : colors.text },
          ]}
        >
          {label}
        </Text>
        <Text style={[styles.rowSub, { color: colors.textMuted }]}>{subtitle}</Text>
      </View>
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
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    marginBottom: -4,
    marginLeft: 2,
  },
  accountRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  accountName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  accountEmail: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  verifiedText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  divider: { height: 1, marginHorizontal: 16 },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  rowSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  sessionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  sessionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  sessionDevice: { fontSize: 14, fontFamily: "Inter_500Medium" },
  sessionInfo: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  activeTag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  activeTagText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  revokeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
  },
  revokeBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});
