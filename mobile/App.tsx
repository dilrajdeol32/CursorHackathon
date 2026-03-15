import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { RootStack } from "./src/navigation/RootStack";
import { SessionProvider } from "./src/context/SessionContext";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { setAuthToken } from "./src/api/client";

// Syncs the stored auth token into the API client whenever auth state changes.
function TokenSync() {
  const { token } = useAuth();
  useEffect(() => {
    setAuthToken(token);
  }, [token]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <SessionProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <TokenSync />
            <RootStack />
            <StatusBar style="dark" />
          </NavigationContainer>
        </SafeAreaProvider>
      </SessionProvider>
    </AuthProvider>
  );
}
