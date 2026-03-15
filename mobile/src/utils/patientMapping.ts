export type QRPatientData = {
  patient_id: string;
  name?: string;
  room_number?: string;
};

const qrIdToAppId: Record<string, string> = {
  P001: "1",
  P002: "2",
  P003: "3",
  P004: "4",
};

const roomToAppId: Record<string, string> = {
  "204": "1",
  "208": "2",
  "211": "3",
  "215": "4",
  "219": "5",
  "222": "6",
};

export function resolveAppPatientId(qr: QRPatientData): string | null {
  if (qrIdToAppId[qr.patient_id]) return qrIdToAppId[qr.patient_id];
  if (qr.room_number && roomToAppId[qr.room_number]) return roomToAppId[qr.room_number];
  return null;
}

export function parseQRData(raw: string): QRPatientData | null {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.patient_id === "string") return parsed as QRPatientData;
    return null;
  } catch {
    return null;
  }
}

export const DEMO_QR_PATIENTS: QRPatientData[] = [
  { patient_id: "P001", name: "Maria Santos", room_number: "204" },
  { patient_id: "P002", name: "James Chen", room_number: "311" },
  { patient_id: "P003", name: "Patricia Okonkwo", room_number: "118" },
  { patient_id: "P004", name: "Robert Williams", room_number: "205" },
];
