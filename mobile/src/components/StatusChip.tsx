import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme";

type ChipStatus = "normal" | "interrupted" | "high-risk";

const statusConfig: Record<ChipStatus, { bg: string; text: string; label: string }> = {
  normal: { bg: colors.statusNormalBg, text: colors.statusNormalText, label: "Normal" },
  interrupted: { bg: colors.statusInterruptedBg, text: colors.statusInterruptedText, label: "Interrupted" },
  "high-risk": { bg: colors.statusHighRiskBg, text: colors.statusHighRiskText, label: "High Risk" },
};

interface StatusChipProps {
  status: ChipStatus;
  label?: string;
}

export function StatusChip({ status, label }: StatusChipProps) {
  const config = statusConfig[status];
  return (
    <View style={[styles.chip, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.text }]} />
      <Text style={[styles.label, { color: config.text }]}>{label || config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8, opacity: 0.7 },
  label: { fontSize: 13, fontWeight: "500" },
});
