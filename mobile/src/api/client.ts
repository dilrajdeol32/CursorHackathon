import { API_BASE_URL } from "../config/api";

// Optional token injected at runtime so all protected requests automatically
// carry Authorization headers once the user is signed in.
let _authToken: string | null = null;

export function setAuthToken(token: string | null) {
  _authToken = token;
}

async function request<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<{ data: T | null; error: string | null }> {
  try {
    const token = options?.token ?? _authToken;
    const headers: Record<string, string> = {
      ...(options?.headers as Record<string, string>),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { data: null, error: (body as any).error ?? `HTTP ${res.status}` };
    }
    const data = (await res.json()) as T;
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Network error" };
  }
}

export function getHealth() {
  return request<{ ok: boolean; env: string }>("/health");
}

export function getPatients() {
  return request<any[]>("/patients");
}

export function testDb() {
  return request<{ ok: boolean; message: string }>("/test/test-db");
}

export type AudioResponse = {
  transcript: string;
  structured_data: Record<string, string>;
  validation_status: Record<string, string>;
  patient_id: string | null;
};

export async function uploadAudio(
  audioUri: string,
  patientId: string,
  fallbackTranscript?: string
): Promise<{ data: AudioResponse | null; error: string | null }> {
  try {
    const formData = new FormData();

    if (audioUri && !audioUri.startsWith("mock://")) {
      const ext = audioUri.split(".").pop()?.toLowerCase() ?? "m4a";
      const mimeMap: Record<string, string> = { wav: "audio/wav", m4a: "audio/mp4", caf: "audio/x-caf", mp4: "audio/mp4", aac: "audio/aac" };
      const mimeType = mimeMap[ext] ?? "audio/mp4";
      formData.append("audio", {
        uri: audioUri,
        type: mimeType,
        name: `recording.${ext}`,
      } as any);
    }

    formData.append("patient_id", patientId);
    if (fallbackTranscript) {
      formData.append("transcript", fallbackTranscript);
    }

    const res = await fetch(`${API_BASE_URL}/audio`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { data: null, error: (body as any).error ?? `HTTP ${res.status}` };
    }

    const data = (await res.json()) as AudioResponse;
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Network error" };
  }
}

export type Checkpoint = {
  id: string;
  nurse_id: string;
  patient_id: string;
  timestamp: string;
  transcript: string | null;
  structured_data: Record<string, any> | null;
  validation_status: Record<string, string> | null;
  interruption_type: string | null;
  risk_score: string | null;
};

export function saveCheckpoint(payload: {
  patient_id: string;
  transcript?: string;
  structured_data?: Record<string, any>;
  validation_status?: Record<string, string>;
  interruption_type?: string;
}) {
  return request<Checkpoint>("/checkpoints", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function getCheckpoints() {
  return request<Checkpoint[]>("/checkpoints");
}

export function getCheckpoint(id: string) {
  return request<Checkpoint>(`/checkpoints/${id}`);
}

export type HandoverPatient = {
  patient_id: string;
  patient_name: string;
  room: string;
  checkpoint_count: number;
  high_risk_count: number;
  summary: string;
};

export type HandoverResponse = {
  nurse_id: string;
  generated_at: string;
  patients: HandoverPatient[];
};

export function generateHandover(patientIds?: string[]) {
  return request<HandoverResponse>("/handover", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ patient_ids: patientIds }),
  });
}

// --- Auth API ---

export type LoginResponse = {
  user: { id: string; email: string };
  session: { access_token: string; refresh_token: string; expires_at: number };
};

export function login(email: string, password: string) {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export function getMe(token: string) {
  return request<{ nurse_id: string; email: string }>("/auth/me", { token });
}
