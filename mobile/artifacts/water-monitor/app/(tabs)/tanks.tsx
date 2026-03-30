import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/Card";
import { MiniLineChart } from "@/components/MiniLineChart";
import { TankBar } from "@/components/TankBar";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/hooks/useTheme";

const { width: SCREEN_W } = Dimensions.get("window");

export default function TanksScreen() {
  const {
    primaryTankLevel,
    secondaryTankLevel,
    primaryHistory,
    secondaryHistory,
    lowLevelThreshold,
    criticalLevelThreshold,
  } = useApp();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const chartWidth = SCREEN_W - 40 - 36;

  const getLevelLabel = (level: number) => {
    if (level > 70) return { text: "Full", color: colors.tankHigh };
    if (level > 40) return { text: "Medium", color: colors.tankMedium };
    if (level > 15) return { text: "Low", color: colors.tankLow };
    return { text: "Empty", color: colors.tankEmpty };
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
        Tank Details
      </Text>

      <TankDetailCard
        name="Primary Tank"
        subtitle="Water source"
        level={primaryTankLevel}
        history={primaryHistory}
        chartWidth={chartWidth}
        colors={colors}
        icon="droplet"
        iconColor={colors.tankHigh}
        getLevelLabel={getLevelLabel}
        lowThreshold={lowLevelThreshold}
        criticalThreshold={criticalLevelThreshold}
      />

      <TankDetailCard
        name="Secondary Tank"
        subtitle="Usage + pump"
        level={secondaryTankLevel}
        history={secondaryHistory}
        chartWidth={chartWidth}
        colors={colors}
        icon="zap"
        iconColor={colors.secondary}
        getLevelLabel={getLevelLabel}
        lowThreshold={lowLevelThreshold}
        criticalThreshold={criticalLevelThreshold}
      />
    </ScrollView>
  );
}

function TankDetailCard({
  name,
  subtitle,
  level,
  history,
  chartWidth,
  colors,
  icon,
  iconColor,
  getLevelLabel,
  lowThreshold,
  criticalThreshold,
}: {
  name: string;
  subtitle: string;
  level: number;
  history: { timestamp: number; level: number }[];
  chartWidth: number;
  colors: any;
  icon: any;
  iconColor: string;
  getLevelLabel: (level: number) => { text: string; color: string };
  lowThreshold: number;
  criticalThreshold: number;
}) {
  const levelInfo = getLevelLabel(level);

  const hoursAgo = (i: number, total: number) => {
    const hoursBack = (total - 1 - i) * 1;
    if (hoursBack === 0) return "Now";
    if (hoursBack < 12) return `-${hoursBack}h`;
    return `-${hoursBack}h`;
  };

  return (
    <Card colors={colors} noPadding>
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor:
                iconColor === colors.tankHigh
                  ? colors.primaryLight
                  : colors.secondaryLight,
            },
          ]}
        >
          <Feather name={icon} size={18} color={iconColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.tankName, { color: colors.text }]}>{name}</Text>
          <Text style={[styles.tankSubtitle, { color: colors.textMuted }]}>
            {subtitle}
          </Text>
        </View>
        <View
          style={[
            styles.levelBadge,
            { backgroundColor: levelInfo.color + "1A" },
          ]}
        >
          <Text style={[styles.levelBadgeText, { color: levelInfo.color }]}>
            {levelInfo.text}
          </Text>
        </View>
      </View>

      <View style={styles.levelRow}>
        <TankBar level={level} label="" colors={colors} height={130} showLabel={false} />
        <View style={styles.statsBlock}>
          <Text style={[styles.bigPercent, { color: levelInfo.color }]}>
            {level}%
          </Text>
          <Text style={[styles.statsLabel, { color: colors.textMuted }]}>
            Current level
          </Text>
          <View style={styles.thresholdList}>
            <ThresholdRow
              label="Low alert"
              value={`${lowThreshold}%`}
              color={colors.warning}
              colors={colors}
              triggered={level <= lowThreshold}
            />
            <ThresholdRow
              label="Critical"
              value={`${criticalThreshold}%`}
              color={colors.danger}
              colors={colors}
              triggered={level <= criticalThreshold}
            />
          </View>
        </View>
      </View>

      <View style={[styles.chartSection, { borderTopColor: colors.border }]}>
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            Level History
          </Text>
          <Text style={[styles.chartSubtitle, { color: colors.textMuted }]}>
            Last {history.length} readings
          </Text>
        </View>
        <View style={styles.chartContainer}>
          <MiniLineChart
            data={history}
            color={iconColor}
            width={chartWidth}
            height={90}
            colors={colors}
            showGradient
          />
          <View style={styles.yLabels}>
            {[100, 50, 0].map((v) => (
              <Text key={v} style={[styles.yLabel, { color: colors.textMuted }]}>
                {v}%
              </Text>
            ))}
          </View>
        </View>
      </View>
    </Card>
  );
}

function ThresholdRow({
  label,
  value,
  color,
  colors,
  triggered,
}: {
  label: string;
  value: string;
  color: string;
  colors: any;
  triggered: boolean;
}) {
  return (
    <View style={styles.threshRow}>
      <View style={[styles.threshDot, { backgroundColor: color }]} />
      <Text style={[styles.threshLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text
        style={[
          styles.threshValue,
          { color: triggered ? color : colors.textMuted },
        ]}
      >
        {value}
        {triggered ? " ⚠" : ""}
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    paddingBottom: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tankName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -0.2,
  },
  tankSubtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  levelBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  levelBadgeText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingBottom: 16,
    gap: 20,
  },
  statsBlock: { flex: 1 },
  bigPercent: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1.5,
  },
  statsLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginBottom: 12,
  },
  thresholdList: { gap: 6 },
  threshRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  threshDot: { width: 6, height: 6, borderRadius: 3 },
  threshLabel: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1 },
  threshValue: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  chartSection: {
    borderTopWidth: 1,
    paddingTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 18,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  chartTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  chartSubtitle: { fontSize: 11, fontFamily: "Inter_400Regular" },
  chartContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 4,
  },
  yLabels: {
    justifyContent: "space-between",
    paddingVertical: 4,
    width: 28,
  },
  yLabel: { fontSize: 9, fontFamily: "Inter_400Regular", textAlign: "right" },
});
