import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ValidationField } from "../components/ValidationField";
import { colors, radius } from "../theme";

const patientNames: Record<string, string> = { "1": "Mr. Patel", "2": "Mrs. Johnson", "3": "Mr. Garcia", "4": "Ms. Chen", "5": "Mr. Thompson", "6": "Mrs. Williams" };
const patientRooms: Record<string, string> = { "1": "204", "2": "208", "3": "211", "4": "215", "5": "219", "6": "222" };

export function CheckpointCaptureScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const id = (route.params as any)?.id || "1";

  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showFields, setShowFields] = useState(false);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  const name = patientNames[id] || "Mr. Patel";
  const room = patientRooms[id] || "204";

  useEffect(() => {
    if (!recording) { pulseAnim.stopAnimation(); pulseAnim.setValue(1); return; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [recording]);

  useEffect(() => {
    if (!recording) return;
    const words = `${name}, room ${room}, metoprolol 25 milligrams, bed alarm.`.split(" ");
    let i = 0;
    const interval = setInterval(() => {
      if (i < words.length) { setTranscript((prev) => (prev ? prev + " " : "") + words[i]); i++; }
      else { setRecording(false); setShowFields(true); clearInterval(interval); }
    }, 300);
    return () => clearInterval(interval);
  }, [recording, name, room]);

  const handleRecord = () => {
    if (!recording) { setTranscript(""); setShowFields(false); setRecording(true); }
    else { setRecording(false); setShowFields(true); }
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={colors.primary} />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={s.title}>Save Task Context</Text>
        <Text style={s.subtitle}>{name} · Room {room}</Text>

        <View style={s.orbWrap}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity style={[s.orb, recording && s.orbRecording]} onPress={handleRecord} activeOpacity={0.8}>
              <Feather name={recording ? "mic-off" : "mic"} size={40} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>
          <Text style={s.orbLabel}>{recording ? "Listening..." : "Tap to record"}</Text>
        </View>

        {transcript ? (
          <View style={s.card}>
            <Text style={s.cardLabel}>Transcript</Text>
            <Text style={s.transcriptText}>"{transcript}"</Text>
          </View>
        ) : null}

        {showFields && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Extracted Fields</Text>
            <ValidationField label="Patient" value={name} status="confirmed" />
            <ValidationField label="Room" value={room} status="confirmed" />
            <ValidationField label="Medication" value="Metoprolol" status="confirmed" />
            <ValidationField label="Dosage" value="25mg" status="uncertain" />
            <ValidationField label="Interruption" value="Bed Alarm" status="confirmed" />
          </View>
        )}
      </ScrollView>

      {showFields && (
        <View style={s.bottomBar}>
          <TouchableOpacity style={s.saveBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Text style={s.saveBtnText}>Save Checkpoint</Text>
          </TouchableOpacity>
          <View style={s.bottomRow}>
            <TouchableOpacity style={s.secondaryBtn} activeOpacity={0.7}>
              <Feather name="edit-2" size={16} color={colors.foreground} />
              <Text style={s.secondaryBtnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.secondaryBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
              <Text style={[s.secondaryBtnText, { color: colors.mutedForeground }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 200 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 20 },
  backText: { fontSize: 16, color: colors.primary },
  title: { fontSize: 24, fontWeight: "600", color: colors.foreground, textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.mutedForeground, textAlign: "center" },
  orbWrap: { alignItems: "center", marginVertical: 40 },
  orb: { width: 112, height: 112, borderRadius: 56, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6 },
  orbRecording: { backgroundColor: colors.destructive },
  orbLabel: { fontSize: 14, color: colors.mutedForeground, marginTop: 16 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  cardLabel: { fontSize: 13, color: colors.mutedForeground, marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: colors.foreground, marginBottom: 12 },
  transcriptText: { fontSize: 15, color: colors.foreground, fontStyle: "italic" },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 36, backgroundColor: colors.background },
  saveBtn: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: radius.lg, alignItems: "center", marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  saveBtnText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  bottomRow: { flexDirection: "row", gap: 12 },
  secondaryBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, paddingVertical: 12, borderRadius: radius.md },
  secondaryBtnText: { fontSize: 14, color: colors.foreground },
});
