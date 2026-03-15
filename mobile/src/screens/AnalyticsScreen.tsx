import React from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { colors, radius } from "../theme";

const screenWidth = Dimensions.get("window").width - 40;
const chartConfig = {
  backgroundGradientFrom: colors.card,
  backgroundGradientTo: colors.card,
  decimalCount: 0,
  color: (opacity = 1) => `rgba(74, 144, 217, ${opacity})`,
  labelColor: () => colors.mutedForeground,
  propsForBackgroundLines: { strokeDasharray: "3 3", stroke: colors.muted },
  barPercentage: 0.6,
};

const interruptionsByHour = {
  labels: ["06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17"],
  datasets: [{ data: [2, 5, 8, 6, 4, 3, 7, 5, 4, 3, 6, 4] }],
};

const resumeDelayData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [{ data: [5.2, 7.1, 4.8, 6.3, 8.5, 4.0, 3.8], color: () => colors.warning, strokeWidth: 2 }],
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

function StatCard({ value, label, valueColor }: { value: string; label: string; valueColor: string }) {
  return (
    <View style={s.statCard}>
      <Text style={[s.statValue, { color: valueColor }]}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

export function AnalyticsScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.title}>Analytics</Text>
        <Text style={s.subtitle}>This week's overview</Text>

        <View style={s.statsRow}>
          <StatCard value="47" label="Total Interruptions" valueColor={colors.primary} />
          <StatCard value="5.7m" label="Avg Resume Delay" valueColor={colors.secondary} />
          <StatCard value="12%" label="High Risk Rate" valueColor={colors.warning} />
          <StatCard value="94%" label="Safe Resumes" valueColor={colors.success} />
        </View>

        <View style={s.chartCard}>
          <Text style={s.chartTitle}>Interruptions by Hour</Text>
          <BarChart
            data={interruptionsByHour}
            width={screenWidth - 40}
            height={200}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            style={s.chart}
            fromZero
          />
        </View>

        <View style={s.chartCard}>
          <Text style={s.chartTitle}>Interruptions by Source</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 40}
            height={200}
            chartConfig={chartConfig}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute={false}
          />
        </View>

        <View style={s.chartCard}>
          <Text style={s.chartTitle}>Most Interrupted Tasks</Text>
          <BarChart
            data={taskBars}
            width={screenWidth - 40}
            height={200}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(91, 168, 160, ${opacity})` }}
            style={s.chart}
            fromZero
          />
        </View>

        <View style={s.chartCard}>
          <Text style={s.chartTitle}>Avg Resume Delay (min)</Text>
          <LineChart
            data={resumeDelayData}
            width={screenWidth - 40}
            height={200}
            chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(229, 168, 77, ${opacity})` }}
            style={s.chart}
            bezier
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: "600", color: colors.foreground, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.mutedForeground, marginBottom: 20 },
  statsRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  statCard: { width: "47%", backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.border, alignItems: "center" },
  statValue: { fontSize: 30 },
  statLabel: { fontSize: 12, color: colors.mutedForeground, marginTop: 4, textAlign: "center" },
  chartCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  chartTitle: { fontSize: 18, fontWeight: "600", color: colors.foreground, marginBottom: 16 },
  chart: { borderRadius: 8 },
});
