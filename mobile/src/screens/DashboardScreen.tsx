import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootStack";
import { colors, radius } from "../theme";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const cards = [
  { title: "Assigned Patients", count: 6, preview: "2 need attention", icon: "users" as const, iconColor: colors.primary, bgColor: "#4A90D91A", tab: "Patients" },
  { title: "Active Tasks", count: 4, preview: "1 medication due", icon: "check-square" as const, iconColor: colors.secondary, bgColor: "#5BA8A01A", tab: "Tasks" },
  { title: "Unresolved Checkpoints", count: 2, preview: "1 high risk", icon: "bookmark" as const, iconColor: colors.warning, bgColor: "#E5A84D1A", tab: "Checkpoint" },
  { title: "Shift Handover", count: 0, preview: "Scheduled at 19:00", icon: "repeat" as const, iconColor: colors.purple, bgColor: "#7B6BD91A", nav: "ShiftHandover" },
];

export function DashboardScreen() {
  const navigation = useNavigation<Nav>();

  const handlePress = (card: typeof cards[0]) => {
    if (card.nav) {
      navigation.navigate(card.nav as any);
    } else if (card.tab) {
      navigation.navigate("Tabs" as any, { screen: card.tab });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.greeting}>
          <View style={styles.morningRow}>
            <Feather name="sun" size={18} color={colors.warning} />
            <Text style={styles.morningText}>Good Morning</Text>
          </View>
          <Text style={styles.hello}>Hello, Sarah</Text>
          <View style={styles.shiftRow}>
            <Feather name="clock" size={14} color={colors.mutedForeground} />
            <Text style={styles.shiftText}>Day Shift</Text>
            <Text style={styles.shiftText}>6 Patients</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {cards.map((card) => (
            <TouchableOpacity key={card.title} style={styles.card} onPress={() => handlePress(card)} activeOpacity={0.7}>
              <View style={[styles.iconBox, { backgroundColor: card.bgColor }]}>
                <Feather name={card.icon} size={20} color={card.iconColor} />
              </View>
              <Text style={styles.count}>{card.count}</Text>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.preview}>{card.preview}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 100 },
  greeting: { marginBottom: 28 },
  morningRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  morningText: { fontSize: 14, color: colors.mutedForeground },
  hello: { fontSize: 24, fontWeight: "600", color: colors.foreground, marginBottom: 4 },
  shiftRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  shiftText: { fontSize: 14, color: colors.mutedForeground, marginRight: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  card: {
    width: "47%",
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
  iconBox: { width: 44, height: 44, borderRadius: radius.md, justifyContent: "center", alignItems: "center", marginBottom: 16 },
  count: { fontSize: 30, color: colors.foreground, marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: colors.foreground, marginBottom: 4 },
  preview: { fontSize: 13, color: colors.mutedForeground },
});
