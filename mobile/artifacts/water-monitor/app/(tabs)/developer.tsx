import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";

const team = [
  {
    id: "1",
    name: "Lucas Andrade",
    role: "Lead Firmware Engineer",
    area: "ESP32 · Embedded Systems",
    github: "lucasandrade",
    avatar: "LA",
    color: "#1A7AFF",
  },
  {
    id: "2",
    name: "Marina Costa",
    role: "Mobile Developer",
    area: "React Native · Expo",
    github: "marinacosta",
    avatar: "MC",
    color: "#00C8E0",
  },
  {
    id: "3",
    name: "Rafael Mendes",
    role: "Backend Engineer",
    area: "Node.js · IoT Protocols",
    github: "rafaelmendes",
    avatar: "RM",
    color: "#00B87A",
  },
  {
    id: "4",
    name: "Sofia Ribeiro",
    role: "UI/UX Designer",
    area: "Product Design · Figma",
    github: "sofiaribeiro",
    avatar: "SR",
    color: "#F59E0B",
  },
  {
    id: "5",
    name: "Diego Ferreira",
    role: "DevOps & Cloud",
    area: "AWS · MQTT · Docker",
    github: "diegoferreira",
    avatar: "DF",
    color: "#8B5CF6",
  },
];

const techStack = [
  { icon: "cpu", label: "Microcontroller", value: "ESP32-WROOM-32" },
  { icon: "wifi", label: "Protocol", value: "MQTT over Wi-Fi" },
  { icon: "smartphone", label: "Mobile", value: "React Native + Expo" },
  { icon: "server", label: "Backend", value: "Node.js + Express" },
  { icon: "database", label: "Database", value: "PostgreSQL + Drizzle" },
  { icon: "shield", label: "Security", value: "TLS 1.3 + JWT" },
];

export default function DeveloperScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

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
      <Text style={[styles.pageTitle, { color: colors.text }]}>Developer</Text>

      <Card colors={colors}>
        <View style={styles.projectHeader}>
          <View
            style={[styles.projectIconWrap, { backgroundColor: colors.primaryLight }]}
          >
            <Feather name="droplet" size={28} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.projectName, { color: colors.text }]}>
              AquaGuard
            </Text>
            <Text style={[styles.projectTagline, { color: colors.textSecondary }]}>
              IoT Water Reservoir Monitoring System
            </Text>
          </View>
        </View>
        <View
          style={[styles.projectDivider, { backgroundColor: colors.border }]}
        />
        <Text style={[styles.projectDesc, { color: colors.textSecondary }]}>
          AquaGuard is an open-source smart water management system built around the ESP32 microcontroller. It provides real-time monitoring of primary and secondary water tanks, automated pump control, and critical-level safety alerts — designed for smart homes and agriculture.
        </Text>
        <View style={styles.badgeRow}>
          <Badge label="v1.0.0" color={colors.primary} bg={colors.primaryLight} />
          <Badge label="Open Source" color={colors.success} bg={colors.successLight} />
          <Badge label="MIT License" color={colors.textSecondary} bg={colors.surfaceSecondary} />
        </View>
      </Card>

      <SectionLabel label="Development Team" colors={colors} />

      {team.map((member) => (
        <TeamCard key={member.id} member={member} colors={colors} />
      ))}

      <SectionLabel label="Tech Stack" colors={colors} />

      <Card colors={colors} noPadding>
        {techStack.map((t, i) => (
          <View key={t.label}>
            {i > 0 && (
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
            )}
            <View style={styles.techRow}>
              <View
                style={[styles.techIcon, { backgroundColor: colors.primaryLight }]}
              >
                <Feather name={t.icon as any} size={14} color={colors.primary} />
              </View>
              <Text style={[styles.techLabel, { color: colors.textSecondary }]}>
                {t.label}
              </Text>
              <Text style={[styles.techValue, { color: colors.text }]}>
                {t.value}
              </Text>
            </View>
          </View>
        ))}
      </Card>

      <SectionLabel label="Repository" colors={colors} />

      <Card colors={colors}>
        <TouchableOpacity
          style={[styles.repoBtn, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
          activeOpacity={0.8}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert("GitHub", "github.com/aquaguard/aquaguard-app");
          }}
        >
          <Feather name="github" size={20} color={colors.text} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.repoName, { color: colors.text }]}>
              aquaguard/aquaguard-app
            </Text>
            <Text style={[styles.repoSub, { color: colors.textMuted }]}>
              github.com/aquaguard
            </Text>
          </View>
          <Feather name="external-link" size={14} color={colors.textMuted} />
        </TouchableOpacity>
      </Card>

      <Card colors={colors}>
        <View style={styles.buildRow}>
          <BuildInfo label="Build" value="42" colors={colors} />
          <View style={[styles.buildDivider, { backgroundColor: colors.border }]} />
          <BuildInfo label="SDK" value="Expo 53" colors={colors} />
          <View style={[styles.buildDivider, { backgroundColor: colors.border }]} />
          <BuildInfo label="React Native" value="0.79" colors={colors} />
        </View>
      </Card>
    </ScrollView>
  );
}

function TeamCard({
  member,
  colors,
}: {
  member: (typeof team)[0];
  colors: any;
}) {
  return (
    <Card colors={colors}>
      <View style={styles.memberRow}>
        <View
          style={[
            styles.memberAvatar,
            { backgroundColor: member.color + "20" },
          ]}
        >
          <Text style={[styles.memberInitials, { color: member.color }]}>
            {member.avatar}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.memberName, { color: colors.text }]}>
            {member.name}
          </Text>
          <Text style={[styles.memberRole, { color: colors.primary }]}>
            {member.role}
          </Text>
          <Text style={[styles.memberArea, { color: colors.textMuted }]}>
            {member.area}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.githubBtn,
            { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
          ]}
          activeOpacity={0.75}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert("GitHub", "@" + member.github);
          }}
        >
          <Feather name="github" size={15} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </Card>
  );
}

function Badge({
  label,
  color,
  bg,
}: {
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

function SectionLabel({ label, colors }: { label: string; colors: any }) {
  return (
    <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
      {label.toUpperCase()}
    </Text>
  );
}

function BuildInfo({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: any;
}) {
  return (
    <View style={styles.buildItem}>
      <Text style={[styles.buildValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.buildLabel, { color: colors.textMuted }]}>{label}</Text>
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
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    marginBottom: -4,
    marginLeft: 2,
  },
  projectHeader: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 14 },
  projectIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  projectName: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  projectTagline: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2, lineHeight: 16 },
  projectDivider: { height: 1, marginBottom: 14 },
  projectDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19, marginBottom: 14 },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  badge: { borderRadius: 6, paddingHorizontal: 9, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  memberRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  memberInitials: { fontSize: 15, fontFamily: "Inter_700Bold" },
  memberName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  memberRole: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 1 },
  memberArea: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  githubBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: { height: 1, marginHorizontal: 16 },
  techRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 13,
  },
  techIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  techLabel: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1 },
  techValue: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  repoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  repoName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  repoSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  buildRow: { flexDirection: "row", alignItems: "center" },
  buildItem: { flex: 1, alignItems: "center", gap: 2 },
  buildValue: { fontSize: 15, fontFamily: "Inter_700Bold" },
  buildLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  buildDivider: { width: 1, height: 32 },
});
