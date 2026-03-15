import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootStack";
import { StatusChip } from "../components/StatusChip";
import { useSession } from "../context/SessionContext";
import { colors, radius } from "../theme";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const iconMap: Record<string, keyof typeof Feather.glyphMap> = {
  pill: "disc",
  droplets: "droplet",
  activity: "activity",
  bandage: "clipboard",
};

const tasks = [
  { id: "1", patientId: "1", patient: "Mr. Patel", room: "Room 204", task: "Metoprolol Administration", icon: "pill", status: "interrupted" as const, time: "08:00" },
  { id: "2", patientId: "2", patient: "Mrs. Johnson", room: "Room 208", task: "IV Fluid Check", icon: "droplets", status: "normal" as const, time: "08:30" },
  { id: "3", patientId: "3", patient: "Mr. Garcia", room: "Room 211", task: "Wound Dressing Change", icon: "bandage", status: "high-risk" as const, time: "09:00" },
  { id: "4", patientId: "5", patient: "Mr. Thompson", room: "Room 219", task: "Insulin Administration", icon: "pill", status: "interrupted" as const, time: "08:15" },
];

export function TasksScreen() {
  const navigation = useNavigation<Nav>();
  const { activePatientId, completedTaskIds } = useSession();

  const remaining = tasks.filter((t) => !completedTaskIds.includes(t.patientId)).length;

  const getEffectiveStatus = (t: typeof tasks[0]) => {
    if (activePatientId === t.patientId) return "in-session" as const;
    if (completedTaskIds.includes(t.patientId)) return "completed" as const;
    return t.status;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Active Tasks</Text>
        <Text style={styles.subtitle}>
          {remaining} task{remaining !== 1 ? "s" : ""} remaining
          {completedTaskIds.length > 0 ? ` · ${completedTaskIds.length} completed` : ""}
        </Text>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        renderItem={({ item }) => {
          const status = getEffectiveStatus(item);
          const isDone = status === "completed";
          return (
            <TouchableOpacity
              style={[styles.card, isDone && { opacity: 0.6 }]}
              onPress={() => navigation.navigate("PatientContext", { id: item.patientId })}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, isDone && { backgroundColor: colors.statusNormalBg }]}>
                <Feather name={isDone ? "check" : (iconMap[item.icon] || "circle")} size={20} color={isDone ? colors.success : colors.primary} />
              </View>
              <View style={styles.content}>
                <Text style={[styles.taskName, isDone && { textDecorationLine: "line-through", color: colors.mutedForeground }]}>{item.task}</Text>
                <Text style={styles.patientInfo}>{item.patient} · {item.room}</Text>
                <View style={styles.bottomRow}>
                  <StatusChip status={status} />
                  <View style={styles.timeRow}>
                    <Feather name="clock" size={14} color={colors.mutedForeground} />
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "600", color: colors.foreground, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.mutedForeground },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    flexDirection: "row",
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
    gap: 16,
  },
  iconBox: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: "#4A90D91A", justifyContent: "center", alignItems: "center" },
  content: { flex: 1 },
  taskName: { fontSize: 16, fontWeight: "600", color: colors.foreground, marginBottom: 4 },
  patientInfo: { fontSize: 14, color: colors.mutedForeground, marginBottom: 12 },
  bottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  timeText: { fontSize: 13, color: colors.mutedForeground },
});
