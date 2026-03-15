import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../theme";

interface ValidationFieldProps {
  label: string;
  value: string;
  status: "confirmed" | "uncertain";
}

export function ValidationField({ label, value, status }: ValidationFieldProps) {
  const isConfirmed = status === "confirmed";
  const iconColor = isConfirmed ? colors.success : colors.warning;
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.statusRow}>
        <Feather
          name={isConfirmed ? "check-circle" : "alert-triangle"}
          size={18}
          color={iconColor}
        />
        <Text style={[styles.statusText, { color: iconColor }]}>
          {isConfirmed ? "Confirmed" : "Uncertain"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { fontSize: 13, color: colors.mutedForeground },
  value: { fontSize: 15, color: colors.foreground, marginTop: 2 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusText: { fontSize: 13 },
});
