export interface BackendPatient {
  patient_id: string;
  name: string;
  room_number: string;
  allergies: string[];
  medications: string[];
  latest_vitals: {
    blood_pressure: string;
    heart_rate: number;
    temp_c: number;
    resp_rate: number;
    spo2: number;
  };
}

export type PatientStatus = "normal" | "interrupted" | "high-risk";

export interface NurseProfile {
  nurse_id: string;
  email?: string | null;
}

export interface LoginResponse {
  user: {
    id: string;
    email?: string | null;
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_at?: number | null;
  };
}
