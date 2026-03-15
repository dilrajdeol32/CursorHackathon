import type {
  BackendPatient,
  LoginResponse,
  NurseProfile,
} from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

type RequestOptions = RequestInit & {
  token?: string | null;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorPayload = (await response.json()) as {
        error?: string;
        details?: string;
      };
      message = errorPayload.details ?? errorPayload.error ?? message;
    } catch {
      // Ignore malformed error bodies and use the default message.
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

export const api = {
  login(email: string, password: string) {
    return request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  me(token: string) {
    return request<NurseProfile>("/auth/me", { token });
  },
  listPatients() {
    return request<BackendPatient[]>("/patients");
  },
  getPatient(id: string) {
    return request<BackendPatient>(`/patients/${id}`);
  },
};
