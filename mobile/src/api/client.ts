import { API_BASE_URL } from "../config/api";

async function request<T>(path: string): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`);
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
