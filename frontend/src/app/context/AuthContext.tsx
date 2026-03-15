import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../../lib/api";
import {
  clearStoredSession,
  getStoredSession,
  saveStoredSession,
} from "../../lib/session";
import type { NurseProfile } from "../../lib/types";

interface AuthContextValue {
  nurse: NurseProfile | null;
  token: string | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [nurse, setNurse] = useState<NurseProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  useEffect(() => {
    const storedSession = getStoredSession();

    if (!storedSession?.accessToken) {
      setStatus("unauthenticated");
      return;
    }

    setToken(storedSession.accessToken);

    api
      .me(storedSession.accessToken)
      .then((profile) => {
        setNurse(profile);
        setStatus("authenticated");
      })
      .catch(() => {
        clearStoredSession();
        setToken(null);
        setNurse(null);
        setStatus("unauthenticated");
      });
  }, []);

  async function login(email: string, password: string) {
    const response = await api.login(email, password);
    const profile: NurseProfile = {
      nurse_id: response.user.id,
      email: response.user.email,
    };

    saveStoredSession({
      accessToken: response.session.access_token,
      refreshToken: response.session.refresh_token,
      expiresAt: response.session.expires_at,
      nurse: profile,
    });

    setToken(response.session.access_token);
    setNurse(profile);
    setStatus("authenticated");
  }

  function logout() {
    clearStoredSession();
    setToken(null);
    setNurse(null);
    setStatus("unauthenticated");
  }

  return (
    <AuthContext.Provider value={{ nurse, token, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
