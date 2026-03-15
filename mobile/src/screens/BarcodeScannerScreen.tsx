import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootStack";
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import {
  parseQRData,
  resolveAppPatientId,
  DEMO_QR_PATIENTS,
  QRPatientData,
} from "../utils/patientMapping";
import { colors, radius } from "../theme";

type Nav = NativeStackNavigationProp<RootStackParamList>;
const { width: SCREEN_W } = Dimensions.get("window");
const VIEWFINDER_SIZE = SCREEN_W * 0.7;

export function BarcodeScannerScreen() {
  const navigation = useNavigation<Nav>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const lockRef = useRef(false);

  const resetScanner = useCallback(() => {
    setScanned(false);
    lockRef.current = false;
  }, []);

  const handlePatientResolved = useCallback(
    (qr: QRPatientData) => {
      const appId = resolveAppPatientId(qr);
      if (appId) {
        navigation.replace("PatientContext", { id: appId });
      } else {
        Alert.alert(
          "Patient Not Found",
          `No matching patient for ${qr.name ?? qr.patient_id} (Room ${qr.room_number ?? "?"}).`,
          [{ text: "Scan Again", onPress: resetScanner }]
        );
      }
    },
    [navigation, resetScanner]
  );

  const handleBarCodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (lockRef.current) return;
      lockRef.current = true;
      setScanned(true);

      const qr = parseQRData(result.data);
      if (!qr) {
        Alert.alert(
          "Invalid QR Code",
          "This QR code does not contain valid patient data.",
          [{ text: "Scan Again", onPress: resetScanner }]
        );
        return;
      }

      handlePatientResolved(qr);
    },
    [handlePatientResolved, resetScanner]
  );

  const handleDemoScan = useCallback(
    (idx: number) => {
      if (lockRef.current) return;
      lockRef.current = true;
      setScanned(true);
      handlePatientResolved(DEMO_QR_PATIENTS[idx]);
    },
    [handlePatientResolved]
  );

  const isSimulator = !Platform.isPad && __DEV__;

  if (!permission) {
    return (
      <SafeAreaView style={s.safe}>
        <Text style={s.permText}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.permWrap}>
          <Feather name="camera-off" size={48} color={colors.mutedForeground} />
          <Text style={s.permTitle}>Camera Access Required</Text>
          <Text style={s.permSub}>
            Scan patient wristband QR codes to quickly pull up their
            information.
          </Text>
          <TouchableOpacity
            style={s.permBtn}
            onPress={requestPermission}
            activeOpacity={0.8}
          >
            <Text style={s.permBtnText}>Grant Camera Access</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.backLink} onPress={() => navigation.goBack()}>
            <Text style={s.backLinkText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={s.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      <View style={s.overlay}>
        <SafeAreaView style={s.topBar}>
          <TouchableOpacity style={s.closeBtn} onPress={() => navigation.goBack()}>
            <Feather name="x" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={s.topTitle}>Scan Wristband</Text>
          <View style={{ width: 40 }} />
        </SafeAreaView>

        <View style={s.viewfinderRow}>
          <View style={s.viewfinder}>
            <View style={[s.corner, s.cornerTL]} />
            <View style={[s.corner, s.cornerTR]} />
            <View style={[s.corner, s.cornerBL]} />
            <View style={[s.corner, s.cornerBR]} />
          </View>
        </View>

        <View style={s.bottomArea}>
          <Text style={s.instructions}>
            {scanned ? "Processing..." : "Align the QR code within the frame"}
          </Text>

          {isSimulator && (
            <View style={s.demoSection}>
              <Text style={s.demoLabel}>
                Simulator: Tap a patient to simulate scan
              </Text>
              <View style={s.demoGrid}>
                {DEMO_QR_PATIENTS.map((p, i) => (
                  <TouchableOpacity
                    key={p.patient_id}
                    style={s.demoCard}
                    onPress={() => handleDemoScan(i)}
                    activeOpacity={0.7}
                    disabled={scanned}
                  >
                    <Feather name="user" size={16} color={colors.primary} />
                    <Text style={s.demoName} numberOfLines={1}>
                      {p.name}
                    </Text>
                    <Text style={s.demoRoom}>Room {p.room_number}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const CORNER_LEN = 28;
const CORNER_W = 4;

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  container: { flex: 1, backgroundColor: "#000" },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: "space-between" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  topTitle: { color: "#FFF", fontSize: 18, fontWeight: "600" },
  viewfinderRow: { alignItems: "center" },
  viewfinder: { width: VIEWFINDER_SIZE, height: VIEWFINDER_SIZE, borderRadius: 16 },
  corner: { position: "absolute", width: CORNER_LEN, height: CORNER_LEN },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_W,
    borderLeftWidth: CORNER_W,
    borderColor: "#FFF",
    borderTopLeftRadius: 16,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_W,
    borderRightWidth: CORNER_W,
    borderColor: "#FFF",
    borderTopRightRadius: 16,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_W,
    borderLeftWidth: CORNER_W,
    borderColor: "#FFF",
    borderBottomLeftRadius: 16,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_W,
    borderRightWidth: CORNER_W,
    borderColor: "#FFF",
    borderBottomRightRadius: 16,
  },
  bottomArea: { paddingBottom: 60, alignItems: "center" },
  instructions: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
  },
  demoSection: { width: "100%", paddingHorizontal: 20, alignItems: "center" },
  demoLabel: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginBottom: 10 },
  demoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center" },
  demoCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: radius.md,
    padding: 12,
    alignItems: "center",
    width: (SCREEN_W - 60) / 2,
    gap: 4,
  },
  demoName: { fontSize: 13, fontWeight: "600", color: colors.foreground },
  demoRoom: { fontSize: 11, color: colors.mutedForeground },
  permWrap: { alignItems: "center", padding: 40, gap: 16 },
  permTitle: { fontSize: 20, fontWeight: "600", color: colors.foreground },
  permSub: {
    fontSize: 15,
    color: colors.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
  },
  permText: { fontSize: 16, color: colors.mutedForeground },
  permBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: radius.lg,
    marginTop: 8,
  },
  permBtnText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  backLink: { marginTop: 8 },
  backLinkText: { color: colors.primary, fontSize: 15 },
});
