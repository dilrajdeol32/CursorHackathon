import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootStack";
import { ExpandableCard } from "../components/ExpandableCard";
import { StatusChip } from "../components/StatusChip";
import { useSession } from "../context/SessionContext";
import { colors, radius } from "../theme";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, "PatientContext">;

const patientData: Record<string, any> = {
  "1": {
    name: "Mr. Patel", room: "Room 204", allergy: "Penicillin", status: "interrupted", hasCheckpoint: true,
    currentTask: { title: "Metoprolol Administration", details: "25mg oral, scheduled for 08:00", status: "Interrupted — Bed alarm in Room 206" },
    medication: { name: "Metoprolol Tartrate", dose: "25mg", route: "Oral", frequency: "Twice daily", lastGiven: "Yesterday 20:00" },
    vitals: { bp: "138/82 mmHg", hr: "76 bpm", temp: "37.1°C", spo2: "97%", time: "07:45" },
    checkpoints: 1, notes: "Patient reports mild dizziness this morning. Monitor BP closely.",
  },
  "2": {
    name: "Mrs. Johnson", room: "Room 208", allergy: null, status: "normal", hasCheckpoint: false,
    currentTask: { title: "IV Fluid Check", details: "Normal Saline 1000ml at 125ml/hr", status: "In Progress" },
    medication: { name: "Normal Saline", dose: "1000ml", route: "IV", frequency: "Continuous", lastGiven: "Running" },
    vitals: { bp: "120/78 mmHg", hr: "68 bpm", temp: "36.8°C", spo2: "99%", time: "07:30" },
    checkpoints: 0, notes: "Stable. Scheduled for discharge assessment at 14:00.",
  },
  "3": {
    name: "Mr. Garcia", room: "Room 211", allergy: "Latex", status: "high-risk", hasCheckpoint: true,
    currentTask: { title: "Wound Dressing Change", details: "Surgical site, left knee", status: "Interrupted — Code Blue nearby" },
    medication: { name: "Cefazolin", dose: "1g", route: "IV", frequency: "Q8h", lastGiven: "06:00" },
    vitals: { bp: "145/90 mmHg", hr: "88 bpm", temp: "37.8°C", spo2: "95%", time: "07:15" },
    checkpoints: 2, notes: "Elevated temp, possible infection. Wound culture pending.",
  },
};

function VitalRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.vitalRow}>
      <Text style={s.vitalLabel}>{label}</Text>
      <Text style={s.vitalValue}>{value}</Text>
    </View>
  );
}

export function PatientContextScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const id = route.params?.id || "1";
  const patient = patientData[id] || patientData["1"];
  const { activePatientId, completedTaskIds } = useSession();

  const isInSession = activePatientId === id;
  const isCompleted = completedTaskIds.includes(id);
  const displayStatus = isInSession ? "in-session" : isCompleted ? "completed" : patient.status;
  const taskStatusText = isCompleted
    ? "Completed ✓"
    : isInSession
    ? "In Session — Currently Active"
    : patient.currentTask.status;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={colors.primary} />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>

        <View style={s.headerRow}>
          <View>
            <Text style={s.name}>{patient.name}</Text>
            <Text style={s.room}>{patient.room}</Text>
          </View>
          <StatusChip status={displayStatus} />
        </View>

        {patient.allergy && (
          <View style={s.allergyBanner}>
            <Feather name="alert-triangle" size={16} color={colors.statusHighRiskText} />
            <Text style={s.allergyText}>Allergy: {patient.allergy}</Text>
          </View>
        )}

        <View style={{ gap: 16, marginTop: 16 }}>
          <ExpandableCard title="Current Task" icon={<Feather name="check-square" size={20} color={colors.primary} />} defaultExpanded>
            <Text style={s.fieldValue}>{patient.currentTask.title}</Text>
            <Text style={s.fieldMuted}>{patient.currentTask.details}</Text>
            <Text style={{ color: isCompleted ? colors.success : isInSession ? colors.primary : colors.warning, marginTop: 4 }}>{taskStatusText}</Text>
          </ExpandableCard>

          <ExpandableCard title="Medication Context" icon={<Feather name="disc" size={20} color={colors.primary} />}>
            <VitalRow label="Medication" value={patient.medication.name} />
            <VitalRow label="Dose" value={patient.medication.dose} />
            <VitalRow label="Route" value={patient.medication.route} />
            <VitalRow label="Frequency" value={patient.medication.frequency} />
            <VitalRow label="Last Given" value={patient.medication.lastGiven} />
          </ExpandableCard>

          <ExpandableCard title="Recent Vitals" icon={<Feather name="activity" size={20} color={colors.primary} />}>
            <VitalRow label="Blood Pressure" value={patient.vitals.bp} />
            <VitalRow label="Heart Rate" value={patient.vitals.hr} />
            <VitalRow label="Temperature" value={patient.vitals.temp} />
            <VitalRow label="SpO2" value={patient.vitals.spo2} />
            <Text style={[s.fieldMuted, { marginTop: 8 }]}>Recorded at {patient.vitals.time}</Text>
          </ExpandableCard>

          <ExpandableCard title={`Open Checkpoints (${patient.checkpoints})`} icon={<Feather name="bookmark" size={20} color={colors.primary} />}>
            <Text style={patient.checkpoints > 0 ? s.fieldValue : s.fieldMuted}>
              {patient.checkpoints > 0 ? `${patient.checkpoints} checkpoint${patient.checkpoints > 1 ? "s" : ""} saved. Tap Resume Task to restore context.` : "No open checkpoints."}
            </Text>
          </ExpandableCard>

          <ExpandableCard title="Notes" icon={<Feather name="file-text" size={20} color={colors.primary} />}>
            <Text style={s.fieldValue}>{patient.notes}</Text>
          </ExpandableCard>
        </View>
      </ScrollView>

      <View style={s.bottomBar}>
        {isCompleted ? (
          <View style={[s.actionBtn, { backgroundColor: colors.success }]}>
            <Text style={s.actionBtnText}>Task Completed ✓</Text>
          </View>
        ) : patient.hasCheckpoint ? (
          <TouchableOpacity style={[s.actionBtn, { backgroundColor: colors.secondary }]} onPress={() => navigation.navigate("ResumeTask", { id })} activeOpacity={0.8}>
            <Text style={s.actionBtnText}>Resume Task</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[s.actionBtn, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate("CaptureWithId", { id })} activeOpacity={0.8}>
            <Text style={s.actionBtnText}>Create Checkpoint</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 120 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  backText: { fontSize: 16, color: colors.primary },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  name: { fontSize: 24, fontWeight: "600", color: colors.foreground },
  room: { fontSize: 14, color: colors.mutedForeground, marginTop: 2 },
  allergyBanner: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.statusHighRiskBg, padding: 12, borderRadius: radius.md, marginTop: 12 },
  allergyText: { color: colors.statusHighRiskText, fontSize: 14 },
  fieldValue: { fontSize: 15, color: colors.foreground },
  fieldMuted: { fontSize: 14, color: colors.mutedForeground, marginTop: 2 },
  vitalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  vitalLabel: { fontSize: 14, color: colors.mutedForeground },
  vitalValue: { fontSize: 14, color: colors.foreground },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 36, backgroundColor: colors.background },
  actionBtn: { paddingVertical: 16, borderRadius: radius.lg, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  actionBtnText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});
