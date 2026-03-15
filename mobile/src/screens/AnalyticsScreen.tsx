import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  PanResponder,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { colors, radius } from "../theme";

const screenWidth = Dimensions.get("window").width - 40;
const chartWidth = screenWidth - 40;

const CHART_PADDING_RIGHT = 64;
const CHART_PADDING_TOP = 16;
const CHART_DATA_HEIGHT_PCT = 0.75;
const BAR_ACTUAL_WIDTH = 32 * 0.6; // barWidth * barPercentage

const chartConfig = {
  backgroundGradientFrom: colors.card,
  backgroundGradientTo: colors.card,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(74, 144, 217, ${opacity})`,
  labelColor: () => colors.mutedForeground,
  propsForBackgroundLines: { strokeDasharray: "3 3", stroke: colors.muted },
  barPercentage: 0.6,
  fillShadowGradientOpacity: 1,
  fillShadowGradientFromOpacity: 1,
  fillShadowGradientToOpacity: 1,
};

const interruptionsByHour = {
  labels: [
    "06", "07", "08", "09", "10", "11",
    "12", "13", "14", "15", "16", "17",
  ],
  datasets: [{ data: [2, 5, 8, 6, 4, 3, 7, 5, 4, 3, 6, 4] }],
};

const resumeDelayData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      data: [5.2, 7.1, 4.8, 6.3, 8.5, 4.0, 3.8],
      color: () => colors.warning,
      strokeWidth: 2,
    },
  ],
};

const pieData = [
  { name: "Bed Alarm", count: 28, color: colors.chart1, legendFontColor: colors.mutedForeground, legendFontSize: 12 },
  { name: "Phone Call", count: 22, color: colors.chart2, legendFontColor: colors.mutedForeground, legendFontSize: 12 },
  { name: "Code Alert", count: 15, color: colors.chart3, legendFontColor: colors.mutedForeground, legendFontSize: 12 },
  { name: "Patient Req", count: 20, color: colors.chart4, legendFontColor: colors.mutedForeground, legendFontSize: 12 },
  { name: "Other", count: 15, color: colors.chart5, legendFontColor: colors.mutedForeground, legendFontSize: 12 },
];

const taskBars = {
  labels: ["Meds", "Chart", "Wound", "IV", "Vitals"],
  datasets: [{ data: [18, 12, 8, 6, 4] }],
};

// --- Scrub overlay -----------------------------------------------------------

type ScrubInfo = { index: number; x: number } | null;

function getSnappedBar(touchX: number, numBars: number) {
  const dataWidth = chartWidth - CHART_PADDING_RIGHT;
  const slotWidth = dataWidth / numBars;
  const idx = Math.floor((touchX - CHART_PADDING_RIGHT) / slotWidth);
  const clamped = Math.max(0, Math.min(numBars - 1, idx));
  const snappedX =
    CHART_PADDING_RIGHT +
    clamped * slotWidth +
    BAR_ACTUAL_WIDTH;
  return { index: clamped, x: snappedX };
}

function getSnappedLine(touchX: number, numPoints: number) {
  const dataWidth = chartWidth - CHART_PADDING_RIGHT;
  const spacing = dataWidth / (numPoints - 1);
  const idx = Math.round((touchX - CHART_PADDING_RIGHT) / spacing);
  const clamped = Math.max(0, Math.min(numPoints - 1, idx));
  const snappedX = CHART_PADDING_RIGHT + clamped * spacing;
  return { index: clamped, x: snappedX };
}

interface ScrubOverlayProps {
  chartHeight: number;
  labels: string[];
  values: number[];
  mode: "bar" | "line";
  accentColor: string;
  formatValue: (label: string, value: number) => string;
  onScrubStart: () => void;
  onScrubEnd: () => void;
}

function ScrubOverlay({
  chartHeight,
  labels,
  values,
  mode,
  accentColor,
  formatValue,
  onScrubStart,
  onScrubEnd,
}: ScrubOverlayProps) {
  const [scrub, setScrub] = useState<ScrubInfo>(null);

  const snap = (locX: number) =>
    mode === "bar"
      ? getSnappedBar(locX, labels.length)
      : getSnappedLine(locX, labels.length);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant(e) {
        onScrubStart();
        setScrub(snap(e.nativeEvent.locationX));
      },
      onPanResponderMove(e) {
        setScrub(snap(e.nativeEvent.locationX));
      },
      onPanResponderRelease() {
        onScrubEnd();
        setScrub(null);
      },
      onPanResponderTerminate() {
        onScrubEnd();
        setScrub(null);
      },
    })
  ).current;

  const lineTop = CHART_PADDING_TOP;
  const lineHeight = chartHeight * CHART_DATA_HEIGHT_PCT;
  const tooltipWidth = 130;

  const tooltipLeft = scrub
    ? Math.max(0, Math.min(chartWidth - tooltipWidth, scrub.x - tooltipWidth / 2))
    : 0;

  return (
    <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers}>
      {scrub && (
        <>
          {/* Vertical indicator line */}
          <View
            style={{
              position: "absolute",
              left: scrub.x,
              top: lineTop,
              width: 1.5,
              height: lineHeight,
              backgroundColor: accentColor,
              borderRadius: 1,
            }}
          />

          {/* Dot at snap position */}
          <View
            style={{
              position: "absolute",
              left: scrub.x - 5,
              top: lineTop - 5,
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: accentColor,
            }}
          />

          {/* Tooltip */}
          <View
            style={[
              s.scrubTooltip,
              {
                left: tooltipLeft,
                top: Math.max(0, lineTop - 36),
                backgroundColor: accentColor,
              },
            ]}
          >
            <Text style={s.scrubTooltipText} numberOfLines={1}>
              {formatValue(labels[scrub.index], values[scrub.index])}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

// --- Stat card ---------------------------------------------------------------

function StatCard({ value, label, valueColor }: { value: string; label: string; valueColor: string }) {
  return (
    <View style={s.statCard}>
      <Text style={[s.statValue, { color: valueColor }]}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

// --- Screen ------------------------------------------------------------------

const CHART_HEIGHT = 200;

export function AnalyticsScreen() {
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const onScrubStart = () => setScrollEnabled(false);
  const onScrubEnd = () => setScrollEnabled(true);

  const taskChartConfig = useMemo(
    () => ({
      ...chartConfig,
      color: (opacity = 1) => `rgba(91, 168, 160, ${opacity})`,
    }),
    []
  );

  const lineChartConfig = useMemo(
    () => ({
      ...chartConfig,
      decimalPlaces: 1,
      color: (opacity = 1) => `rgba(229, 168, 77, ${opacity})`,
      fillShadowGradientOpacity: 0,
      fillShadowGradientFromOpacity: 0,
      fillShadowGradientToOpacity: 0,
    }),
    []
  );

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.scroll}
        scrollEnabled={scrollEnabled}
      >
        <Text style={s.title}>Analytics</Text>
        <Text style={s.subtitle}>This week's overview</Text>

        <View style={s.statsRow}>
          <StatCard value="47" label="Total Interruptions" valueColor={colors.primary} />
          <StatCard value="5.7m" label="Avg Resume Delay" valueColor={colors.secondary} />
          <StatCard value="12%" label="High Risk Rate" valueColor={colors.warning} />
          <StatCard value="94%" label="Safe Resumes" valueColor={colors.success} />
        </View>

        {/* Interruptions by Hour */}
        <View style={s.chartCard}>
          <Text style={s.chartTitle}>Interruptions by Hour</Text>
          <View style={{ position: "relative" }}>
            <BarChart
              data={interruptionsByHour}
              width={chartWidth}
              height={CHART_HEIGHT}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              style={s.chart}
              fromZero
              showBarTops={false}
            />
            <ScrubOverlay
              chartHeight={CHART_HEIGHT}
              labels={interruptionsByHour.labels}
              values={interruptionsByHour.datasets[0].data}
              mode="bar"
              accentColor={colors.primary}
              formatValue={(l, v) => `${l}:00 · ${v}`}
              onScrubStart={onScrubStart}
              onScrubEnd={onScrubEnd}
            />
          </View>
        </View>

        {/* Interruptions by Source */}
        <View style={s.chartCard}>
          <Text style={s.chartTitle}>Interruptions by Source</Text>
          <PieChart
            data={pieData}
            width={chartWidth}
            height={200}
            chartConfig={chartConfig}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute={false}
          />
        </View>

        {/* Most Interrupted Tasks */}
        <View style={s.chartCard}>
          <Text style={s.chartTitle}>Most Interrupted Tasks</Text>
          <View style={{ position: "relative" }}>
            <BarChart
              data={taskBars}
              width={chartWidth}
              height={CHART_HEIGHT}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={taskChartConfig}
              style={s.chart}
              fromZero
              showBarTops={false}
            />
            <ScrubOverlay
              chartHeight={CHART_HEIGHT}
              labels={taskBars.labels}
              values={taskBars.datasets[0].data}
              mode="bar"
              accentColor={colors.secondary}
              formatValue={(l, v) => `${l} · ${v}`}
              onScrubStart={onScrubStart}
              onScrubEnd={onScrubEnd}
            />
          </View>
        </View>

        {/* Average Resume Delay */}
        <View style={s.chartCard}>
          <Text style={s.chartTitle}>Avg Resume Delay (min)</Text>
          <View style={{ position: "relative" }}>
            <LineChart
              data={resumeDelayData}
              width={chartWidth}
              height={CHART_HEIGHT}
              chartConfig={lineChartConfig}
              style={s.chart}
              bezier
              getDotColor={() => colors.warning}
            />
            <ScrubOverlay
              chartHeight={CHART_HEIGHT}
              labels={resumeDelayData.labels}
              values={resumeDelayData.datasets[0].data}
              mode="line"
              accentColor={colors.warning}
              formatValue={(l, v) => `${l} · ${v.toFixed(1)}m`}
              onScrubStart={onScrubStart}
              onScrubEnd={onScrubEnd}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ------------------------------------------------------------------

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: "600", color: colors.foreground, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.mutedForeground, marginBottom: 20 },
  statsRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  statCard: {
    width: "47%",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  statValue: { fontSize: 30 },
  statLabel: { fontSize: 12, color: colors.mutedForeground, marginTop: 4, textAlign: "center" },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  chartTitle: { fontSize: 18, fontWeight: "600", color: colors.foreground, marginBottom: 16 },
  chart: { borderRadius: 8 },
  scrubTooltip: {
    position: "absolute",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 70,
    alignItems: "center",
  },
  scrubTooltipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
});
