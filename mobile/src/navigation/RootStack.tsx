import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomTabs } from "./BottomTabs";
import { PatientContextScreen } from "../screens/PatientContextScreen";
import { ResumeTaskScreen } from "../screens/ResumeTaskScreen";
import { ShiftHandoverScreen } from "../screens/ShiftHandoverScreen";
import { CheckpointCaptureScreen } from "../screens/CheckpointCaptureScreen";
import { BarcodeScannerScreen } from "../screens/BarcodeScannerScreen";

export type RootStackParamList = {
  Tabs: undefined;
  PatientContext: { id: string };
  ResumeTask: { id: string };
  ShiftHandover: undefined;
  CaptureWithId: { id: string };
  BarcodeScanner: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={BottomTabs} />
      <Stack.Screen name="PatientContext" component={PatientContextScreen} />
      <Stack.Screen name="ResumeTask" component={ResumeTaskScreen} />
      <Stack.Screen name="ShiftHandover" component={ShiftHandoverScreen} />
      <Stack.Screen name="CaptureWithId" component={CheckpointCaptureScreen} />
      <Stack.Screen
        name="BarcodeScanner"
        component={BarcodeScannerScreen}
        options={{ presentation: "fullScreenModal", animation: "slide_from_bottom" }}
      />
    </Stack.Navigator>
  );
}
