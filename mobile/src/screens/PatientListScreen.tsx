import React, { useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootStack";
import { PatientCard, Patient } from "../components/PatientCard";
import { useSession } from "../context/SessionContext";
import { colors } from "../theme";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const patients: Patient[] = [
  { id: "1", name: "Mr. Patel", room: "Room 204", activeTask: "Metoprolol Administration", status: "interrupted", checkpointTime: "6 min ago", allergy: "Penicillin" },
  { id: "2", name: "Mrs. Johnson", room: "Room 208", activeTask: "IV Fluid Check", status: "normal", checkpointTime: "12 min ago" },
  { id: "3", name: "Mr. Garcia", room: "Room 211", activeTask: "Wound Dressing Change", status: "high-risk", checkpointTime: "22 min ago" },
  { id: "4", name: "Ms. Chen", room: "Room 215", activeTask: "Vitals Monitoring", status: "normal", checkpointTime: "3 min ago" },
  { id: "5", name: "Mr. Thompson", room: "Room 219", activeTask: "Insulin Administration", status: "interrupted", checkpointTime: "15 min ago" },
  { id: "6", name: "Mrs. Williams", room: "Room 222", activeTask: "Post-Op Assessment", status: "normal", checkpointTime: "8 min ago" },
];

export function PatientListScreen() {
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState("");
  const { activePatientId, completedTaskIds } = useSession();

  const filtered = patients.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.room.toLowerCase().includes(search.toLowerCase())
  );

  const getEffectiveStatus = (p: Patient): Patient["status"] => {
    if (activePatientId === p.id) return "in-session" as any;
    if (completedTaskIds.includes(p.id)) return "completed" as any;
    return p.status;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Patients</Text>
        <Text style={styles.subtitle}>{patients.length} assigned this shift</Text>
      </View>

      <View style={styles.searchWrap}>
        <Feather name="search" size={18} color={colors.mutedForeground} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients..."
          placeholderTextColor={colors.mutedForeground}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        renderItem={({ item }) => (
          <PatientCard
            patient={{ ...item, status: getEffectiveStatus(item) }}
            onPress={() => navigation.navigate("PatientContext", { id: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 24, fontWeight: "600", color: colors.foreground, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.mutedForeground, marginBottom: 16 },
  searchWrap: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, marginHorizontal: 20, marginBottom: 16, paddingHorizontal: 16 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 14, fontSize: 16, color: colors.foreground },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
});
