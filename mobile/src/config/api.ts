import { Platform } from "react-native";

/**
 * iOS Simulator → localhost works directly.
 * Android Emulator → 10.0.2.2 maps to host machine.
 * Physical device → use your LAN IP (e.g. 192.168.x.x).
 */
const LOCALHOST =
  Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

export const API_BASE_URL = LOCALHOST;
