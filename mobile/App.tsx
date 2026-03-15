import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { RootStack } from "./src/navigation/RootStack";

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack />
        <StatusBar style="dark" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
