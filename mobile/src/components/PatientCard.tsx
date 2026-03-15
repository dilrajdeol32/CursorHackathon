import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { StatusChip } from "./StatusChip";
import { colors, radius } from "../theme";

export interface Patient {
  id: string;
  name: string;
  room: string;
  activeTask: string;
  status: "normal" | "interrupted" | "high-risk";
  checkpointTime: string;
  allergy?: string;
}

interface PatientCardProps {
  patient: Patient;
  onPress?: () => void;
}

export function PatientCard({ patient, onPress }: PatientCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.name}>{patient.name}</Text>
          <Text style={styles.room}>{patient.room}</Text>
        </View>
        <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
      </View>
      <Text style={styles.task}>Active Task: {patient.activeTask}</Text>
      <View style={styles.bottomRow}>
        <StatusChip status={patient.status} />
        <View style={styles.timeRow}>
          <Feather name="clock" size={14} color={colors.mutedForeground} />
          <Text style={styles.timeText}>{patient.checkpointTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  name: { fontSize: 18, fontWeight: "600", color: colors.foreground },
  room: { fontSize: 14, color: colors.mutedForeground, marginTop: 2 },
  task: { fontSize: 14, color: colors.foreground, opacity: 0.8, marginBottom: 12 },
  bottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  timeText: { fontSize: 13, color: colors.mutedForeground },
});
