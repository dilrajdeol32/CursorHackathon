import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";
import { colors, radius } from "../theme";
import { ScrubbableLineChart } from "../components/ScrubbableLineChart";
import { CustomBarChart } from "../components/CustomBarChart";

// ─── Layout constants ─────────────────────────────────────────────────────────
const SCREEN_PAD = 20;
const CARD_PAD = 20;
const CHART_W = Dimensions.get("window").width - SCREEN_PAD * 2 - CARD_PAD * 2;

// ─── Mock data ────────────────────────────────────────────────────────────────
const interruptionsByHour = {
  labels: ["06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17"],
  datasets: [{ data: [2, 5, 8, 6, 4, 3, 7, 5, 4, 3, 6, 4] }],
};

const resumeDelayData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      data: [5.2, 7.1, 4.8, 6.3, 8.5, 4.0, 3.8],
      color: () => colors.warning,
      strokeWidth: 2.5,
    },
  ],
};

const checkpointScoreData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      data: [82, 78, 85, 91, 88, 93, 96],
      color: () => colors.success,
      strokeWidth: 2.5,
    },
  ],
};

const taskBars = {
  labels: ["Meds", "Chart", "Wound", "IV", "Vitals"],
  datasets: [{ data: [18, 12, 8, 6, 4] }],
};

const pieData = [
  { name: "Bed Alarm",   count: 28, color: colors.chart1, legendFontColor: colors.mutedForeground, legendFontSize: 12 },
  { name: "Phone Call",  count: 22, color: colors.chart2, legendFontColor: colors.mutedForeground, legendFontSize: 12 },
  { name: "Code Alert",  count: 15, color: colors.chart3, legendFontColor: colors.mutedForeground, legendFontSize: 12 },
  { name: "Patient Req", count: 20, color: colors.chart4, legendFontColor: colors.mutedForeground, legendFontSize: 12 },
  { name: "Other",       count: 15, color: colors.chart5, legendFontColor: colors.mutedForeground, legendFontSize: 12 },
];
const PIE_TOTAL = pieData.reduce((s, d) => s + d.count, 0);

const riskRows = [
  { label: "Low Risk",    count: 28, total: 50, color: colors.success,     bg: "#E8F5E9" },
  { label: "Medium Risk", count: 14, total: 50, color: colors.warning,     bg: "#FFF3E0" },
  { label: "High Risk",   count:  8, total: 50, color: colors.destructive, bg: "#FFEBEE" },
];

// ─── Base chart config ────────────────────────────────────────────────────────
const BASE_CFG = {
  backgroundGradientFrom: colors.card,
  backgroundGradientTo: colors.card,
  decimalCount: 0,
  labelColor: () => colors.mutedForeground,
  propsForBackgroundLines: { strokeDasharray: "4 4", stroke: colors.border },
};

// ─── Stat card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  value: string;
  label: string;
  trend: string;
  trendUp: boolean | null;
  icon: React.ComponentProps<typeof Feather>["name"];
  color: string;
  bg: string;
}

function StatCard({ value, label, trend, trendUp, icon, color, bg }: StatCardProps) {
  const trendColor =
    trendUp === null ? colors.mutedForeground : trendUp ? colors.success : colors.destructive;
  const trendBg =
    trendUp === null ? colors.muted : trendUp ? "#E8F5E9" : "#FFEBEE";

  return (
    <View style={[s.statCard, { borderLeftColor: color }]}>
      <View style={s.statTop}>
        <View style={[s.iconBg, { backgroundColor: bg }]}>
          <Feather name={icon} size={15} color={color} />
        </View>
        <View style={[s.trendBadge, { backgroundColor: trendBg }]}>
          {trendUp !== null && (
            <Feather
              name={trendUp ? "trending-up" : "trending-down"}
              size={10}
              color={trendColor}
            />
          )}
          <Text style={[s.trendTxt, { color: trendColor }]}>{trend}</Text>
        </View>
      </View>
      <Text style={[s.statVal, { color }]}>{value}</Text>
      <Text style={s.statLbl}>{label}</Text>
    </View>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={s.card}>
      <Text style={s.cardTitle}>{title}</Text>
      {subtitle ? <Text style={s.cardSub}>{subtitle}</Text> : null}
      <View style={{ marginTop: 16 }}>{children}</View>
    </View>
  );
}

// ─── Period pills ─────────────────────────────────────────────────────────────
const PERIODS = ["Today", "Week", "Month"] as const;

// ─── Main screen ──────────────────────────────────────────────────────────────
export function AnalyticsScreen() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Week");

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} scrollEventThrottle={16}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View>
            <Text style={s.title}>Analytics</Text>
            <View style={s.dateRow}>
              <Feather name="calendar" size={13} color={colors.mutedForeground} />
              <Text style={s.dateText}>Mar 10 – 16, 2026</Text>
            </View>
          </View>
          <View style={s.pillStrip}>
            {PERIODS.map((p) => (
              <TouchableOpacity
                key={p}
                style={[s.pill, period === p && s.pillActive]}
                onPress={() => setPeriod(p)}
                activeOpacity={0.7}
              >
                <Text style={[s.pillTxt, period === p && s.pillTxtActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── KPI cards ── */}
        <View style={s.kpiGrid}>
          <StatCard
            value="47"
            label="Total Interruptions"
            trend="+3"
            trendUp={false}
            icon="activity"
            color={colors.primary}
            bg="#4A90D915"
          />
          <StatCard
            value="5.7m"
            label="Avg Resume Delay"
            trend="−0.5m"
            trendUp={true}
            icon="clock"
            color={colors.secondary}
            bg="#5BA8A015"
          />
          <StatCard
            value="12%"
            label="High Risk Rate"
            trend="→ stable"
            trendUp={null}
            icon="alert-triangle"
            color={colors.warning}
            bg="#E5A84D15"
          />
          <StatCard
            value="94%"
            label="Safe Resumes"
            trend="+2%"
            trendUp={true}
            icon="shield"
            color={colors.success}
            bg="#4CAF7D15"
          />
        </View>

        {/* ── Interruptions by Hour ── */}
        <Section
          title="Interruptions by Hour"
          subtitle="Tap or drag a bar to inspect"
        >
          <CustomBarChart
            data={interruptionsByHour}
            width={CHART_W}
            height={230}
            barColor={colors.primary}
            highlightColor={colors.primary}
          />
        </Section>

        {/* ── Avg Resume Delay line chart ── */}
        <Section
          title="Avg Resume Delay"
          subtitle="Minutes — drag to trace the trend"
        >
          <ScrubbableLineChart
            data={resumeDelayData}
            width={CHART_W}
            height={200}
            chartConfig={{
              ...BASE_CFG,
              color: (opacity = 1) => `rgba(229, 168, 77, ${opacity})`,
            }}
            yAxisSuffix="m"
            bezier
            withShadow={false}
          />
        </Section>

        {/* ── Interruptions by Source ── */}
        <Section
          title="Interruptions by Source"
          subtitle="What pulls nurses away most often"
        >
          <PieChart
            data={pieData}
            width={CHART_W}
            height={190}
            chartConfig={BASE_CFG}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="12"
            hasLegend={false}
            absolute={false}
          />
          {/* Custom 2-column legend */}
          <View style={s.legendGrid}>
            {pieData.map((item) => {
              const pct = Math.round((item.count / PIE_TOTAL) * 100);
              return (
                <View key={item.name} style={s.legendItem}>
                  <View style={[s.legendDot, { backgroundColor: item.color }]} />
                  <Text style={s.legendName}>{item.name}</Text>
                  <Text style={[s.legendPct, { color: item.color }]}>{pct}%</Text>
                </View>
              );
            })}
          </View>
        </Section>

        {/* ── Most Interrupted Tasks ── */}
        <Section
          title="Most Interrupted Tasks"
          subtitle="Where focus breaks most often"
        >
          <CustomBarChart
            data={taskBars}
            width={CHART_W}
            height={200}
            barColor={colors.secondary}
            highlightColor={colors.secondary}
          />
        </Section>

        {/* ── Patient Risk Overview ── */}
        <Section
          title="Patient Risk Overview"
          subtitle="Current risk distribution across 50 patients"
        >
          {riskRows.map(({ label, count, total, color, bg }) => {
            const pct = count / total;
            return (
              <View key={label} style={s.riskRow}>
                <View style={s.riskMeta}>
                  <View style={s.riskLeft}>
                    <View style={[s.riskDot, { backgroundColor: color }]} />
                    <Text style={s.riskLabel}>{label}</Text>
                  </View>
                  <Text style={[s.riskCount, { color }]}>
                    {count} / {total}
                  </Text>
                </View>
                <View style={[s.riskTrack, { backgroundColor: bg }]}>
                  <View
                    style={[
                      s.riskFill,
                      { width: `${pct * 100}%`, backgroundColor: color },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </Section>

        {/* ── Checkpoint Quality Score ── */}
        <Section
          title="Checkpoint Quality Score"
          subtitle="AI-assessed quality out of 100 — drag to trace"
        >
          <ScrubbableLineChart
            data={checkpointScoreData}
            width={CHART_W}
            height={200}
            chartConfig={{
              ...BASE_CFG,
              color: (opacity = 1) => `rgba(76, 175, 125, ${opacity})`,
            }}
            bezier
            withShadow={false}
          />
        </Section>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: SCREEN_PAD, paddingBottom: 110 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: { fontSize: 26, fontWeight: "700", color: colors.foreground },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 },
  dateText: { fontSize: 13, color: colors.mutedForeground },

  // Period pills
  pillStrip: {
    flexDirection: "row",
    backgroundColor: colors.muted,
    borderRadius: radius.full,
    padding: 3,
    gap: 2,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  pill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.full },
  pillActive: {
    backgroundColor: colors.card,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  pillTxt: { fontSize: 12, color: colors.mutedForeground, fontWeight: "500" },
  pillTxtActive: { color: colors.foreground, fontWeight: "600" },

  // KPI grid
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: "47.5%",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  statTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.full,
    gap: 3,
  },
  trendTxt: { fontSize: 10, fontWeight: "600" },
  statVal: { fontSize: 28, fontWeight: "700", marginBottom: 3 },
  statLbl: { fontSize: 11, color: colors.mutedForeground, lineHeight: 16 },

  // Section card
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: CARD_PAD,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardTitle: { fontSize: 17, fontWeight: "600", color: colors.foreground },
  cardSub: { fontSize: 12, color: colors.mutedForeground, marginTop: 3 },

  // Pie legend
  legendGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "47%",
    gap: 6,
  },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendName: { flex: 1, fontSize: 12, color: colors.mutedForeground },
  legendPct: { fontSize: 12, fontWeight: "700" },

  // Risk rows
  riskRow: { marginBottom: 14 },
  riskMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  riskLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  riskDot: { width: 8, height: 8, borderRadius: 4 },
  riskLabel: { fontSize: 13, color: colors.foreground, fontWeight: "500" },
  riskCount: { fontSize: 12, fontWeight: "600" },
  riskTrack: {
    height: 9,
    borderRadius: 5,
    overflow: "hidden",
  },
  riskFill: { height: 9, borderRadius: 5 },
});
