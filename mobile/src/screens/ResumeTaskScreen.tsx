import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootStack";
import { RiskCard } from "../components/RiskCard";
import { getCheckpoints, Checkpoint } from "../api/client";
import { useSession } from "../context/SessionContext";
import { colors, radius } from "../theme";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const patientNames: Record<string, string> = { "1": "Mr. Patel", "2": "Mrs. Johnson", "3": "Mr. Garcia", "4": "Ms. Chen", "5": "Mr. Thompson", "6": "Mrs. Williams" };
const patientRooms: Record<string, string> = { "1": "204", "2": "208", "3": "211", "4": "215", "5": "219", "6": "222" };

function SectionCard({ icon, iconBg, iconColor, title, children }: { icon: string; iconBg: string; iconColor: string; title: string; children: React.ReactNode }) {
  return (
    <View style={s.sectionCard}>
      <View style={s.sectionHeader}>
        <View style={[s.sectionIcon, { backgroundColor: iconBg }]}>
          <Feather name={icon as any} size={16} color={iconColor} />
        </View>
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
      <View style={{ marginLeft: 44 }}>{children}</View>
    </View>
  );
}

function getMinutesSince(isoDate: string): number {
  return Math.round((Date.now() - new Date(isoDate).getTime()) / 60000);
}

export function ResumeTaskScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const patientId = (route.params as any)?.id || "1";
  const { startSession, completeTask, recordMedication } = useSession();

  const [checkpoint, setCheckpoint] = useState<Checkpoint | null>(null);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    setLoading(true);
    setCheckpoint(null);
    (async () => {
      const { data } = await getCheckpoints();
      if (data && data.length > 0) {
        const match = data.find((c) => c.patient_id === patientId) ?? data[0];
        setCheckpoint(match);
      }
      setLoading(false);
    })();
  }, [patientId]);

  const name = patientNames[patientId] || "Patient";
  const room = patientRooms[patientId] || "—";

  const sd = checkpoint?.structured_data ?? {};
  const vs = checkpoint?.validation_status ?? {};
  const minutesAgo = checkpoint ? getMinutesSince(checkpoint.timestamp) : 0;

  const confirmedItems = Object.entries(vs).filter(([, v]) => v === "confirmed").map(([k]) => k);
  const uncertainItems = Object.entries(vs).filter(([, v]) => v === "uncertain" || v === "missing").map(([k]) => k);

  const riskLevel = checkpoint?.risk_score ?? "Medium";
  const riskDetails: string[] = [];
  if (sd.interruption_type) riskDetails.push(`Interrupted: ${sd.interruption_type}`);
  riskDetails.push(`${minutesAgo || "< 1"} minutes elapsed`);
  if (uncertainItems.length > 0) riskDetails.push(`${uncertainItems.length} field(s) uncertain`);

  const labelMap: Record<string, string> = {
    patient_name: "Patient identity verified",
    room_number: "Room number confirmed",
    medication: "Medication order confirmed",
    dosage: "Dosage verified",
    interruption_type: "Interruption type recorded",
  };

  if (loading) {
    return (
      <SafeAreaView style={[s.safe, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={colors.primary} />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>

        <View style={s.headerCard}>
          <Text style={s.headerTitle}>{name} — Room {room}</Text>
          <Text style={s.headerSub}>
            {checkpoint ? `Checkpoint saved ${minutesAgo || "< 1"} minutes ago` : "No checkpoint found"}
          </Text>
        </View>

        <SectionCard icon="arrow-right" iconBg="#4A90D91A" iconColor={colors.primary} title="What you were doing">
          <Text style={s.fieldValue}>{sd.medication ? "Medication administration" : "Task context"}</Text>
          {sd.medication && <Text style={s.fieldMuted}>{sd.medication} {sd.dosage ?? ""}</Text>}
        </SectionCard>

        {confirmedItems.length > 0 && (
          <SectionCard icon="check-circle" iconBg={colors.statusNormalBg} iconColor={colors.success} title="What is confirmed">
            <View style={{ gap: 8 }}>
              {confirmedItems.map((key) => (
                <View key={key} style={s.checkRow}>
                  <Feather name="check-circle" size={16} color={colors.success} />
                  <Text style={s.fieldValue}>{labelMap[key] ?? key}</Text>
                </View>
              ))}
            </View>
          </SectionCard>
        )}

        {uncertainItems.length > 0 && (
          <SectionCard icon="alert-triangle" iconBg={colors.statusInterruptedBg} iconColor={colors.warning} title="What is uncertain">
            <View style={{ gap: 8 }}>
              {uncertainItems.map((key) => (
                <View key={key} style={s.checkRow}>
                  <Feather name="alert-triangle" size={16} color={colors.warning} />
                  <Text style={{ color: colors.warning }}>{labelMap[key] ?? key} — needs verification</Text>
                </View>
              ))}
            </View>
          </SectionCard>
        )}

        <View style={{ marginBottom: 16 }}>
          <RiskCard level={riskLevel} details={riskDetails} />
        </View>

        <SectionCard icon="shield" iconBg="#4A90D91A" iconColor={colors.primary} title="Recommended next action">
          <Text style={s.fieldValue}>
            {uncertainItems.length > 0
              ? "Re-verify uncertain fields before continuing."
              : "All fields confirmed. Safe to resume task."}
          </Text>
        </SectionCard>
      </ScrollView>

      <View style={s.bottomBar}>
        <TouchableOpacity style={s.resumeBtn} onPress={() => {
          startSession(patientId, name);
          navigation.navigate("Tabs" as any);
        }} activeOpacity={0.8}>
          <Text style={s.resumeBtnText}>Resume Safely</Text>
        </TouchableOpacity>
        <View style={s.bottomRow}>
          <TouchableOpacity
            style={[s.bottomSmallBtn, { backgroundColor: verified ? colors.success : colors.primary }]}
            onPress={() => {
              setVerified(true);
              completeTask(patientId);
              if (vs.medication === "confirmed" && sd.medication) {
                recordMedication(patientId, sd.medication, sd.dosage ?? "");
              }
              Alert.alert("Task Completed", `${name}'s task has been marked as verified and completed.`, [
                { text: "Back to Dashboard", onPress: () => navigation.navigate("Tabs" as any) },
              ]);
            }}
            activeOpacity={0.8}
          >
            <Feather name={verified ? "check" : "shield"} size={14} color="#FFF" style={{ marginRight: 4 }} />
            <Text style={s.bottomSmallBtnText}>{verified ? "Verified ✓" : "Mark Verified"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.bottomSmallBtn, { backgroundColor: colors.destructive }]}
            onPress={() => {
              Alert.alert("Escalated", `${name}'s case has been escalated for review.`, [
                { text: "OK" },
              ]);
            }}
            activeOpacity={0.8}
          >
            <Text style={s.bottomSmallBtnText}>Escalate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 180 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 20 },
  backText: { fontSize: 16, color: colors.primary },
  headerCard: { backgroundColor: "#4A90D90D", borderWidth: 1, borderColor: "#4A90D933", borderRadius: radius.lg, padding: 20, marginBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: "600", color: colors.foreground, marginBottom: 4 },
  headerSub: { fontSize: 14, color: colors.mutedForeground },
  sectionCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  sectionIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: colors.foreground },
  fieldValue: { fontSize: 15, color: colors.foreground },
  fieldMuted: { fontSize: 14, color: colors.mutedForeground, marginTop: 2 },
  checkRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 36, backgroundColor: colors.background },
  resumeBtn: { backgroundColor: colors.success, paddingVertical: 16, borderRadius: radius.lg, alignItems: "center", marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  resumeBtnText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  bottomRow: { flexDirection: "row", gap: 12 },
  bottomSmallBtn: { flex: 1, paddingVertical: 14, borderRadius: radius.md, alignItems: "center" },
  bottomSmallBtnText: { color: "#FFF", fontSize: 14, fontWeight: "600" },
});
