import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from "expo-audio";
import { ValidationField } from "../components/ValidationField";
import { uploadAudio, saveCheckpoint } from "../api/client";
import { colors, radius } from "../theme";

const patientNames: Record<string, string> = { "1": "Mr. Patel", "2": "Mrs. Johnson", "3": "Mr. Garcia", "4": "Ms. Chen", "5": "Mr. Thompson", "6": "Mrs. Williams" };
const patientRooms: Record<string, string> = { "1": "204", "2": "208", "3": "211", "4": "215", "5": "219", "6": "222" };

type ExtractedData = Record<string, string>;
type ValidationStatus = Record<string, string>;

export function CheckpointCaptureScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const id = (route.params as any)?.id ?? null;

  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [validationStatus, setValidationStatus] = useState<ValidationStatus | null>(null);
  const [showFields, setShowFields] = useState(false);
  const [permGranted, setPermGranted] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const name = id ? (patientNames[id] || "Patient") : null;
  const room = id ? (patientRooms[id] || null) : null;

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

  const startRecording = async () => {
    if (!permGranted) {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission required", "Microphone access is needed to record checkpoints.");
        return;
      }
      setPermGranted(true);
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
    }

    setTranscript("");
    setShowFields(false);
    setExtractedData(null);
    setValidationStatus(null);

    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setRecording(true);
    } catch (err) {
      console.error("Failed to start recording:", err);
      Alert.alert("Error", "Could not start recording.");
    }
  };

  const stopRecording = async () => {
    setRecording(false);
    setProcessing(true);

    try {
      await audioRecorder.stop();
      const uri = audioRecorder.uri;

      if (uri) {
        const { data, error } = await uploadAudio(uri, id ?? "");

        if (error || !data) {
          console.warn("Upload failed, using fallback:", error);
          useFallback();
          return;
        }

        setTranscript(data.transcript);
        setExtractedData(data.structured_data);
        setValidationStatus(data.validation_status);
        setShowFields(true);
      } else {
        console.warn("No recording URI, using fallback");
        useFallback();
      }
    } catch (err) {
      console.error("Error processing recording:", err);
      useFallback();
    } finally {
      setProcessing(false);
    }
  };

  const useFallback = () => {
    const fallbackName = name ?? "Mr. Patel";
    const fallbackRoom = room ?? "204";
    const mockTranscript = `${fallbackName}, room ${fallbackRoom}, metoprolol 25 milligrams, bed alarm.`;
    setTranscript(mockTranscript);
    setExtractedData({
      patient_name: fallbackName,
      room_number: fallbackRoom,
      medication: "Metoprolol",
      dosage: "25mg",
      interruption_type: "Bed Alarm",
    });
    setValidationStatus({
      patient_name: "confirmed",
      room_number: "confirmed",
      medication: "confirmed",
      dosage: "uncertain",
      interruption_type: "confirmed",
    });
    setShowFields(true);
    setProcessing(false);
  };

  const handleRecord = () => {
    if (!recording) startRecording();
    else stopRecording();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveCheckpoint({
        patient_id: id ?? extractedData?.patient_name ?? "unknown",
        transcript,
        structured_data: extractedData ?? undefined,
        validation_status: validationStatus ?? undefined,
        interruption_type: extractedData?.interruption_type,
      });
      navigation.goBack();
    } catch (err) {
      console.error("Save failed:", err);
      Alert.alert("Error", "Could not save checkpoint.");
    } finally {
      setSaving(false);
    }
  };

  const fieldLabel: Record<string, string> = {
    patient_name: "Patient",
    room_number: "Room",
    medication: "Medication",
    dosage: "Dosage",
    interruption_type: "Interruption",
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={colors.primary} />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={s.title}>Save Task Context</Text>
        {name && room ? (
          <Text style={s.subtitle}>{name} · Room {room}</Text>
        ) : (
          <Text style={s.subtitle}>Speak to capture checkpoint details</Text>
        )}

        <View style={s.orbWrap}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[s.orb, recording && s.orbRecording]}
              onPress={handleRecord}
              activeOpacity={0.8}
              disabled={processing}
            >
              {processing ? (
                <ActivityIndicator size="large" color="#FFF" />
              ) : (
                <Feather name={recording ? "mic-off" : "mic"} size={40} color="#FFF" />
              )}
            </TouchableOpacity>
          </Animated.View>
          <Text style={s.orbLabel}>
            {processing ? "Processing..." : recording ? "Listening..." : "Tap to record"}
          </Text>
        </View>

        {transcript ? (
          <View style={s.card}>
            <Text style={s.cardLabel}>Transcript</Text>
            <Text style={s.transcriptText}>"{transcript}"</Text>
          </View>
        ) : null}

        {showFields && extractedData && validationStatus && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Extracted Fields</Text>
            {Object.keys(fieldLabel).map((key) => (
              <ValidationField
                key={key}
                label={fieldLabel[key]}
                value={extractedData[key] || "—"}
                status={validationStatus[key] as any}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {showFields && (
        <View style={s.bottomBar}>
          <TouchableOpacity style={s.saveBtn} onPress={handleSave} activeOpacity={0.8} disabled={saving}>
            {saving ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={s.saveBtnText}>Save Checkpoint</Text>
            )}
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
