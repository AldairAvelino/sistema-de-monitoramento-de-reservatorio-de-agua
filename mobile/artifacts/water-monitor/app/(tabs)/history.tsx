import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/Card";
import { SystemEvent, useApp } from "@/context/AppContext";
import { useTheme } from "@/hooks/useTheme";

export default function HistoryScreen() {
  const { events } = useApp();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const grouped = groupEventsByDay(events);

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
      <Text style={[styles.pageTitle, { color: colors.text }]}>History</Text>
      <Text style={[styles.eventCount, { color: colors.textMuted }]}>
        {events.length} system event{events.length !== 1 ? "s" : ""}
      </Text>

      {grouped.map(({ dateLabel, events: dayEvents }) => (
        <View key={dateLabel}>
          <View style={styles.dayHeader}>
            <View
              style={[
                styles.dayLine,
                { backgroundColor: colors.border },
              ]}
            />
            <Text style={[styles.dayLabel, { color: colors.textMuted }]}>
              {dateLabel}
            </Text>
            <View
              style={[styles.dayLine, { backgroundColor: colors.border }]}
            />
          </View>

          <Card colors={colors} noPadding>
            {dayEvents.map((event, i) => (
              <View key={event.id}>
                {i > 0 && (
                  <View
                    style={[
                      styles.separator,
                      { backgroundColor: colors.border },
                    ]}
                  />
                )}
                <EventRow event={event} colors={colors} />
              </View>
            ))}
          </Card>
        </View>
      ))}

      {events.length === 0 && (
        <View style={styles.emptyState}>
          <Feather name="clock" size={36} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No events yet
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
            System events will appear here
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function EventRow({
  event,
  colors,
}: {
  event: SystemEvent;
  colors: any;
}) {
  const { icon, iconBg, iconColor } = getEventStyle(event, colors);

  return (
    <View style={styles.eventRow}>
      <View style={[styles.eventIcon, { backgroundColor: iconBg }]}>
        <Feather name={icon as any} size={14} color={iconColor} />
      </View>
      <View style={styles.eventContent}>
        <Text style={[styles.eventMessage, { color: colors.text }]}>
          {event.message}
        </Text>
        <Text style={[styles.eventTime, { color: colors.textMuted }]}>
          {formatFullTime(event.timestamp)}
        </Text>
      </View>
      {event.severity !== "info" && (
        <View
          style={[
            styles.severityBadge,
            {
              backgroundColor:
                event.severity === "critical"
                  ? colors.dangerLight
                  : colors.warningLight,
            },
          ]}
        >
          <Text
            style={[
              styles.severityText,
              {
                color:
                  event.severity === "critical"
                    ? colors.danger
                    : colors.warning,
              },
            ]}
          >
            {event.severity}
          </Text>
        </View>
      )}
    </View>
  );
}

function getEventStyle(event: SystemEvent, colors: any) {
  switch (event.type) {
    case "pump_on":
      return {
        icon: "play-circle",
        iconBg: colors.successLight,
        iconColor: colors.success,
      };
    case "pump_off":
      return {
        icon: "stop-circle",
        iconBg: colors.surfaceSecondary,
        iconColor: colors.textMuted,
      };
    case "refill":
      return {
        icon: "droplet",
        iconBg: colors.primaryLight,
        iconColor: colors.primary,
      };
    case "alert_low":
      return {
        icon: "alert-triangle",
        iconBg: colors.warningLight,
        iconColor: colors.warning,
      };
    case "alert_empty":
      return {
        icon: "alert-circle",
        iconBg: colors.dangerLight,
        iconColor: colors.danger,
      };
    case "system_online":
      return {
        icon: "wifi",
        iconBg: colors.successLight,
        iconColor: colors.success,
      };
    case "system_offline":
      return {
        icon: "wifi-off",
        iconBg: colors.dangerLight,
        iconColor: colors.danger,
      };
    case "mode_change":
      return {
        icon: "settings",
        iconBg: colors.primaryLight,
        iconColor: colors.primary,
      };
    default:
      return {
        icon: "activity",
        iconBg: colors.surfaceSecondary,
        iconColor: colors.textMuted,
      };
  }
}

function groupEventsByDay(events: SystemEvent[]) {
  const groups: Record<string, SystemEvent[]> = {};

  events.forEach((event) => {
    const dateKey = new Date(event.timestamp).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(event);
  });

  return Object.entries(groups).map(([dateLabel, events]) => ({
    dateLabel,
    events,
  }));
}

function formatFullTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pageTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  eventCount: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: -4,
    marginBottom: 2,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    marginTop: 4,
  },
  dayLine: { flex: 1, height: 1 },
  dayLabel: { fontSize: 11, fontFamily: "Inter_500Medium", letterSpacing: 0.3 },
  separator: { height: 1, marginHorizontal: 16 },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  eventIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  eventContent: { flex: 1 },
  eventMessage: { fontSize: 13, fontFamily: "Inter_500Medium", lineHeight: 18 },
  eventTime: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  severityBadge: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  severityText: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 0.4 },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 8,
  },
  emptyText: { fontSize: 16, fontFamily: "Inter_500Medium" },
  emptySubtext: { fontSize: 13, fontFamily: "Inter_400Regular" },
});
