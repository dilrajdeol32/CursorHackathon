import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootStack";
import { PatientCard, Patient } from "../components/PatientCard";
import { useSession } from "../context/SessionContext";
import { colors } from "../theme";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const INITIAL_PATIENTS: Patient[] = [
  { id: "1", name: "Mr. Patel", room: "Room 204", activeTask: "Metoprolol Administration", status: "interrupted", checkpointTime: "6 min ago", allergy: "Penicillin", barcode: "PAT-001-204" },
  { id: "2", name: "Mrs. Johnson", room: "Room 208", activeTask: "IV Fluid Check", status: "normal", checkpointTime: "12 min ago", barcode: "PAT-002-208" },
  { id: "3", name: "Mr. Garcia", room: "Room 211", activeTask: "Wound Dressing Change", status: "high-risk", checkpointTime: "22 min ago", barcode: "PAT-003-211" },
  { id: "4", name: "Ms. Chen", room: "Room 215", activeTask: "Vitals Monitoring", status: "normal", checkpointTime: "3 min ago", barcode: "PAT-004-215" },
  { id: "5", name: "Mr. Thompson", room: "Room 219", activeTask: "Insulin Administration", status: "interrupted", checkpointTime: "15 min ago", barcode: "PAT-005-219" },
  { id: "6", name: "Mrs. Williams", room: "Room 222", activeTask: "Post-Op Assessment", status: "normal", checkpointTime: "8 min ago", barcode: "PAT-006-222" },
];

export function PatientListScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [lastScannedId, setLastScannedId] = useState<string | null>(null);
  const { activePatientId, completedTaskIds } = useSession();

  useEffect(() => {
    const scannedBarcode = (route.params as any)?.scannedBarcode as
      | string
      | undefined;
    if (!scannedBarcode) return;

    const idx = patients.findIndex(
      (p) => p.barcode === scannedBarcode || p.id === scannedBarcode
    );

    if (idx >= 0) {
      const patient = patients[idx];
      const updated = [
        { ...patient, checkpointTime: "Just now" },
        ...patients.filter((_, i) => i !== idx),
      ];
      setPatients(updated);
      setLastScannedId(patient.id);
      setTimeout(() => setLastScannedId(null), 3000);
    } else {
      Alert.alert(
        "Patient Not Found",
        `No patient matched barcode "${scannedBarcode}". They may not be assigned to this shift.`
      );
    }

    navigation.setParams({ scannedBarcode: undefined } as any);
  }, [(route.params as any)?.scannedBarcode]);

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.room.toLowerCase().includes(search.toLowerCase())
  );

  const getEffectiveStatus = (p: Patient): Patient["status"] => {
    if (activePatientId === p.id) return "in-session" as any;
    if (completedTaskIds.includes(p.id)) return "completed" as any;
    return p.status;
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <View style={s.headerRow}>
          <View>
            <Text style={s.title}>Patients</Text>
            <Text style={s.subtitle}>
              {patients.length} assigned this shift
            </Text>
          </View>
          <TouchableOpacity
            style={s.scanBtn}
            onPress={() => navigation.navigate("BarcodeScanner" as any)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="scan-outline"
              size={22}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.searchWrap}>
        <Feather
          name="search"
          size={18}
          color={colors.mutedForeground}
          style={s.searchIcon}
        />
        <TextInput
          style={s.searchInput}
          placeholder="Search patients..."
          placeholderTextColor={colors.mutedForeground}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        renderItem={({ item }) => (
          <View>
            {lastScannedId === item.id && (
              <View style={s.scannedBadge}>
                <Feather
                  name="check-circle"
                  size={12}
                  color={colors.success}
                />
                <Text style={s.scannedBadgeText}>Just scanned</Text>
              </View>
            )}
            <PatientCard
              patient={{ ...item, status: getEffectiveStatus(item) }}
              onPress={() =>
                navigation.navigate("PatientContext" as any, { id: item.id })
              }
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 20 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.foreground,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 16,
  },
  scanBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.foreground,
  },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  scannedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.statusNormalBg,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  scannedBadgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.statusNormalText,
  },
});
