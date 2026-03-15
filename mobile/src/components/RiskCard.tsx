import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, radius } from "../theme";

interface RiskCardProps {
  level: "Low" | "Medium" | "High";
  details: string[];
}

const levelColors = {
  Low: { bg: colors.statusNormalBg, text: colors.statusNormalText, border: colors.success },
  Medium: { bg: colors.statusInterruptedBg, text: colors.statusInterruptedText, border: colors.warning },
  High: { bg: colors.statusHighRiskBg, text: colors.statusHighRiskText, border: colors.destructive },
};

export function RiskCard({ level, details }: RiskCardProps) {
  const c = levelColors[level];
  return (
    <View style={[styles.card, { backgroundColor: c.bg, borderColor: c.border }]}>
      <View style={styles.header}>
        <Feather name="shield" size={22} color={c.text} />
        <Text style={[styles.title, { color: c.text }]}>Risk Level: {level}</Text>
      </View>
      {details.map((d, i) => (
        <Text key={i} style={[styles.detail, { color: c.text }]}>
          {"\u2022"} {d}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: 20, borderWidth: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: "600" },
  detail: { fontSize: 14, opacity: 0.8, marginBottom: 4, paddingLeft: 4 },
});
