import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { Shield, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface LocationState {
  from?: string;
}

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, status } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectPath = (location.state as LocationState | null)?.from ?? "/";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to sign in with those credentials."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "authenticated") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background px-5 py-8 flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-foreground mb-2">Nurse Sign In</h1>
          <p className="text-muted-foreground">
            Connect the mobile workflow to your Supabase-backed backend.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-3xl shadow-sm p-6"
        >
          <label className="text-muted-foreground mb-2 block" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nurse@hospital.dev"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 mb-4 text-foreground"
            autoComplete="email"
            required
          />

          <label
            className="text-muted-foreground mb-2 block"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground"
            autoComplete="current-password"
            required
          />

          {error ? (
            <div className="mt-4 rounded-xl bg-[#FFEBEE] px-4 py-3 text-[#C62828]">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-5 bg-primary text-primary-foreground py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <span>{submitting ? "Signing in..." : "Sign In"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
