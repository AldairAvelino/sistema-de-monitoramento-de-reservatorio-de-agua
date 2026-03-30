import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
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
import { useTheme } from "@/hooks/useTheme";

const faqs = [
  {
    id: "1",
    question: "How does the automatic pump mode work?",
    answer:
      "In auto mode, the ESP32 monitors the secondary tank level continuously. When it drops below the configured auto-transfer threshold, the pump activates to refill it from the primary tank. The pump stops once the secondary tank reaches 85% or if the primary tank drops below 15%.",
  },
  {
    id: "2",
    question: "What happens if the ESP32 goes offline?",
    answer:
      "If the device goes offline, the app displays an offline warning on the dashboard. The pump will remain in its last known state. Automatic control resumes as soon as the device reconnects.",
  },
  {
    id: "3",
    question: "How do I prevent the pump from running dry?",
    answer:
      "Keep auto mode enabled — it includes a safety cutoff that stops the pump when the primary tank drops below 15%. In manual mode, always check the primary tank level before starting the pump.",
  },
  {
    id: "4",
    question: "How do I calibrate the sensor thresholds?",
    answer:
      "Go to Settings → System Thresholds. You can adjust the low level alert, critical level, and auto-transfer threshold independently for each use case.",
  },
  {
    id: "5",
    question: "Can I connect multiple ESP32 devices?",
    answer:
      "The current version supports a single ESP32 device per account. Multi-device support is planned for a future release.",
  },
];

const topics = [
  { icon: "book", label: "Documentation", subtitle: "Full system manual" },
  { icon: "video", label: "Video Tutorials", subtitle: "Step-by-step guides" },
  { icon: "message-circle", label: "Community Forum", subtitle: "Ask the community" },
  { icon: "github", label: "GitHub", subtitle: "Open source repository" },
];

export default function HelpScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const handleContact = () => {
    Alert.alert(
      "Contact Support",
      "Send an email to support@aquaguard.io or use the in-app chat during business hours (Mon–Fri, 9am–6pm UTC).",
      [{ text: "OK" }]
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
      <Text style={[styles.pageTitle, { color: colors.text }]}>
        Help & Support
      </Text>

      <Card colors={colors}>
        <View style={styles.contactBlock}>
          <View
            style={[styles.contactIcon, { backgroundColor: colors.primaryLight }]}
          >
            <Feather name="headphones" size={24} color={colors.primary} />
          </View>
          <Text style={[styles.contactTitle, { color: colors.text }]}>
            Need help?
          </Text>
          <Text style={[styles.contactSubtitle, { color: colors.textSecondary }]}>
            Our support team is ready to assist you with any issues.
          </Text>
          <TouchableOpacity
            style={[styles.contactBtn, { backgroundColor: colors.primary }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              handleContact();
            }}
            activeOpacity={0.85}
          >
            <Feather name="mail" size={14} color="#fff" />
            <Text style={styles.contactBtnText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <SectionLabel label="Resources" colors={colors} />

      <Card colors={colors} noPadding>
        {topics.map((t, i) => (
          <View key={t.label}>
            {i > 0 && (
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
            )}
            <TouchableOpacity
              style={styles.topicRow}
              activeOpacity={0.75}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert(t.label, t.subtitle + " — coming soon.");
              }}
            >
              <View
                style={[
                  styles.topicIcon,
                  { backgroundColor: colors.primaryLight },
                ]}
              >
                <Feather name={t.icon as any} size={16} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.topicLabel, { color: colors.text }]}>
                  {t.label}
                </Text>
                <Text style={[styles.topicSub, { color: colors.textMuted }]}>
                  {t.subtitle}
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        ))}
      </Card>

      <SectionLabel label="Frequently Asked Questions" colors={colors} />

      <View style={styles.faqList}>
        {faqs.map((faq) => {
          const expanded = expandedId === faq.id;
          return (
            <Card key={faq.id} colors={colors} noPadding>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setExpandedId(expanded ? null : faq.id);
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.faqQuestion, { color: colors.text, flex: 1 }]}
                >
                  {faq.question}
                </Text>
                <Feather
                  name={expanded ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
              {expanded && (
                <View
                  style={[
                    styles.faqAnswer,
                    { borderTopColor: colors.border },
                  ]}
                >
                  <Text
                    style={[styles.faqAnswerText, { color: colors.textSecondary }]}
                  >
                    {faq.answer}
                  </Text>
                </View>
              )}
            </Card>
          );
        })}
      </View>

      <Card colors={colors}>
        <View style={styles.versionRow}>
          <Text style={[styles.versionLabel, { color: colors.textMuted }]}>
            App Version
          </Text>
          <Text style={[styles.versionValue, { color: colors.text }]}>
            1.0.0 (build 42)
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border, marginVertical: 10 }]} />
        <View style={styles.versionRow}>
          <Text style={[styles.versionLabel, { color: colors.textMuted }]}>
            Firmware
          </Text>
          <Text style={[styles.versionValue, { color: colors.text }]}>
            ESP32 v2.4.1
          </Text>
        </View>
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
  contactBlock: { alignItems: "center", gap: 8, paddingVertical: 8 },
  contactIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  contactTitle: { fontSize: 17, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  contactSubtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 18,
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 11,
    marginTop: 4,
  },
  contactBtnText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  divider: { height: 1 },
  topicRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  topicIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  topicLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  topicSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  faqList: { gap: 8 },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
  },
  faqQuestion: { fontSize: 13, fontFamily: "Inter_600SemiBold", lineHeight: 18 },
  faqAnswer: {
    borderTopWidth: 1,
    padding: 14,
    paddingTop: 12,
  },
  faqAnswerText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  versionRow: { flexDirection: "row", justifyContent: "space-between" },
  versionLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  versionValue: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});
