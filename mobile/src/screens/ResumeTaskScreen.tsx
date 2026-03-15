import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootStack";
import { RiskCard } from "../components/RiskCard";
import { colors, radius } from "../theme";

type Nav = NativeStackNavigationProp<RootStackParamList>;

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

export function ResumeTaskScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={colors.primary} />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>

        <View style={s.headerCard}>
          <Text style={s.headerTitle}>Mr. Patel — Room 204</Text>
          <Text style={s.headerSub}>Checkpoint saved 8 minutes ago</Text>
        </View>

        <SectionCard icon="arrow-right" iconBg="#4A90D91A" iconColor={colors.primary} title="What you were doing">
          <Text style={s.fieldValue}>Medication administration</Text>
          <Text style={s.fieldMuted}>Metoprolol 25 mg</Text>
        </SectionCard>

        <SectionCard icon="check-circle" iconBg={colors.statusNormalBg} iconColor={colors.success} title="What is confirmed">
          <View style={{ gap: 8 }}>
            <View style={s.checkRow}><Feather name="check-circle" size={16} color={colors.success} /><Text style={s.fieldValue}>Patient identity verified</Text></View>
            <View style={s.checkRow}><Feather name="check-circle" size={16} color={colors.success} /><Text style={s.fieldValue}>Medication order confirmed</Text></View>
          </View>
        </SectionCard>

        <SectionCard icon="alert-triangle" iconBg={colors.statusInterruptedBg} iconColor={colors.warning} title="What is uncertain">
          <View style={{ gap: 8 }}>
            <View style={s.checkRow}><Feather name="alert-triangle" size={16} color={colors.warning} /><Text style={{ color: colors.warning }}>Dosage verification recommended</Text></View>
            <View style={s.checkRow}><Feather name="alert-triangle" size={16} color={colors.warning} /><Text style={{ color: colors.warning }}>Charting status unclear</Text></View>
          </View>
        </SectionCard>

        <View style={{ marginBottom: 16 }}>
          <RiskCard level="Medium" details={["Interrupted during medication workflow", "8 minutes elapsed", "One field uncertain"]} />
        </View>

        <SectionCard icon="shield" iconBg="#4A90D91A" iconColor={colors.primary} title="Recommended next action">
          <Text style={s.fieldValue}>Re-verify patient identity and medication before continuing.</Text>
        </SectionCard>
      </ScrollView>

      <View style={s.bottomBar}>
        <TouchableOpacity style={s.resumeBtn} onPress={() => navigation.navigate("Tabs" as any)} activeOpacity={0.8}>
          <Text style={s.resumeBtnText}>Resume Safely</Text>
        </TouchableOpacity>
        <View style={s.bottomRow}>
          <TouchableOpacity style={[s.bottomSmallBtn, { backgroundColor: colors.primary }]} activeOpacity={0.8}>
            <Text style={s.bottomSmallBtnText}>Mark Verified</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.bottomSmallBtn, { backgroundColor: colors.destructive }]} activeOpacity={0.8}>
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
