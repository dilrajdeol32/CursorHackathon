import type { NurseProfile } from "./types";

const SESSION_KEY = "checkpoint.session";

export interface StoredSession {
  accessToken: string;
  refreshToken: string;
  expiresAt?: number | null;
  nurse: NurseProfile;
}

export function getStoredSession(): StoredSession | null {
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function saveStoredSession(session: StoredSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  window.localStorage.removeItem(SESSION_KEY);
}
