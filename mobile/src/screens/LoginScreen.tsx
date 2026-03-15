import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { login } from "../api/client";
import { setAuthToken } from "../api/client";
import { colors, radius } from "../theme";

export function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { data, error: apiError } = await login(email.trim(), password);
      if (apiError || !data) {
        // Backend returns 503 when Supabase is not configured.
        if (apiError?.includes("503") || apiError?.toLowerCase().includes("not configured")) {
          setError("Auth service is not configured. Running in demo mode — login bypassed.");
          // Bypass login gracefully in demo mode.
          await signIn({ id: "demo", email: email.trim() || "demo@checkpoint.app" }, "demo-token");
          setAuthToken("demo-token");
        } else {
          setError(apiError ?? "Login failed. Please check your credentials.");
        }
      } else {
        await signIn(data.user, data.session.access_token);
        setAuthToken(data.session.access_token);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={s.header}>
            <View style={s.logoWrap}>
              <Feather name="bookmark" size={32} color={colors.primaryForeground} />
            </View>
            <Text style={s.appName}>Checkpoint</Text>
            <Text style={s.tagline}>Cognitive continuity for nurses</Text>
          </View>

          {/* Form card */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Sign in</Text>
            <Text style={s.cardSub}>Use your hospital credentials to continue.</Text>

            {error && (
              <View style={s.errorBanner}>
                <Feather name="alert-circle" size={16} color={colors.destructive} />
                <Text style={s.errorText}>{error}</Text>
              </View>
            )}

            <View style={s.fieldGroup}>
              <Text style={s.label}>Email</Text>
              <TextInput
                style={s.input}
                placeholder="nurse@hospital.org"
                placeholderTextColor={colors.mutedForeground}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                editable={!loading}
              />
            </View>

            <View style={s.fieldGroup}>
              <Text style={s.label}>Password</Text>
              <View style={s.passwordWrap}>
                <TextInput
                  style={[s.input, s.passwordInput]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.mutedForeground}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={s.eyeBtn}
                  onPress={() => setShowPassword((v) => !v)}
                  activeOpacity={0.7}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={18}
                    color={colors.mutedForeground}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[s.signInBtn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.primaryForeground} />
              ) : (
                <Text style={s.signInBtnText}>Sign in</Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={s.footer}>Secure clinical workflow tool</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 24, paddingBottom: 40 },
  header: { alignItems: "center", marginBottom: 36 },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  appName: { fontSize: 28, fontWeight: "700", color: colors.foreground, marginBottom: 4 },
  tagline: { fontSize: 15, color: colors.mutedForeground },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  cardTitle: { fontSize: 22, fontWeight: "600", color: colors.foreground, marginBottom: 4 },
  cardSub: { fontSize: 14, color: colors.mutedForeground, marginBottom: 20 },
  errorBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#FFF0F0",
    borderWidth: 1,
    borderColor: "#FFCDD2",
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { flex: 1, fontSize: 13, color: colors.destructive, lineHeight: 18 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "500", color: colors.foreground, marginBottom: 8 },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.foreground,
  },
  passwordWrap: { position: "relative" },
  passwordInput: { paddingRight: 48 },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  signInBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  signInBtnText: { color: colors.primaryForeground, fontSize: 16, fontWeight: "600" },
  footer: { textAlign: "center", fontSize: 12, color: colors.mutedForeground },
});
