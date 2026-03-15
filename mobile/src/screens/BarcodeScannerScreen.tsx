import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootStack";
import { colors } from "../theme";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function BarcodeScannerScreen() {
  const navigation = useNavigation<Nav>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const lockRef = useRef(false);

  const onBarCodeScanned = ({ data }: { data: string }) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setScanned(true);

    setTimeout(() => {
      navigation.navigate("Tabs", {
        screen: "Patients",
        params: { scannedBarcode: data },
      } as any);
    }, 400);
  };

  if (!permission) {
    return (
      <View style={s.center}>
        <Text style={s.permText}>Requesting camera permission…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={s.center}>
        <Feather name="camera-off" size={48} color={colors.mutedForeground} />
        <Text style={s.permText}>
          Camera access is needed to scan patient wristbands
        </Text>
        <TouchableOpacity style={s.grantBtn} onPress={requestPermission}>
          <Text style={s.grantBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: [
            "code128",
            "code39",
            "code93",
            "ean13",
            "ean8",
            "upc_a",
            "upc_e",
            "qr",
          ],
        }}
        onBarcodeScanned={scanned ? undefined : onBarCodeScanned}
      />

      {/* Top bar */}
      <View style={s.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.closeBtn}
        >
          <Feather name="x" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={s.topTitle}>Scan Wristband</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Viewfinder corners */}
      <View style={s.overlay}>
        <View style={s.viewfinder}>
          <View style={[s.corner, s.tl]} />
          <View style={[s.corner, s.tr]} />
          <View style={[s.corner, s.bl]} />
          <View style={[s.corner, s.br]} />
        </View>
        <Text style={s.hint}>
          Point the camera at the patient's wristband barcode
        </Text>
      </View>

      {/* Debug: simulate a scan in the simulator */}
      {!scanned && (
        <View style={s.debugRow}>
          {["PAT-001-204", "PAT-003-211", "PAT-005-219"].map((code) => (
            <TouchableOpacity
              key={code}
              style={s.debugBtn}
              onPress={() => onBarCodeScanned({ data: code })}
            >
              <Feather name="cpu" size={14} color="#fff" />
              <Text style={s.debugBtnText}>{code}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {scanned && (
        <View style={s.scannedOverlay}>
          <Feather name="check-circle" size={48} color={colors.success} />
          <Text style={s.scannedText}>Scanned!</Text>
        </View>
      )}
    </View>
  );
}

const CORNER = 24;
const BORDER = 3;

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  permText: {
    fontSize: 16,
    color: colors.mutedForeground,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  grantBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  grantBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  topTitle: { fontSize: 17, fontWeight: "600", color: "#fff" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  viewfinder: { width: 260, height: 160, position: "relative" },
  corner: { position: "absolute", width: CORNER, height: CORNER },
  tl: {
    top: 0,
    left: 0,
    borderTopWidth: BORDER,
    borderLeftWidth: BORDER,
    borderColor: "#fff",
    borderTopLeftRadius: 8,
  },
  tr: {
    top: 0,
    right: 0,
    borderTopWidth: BORDER,
    borderRightWidth: BORDER,
    borderColor: "#fff",
    borderTopRightRadius: 8,
  },
  bl: {
    bottom: 0,
    left: 0,
    borderBottomWidth: BORDER,
    borderLeftWidth: BORDER,
    borderColor: "#fff",
    borderBottomLeftRadius: 8,
  },
  br: {
    bottom: 0,
    right: 0,
    borderBottomWidth: BORDER,
    borderRightWidth: BORDER,
    borderColor: "#fff",
    borderBottomRightRadius: 8,
  },
  hint: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginTop: 24,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  scannedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  scannedText: { color: "#fff", fontSize: 20, fontWeight: "600", marginTop: 12 },
  debugRow: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
    paddingHorizontal: 16,
  },
  debugBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  debugBtnText: { color: "#fff", fontSize: 12, fontWeight: "500" },
});
