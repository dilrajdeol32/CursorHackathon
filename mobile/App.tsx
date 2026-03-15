import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { getHealth, getPatients, testDb } from "./src/api/client";
import { API_BASE_URL } from "./src/config/api";

type Result = { label: string; data: unknown | null; error: string | null };

export default function App() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  const run = async (label: string, fn: () => Promise<{ data: unknown; error: string | null }>) => {
    setLoading(true);
    const res = await fn();
    setResults((prev) => [{ label, ...res }, ...prev]);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Checkpoint API Smoke Test</Text>
        <Text style={styles.subtitle}>Backend: {API_BASE_URL}</Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.btn} onPress={() => run("GET /health", getHealth)}>
            <Text style={styles.btnText}>/health</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={() => run("GET /patients", getPatients)}>
            <Text style={styles.btnText}>/patients</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={() => run("GET /test/test-db", testDb)}>
            <Text style={styles.btnText}>/test/test-db</Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator size="large" style={{ marginTop: 16 }} />}

        <ScrollView style={styles.log}>
          {results.map((r, i) => (
            <View key={i} style={[styles.card, r.error ? styles.cardError : styles.cardOk]}>
              <Text style={styles.cardTitle}>{r.label}</Text>
              {r.error ? (
                <Text style={styles.errorText}>{r.error}</Text>
              ) : (
                <Text style={styles.dataText}>{JSON.stringify(r.data, null, 2)}</Text>
              )}
            </View>
          ))}
        </ScrollView>

        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f7fa" },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center", marginTop: 8 },
  subtitle: { fontSize: 13, color: "#888", textAlign: "center", marginBottom: 16 },
  buttons: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  btn: {
    flex: 1,
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  log: { marginTop: 16, flex: 1 },
  card: { borderRadius: 8, padding: 12, marginBottom: 10 },
  cardOk: { backgroundColor: "#e0f2e9" },
  cardError: { backgroundColor: "#fce4e4" },
  cardTitle: { fontWeight: "700", marginBottom: 4 },
  dataText: { fontSize: 12, fontFamily: "Courier", color: "#333" },
  errorText: { fontSize: 13, color: "#b91c1c" },
});
