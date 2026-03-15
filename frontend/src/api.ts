const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export type Patient = {
  patient_id: string;
  name: string;
  room_number: string;
  allergies: string[];
  medications: string[];
  latest_vitals: Record<string, string | number>;
};

export const api = {
  getHealth: () => request<{ ok: boolean; env: string }>("/health"),
  getPatients: () => request<Patient[]>("/patients"),
  getPatient: (id: string) => request<Patient>(`/patients/${id}`),
};
