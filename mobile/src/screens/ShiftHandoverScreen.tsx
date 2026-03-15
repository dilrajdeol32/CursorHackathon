import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ExpandableCard } from "../components/ExpandableCard";
import { colors, radius } from "../theme";

const handoverPatients = [
  {
    name: "Mr. Patel", room: "Room 204", unresolvedCheckpoints: 1,
    incompleteTasks: "Metoprolol administration interrupted",
    medicationEvents: "Metoprolol 25mg pending",
    notes: "Mild dizziness reported. Monitor BP.",
    aiSummary: "Patient had one interrupted medication event. Metoprolol 25mg was not administered due to bed alarm interruption. Recommend re-verification before continuing. BP slightly elevated.",
  },
  {
    name: "Mr. Garcia", room: "Room 211", unresolvedCheckpoints: 2,
    incompleteTasks: "Wound dressing change interrupted",
    medicationEvents: "Cefazolin 1g IV given at 06:00",
    notes: "Elevated temp 37.8°C. Wound culture pending.",
    aiSummary: "High-risk patient with two unresolved checkpoints. Wound dressing was interrupted by Code Blue. Temperature trending up, possible surgical site infection. Cefazolin on schedule. Prioritize wound assessment.",
  },
  {
    name: "Mr. Thompson", room: "Room 219", unresolvedCheckpoints: 1,
    incompleteTasks: "Insulin administration interrupted",
    medicationEvents: "Blood glucose 186 mg/dL at 07:00",
    notes: "Patient requested breakfast early.",
    aiSummary: "Insulin dose interrupted. Blood glucose elevated at 186. Patient was requesting food which may have contributed to timing issue. Recommend glucose recheck before insulin administration.",
  },
];

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue}>{String(value)}</Text>
    </View>
  );
}

export function ShiftHandoverScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={colors.primary} />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={s.pageTitle}>Shift Handover</Text>

        <View style={s.nurseCard}>
          <View style={s.nurseRow}>
            <View style={[s.nurseAvatar, { backgroundColor: "#4A90D91A" }]}>
              <Feather name="user" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.nurseName}>Sarah Mitchell</Text>
              <Text style={s.nurseRole}>Outgoing — Day Shift</Text>
            </View>
            <View style={s.timeRow}>
              <Feather name="clock" size={14} color={colors.mutedForeground} />
              <Text style={s.timeText}>19:00</Text>
            </View>
          </View>
          <View style={s.divider} />
          <View style={s.nurseRow}>
            <View style={[s.nurseAvatar, { backgroundColor: "#5BA8A01A" }]}>
              <Feather name="user" size={20} color={colors.secondary} />
            </View>
            <View>
              <Text style={s.nurseName}>James Rivera</Text>
              <Text style={s.nurseRole}>Incoming — Night Shift</Text>
            </View>
          </View>
        </View>

        <View style={s.summaryRow}>
          <View style={[s.summaryBox, { backgroundColor: colors.statusInterruptedBg }]}>
            <Text style={[s.summaryNum, { color: colors.statusInterruptedText }]}>4</Text>
            <Text style={[s.summaryLabel, { color: colors.statusInterruptedText }]}>Checkpoints</Text>
          </View>
          <View style={[s.summaryBox, { backgroundColor: colors.statusHighRiskBg }]}>
            <Text style={[s.summaryNum, { color: colors.statusHighRiskText }]}>3</Text>
            <Text style={[s.summaryLabel, { color: colors.statusHighRiskText }]}>Incomplete</Text>
          </View>
          <View style={[s.summaryBox, { backgroundColor: colors.statusNormalBg }]}>
            <Text style={[s.summaryNum, { color: colors.statusNormalText }]}>3</Text>
            <Text style={[s.summaryLabel, { color: colors.statusNormalText }]}>Stable</Text>
          </View>
        </View>

        <View style={{ gap: 16 }}>
          {handoverPatients.map((p) => (
            <ExpandableCard key={p.name} title={`${p.name} — ${p.room}`}>
              <InfoRow label="Unresolved Checkpoints" value={p.unresolvedCheckpoints} />
              <InfoRow label="Incomplete Tasks" value={p.incompleteTasks} />
              <InfoRow label="Medication Events" value={p.medicationEvents} />
              <InfoRow label="Notes" value={p.notes} />
              <View style={s.aiBox}>
                <Text style={s.aiLabel}>AI Summary</Text>
                <Text style={s.aiText}>{p.aiSummary}</Text>
              </View>
            </ExpandableCard>
          ))}
        </View>
      </ScrollView>

      <View style={s.bottomBar}>
        <TouchableOpacity style={s.approveBtn} activeOpacity={0.8}>
          <Feather name="check-circle" size={20} color="#FFF" />
          <Text style={s.approveBtnText}>Approve Handover</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 120 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 20 },
  backText: { fontSize: 16, color: colors.primary },
  pageTitle: { fontSize: 24, fontWeight: "600", color: colors.foreground, marginBottom: 20 },
  nurseCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  nurseRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  nurseAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  nurseName: { fontSize: 15, color: colors.foreground, fontWeight: "500" },
  nurseRole: { fontSize: 13, color: colors.mutedForeground },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  timeText: { fontSize: 13, color: colors.mutedForeground },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  summaryRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  summaryBox: { flex: 1, borderRadius: radius.md, padding: 12, alignItems: "center" },
  summaryNum: { fontSize: 24, fontWeight: "600" },
  summaryLabel: { fontSize: 12 },
  infoLabel: { fontSize: 13, color: colors.mutedForeground, marginBottom: 2 },
  infoValue: { fontSize: 15, color: colors.foreground },
  aiBox: { backgroundColor: "#4A90D90D", borderWidth: 1, borderColor: "#4A90D933", borderRadius: radius.md, padding: 16, marginTop: 4 },
  aiLabel: { fontSize: 14, color: colors.primary, fontWeight: "500", marginBottom: 4 },
  aiText: { fontSize: 14, color: colors.foreground, lineHeight: 20 },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 36, backgroundColor: colors.background },
  approveBtn: { flexDirection: "row", backgroundColor: colors.primary, paddingVertical: 16, borderRadius: radius.lg, alignItems: "center", justifyContent: "center", gap: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  approveBtnText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});
