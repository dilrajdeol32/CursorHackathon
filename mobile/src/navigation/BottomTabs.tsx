import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./RootStack";
import { colors } from "../theme";
import { DashboardScreen } from "../screens/DashboardScreen";
import { PatientListScreen } from "../screens/PatientListScreen";
import { CheckpointCaptureScreen } from "../screens/CheckpointCaptureScreen";
import { TasksScreen } from "../screens/TasksScreen";
import { AnalyticsScreen } from "../screens/AnalyticsScreen";

const Tab = createBottomTabNavigator();

function CheckpointButton({ onPress }: { onPress?: (e?: any) => void }) {
  return (
    <TouchableOpacity style={styles.checkpointBtn} onPress={onPress} activeOpacity={0.8}>
      <Feather name="bookmark" size={28} color={colors.primaryForeground} />
    </TouchableOpacity>
  );
}

function ScanFAB() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <TouchableOpacity
      style={styles.scanFab}
      onPress={() => navigation.navigate("BarcodeScanner")}
      activeOpacity={0.8}
    >
      <Feather name="maximize" size={20} color="#FFF" />
    </TouchableOpacity>
  );
}

export function BottomTabs() {
  return (
    <View style={{ flex: 1 }}>
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Patients"
        component={PatientListScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="users" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Checkpoint"
        component={CheckpointCaptureScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => null,
          tabBarButton: (props) => <CheckpointButton onPress={props.onPress} />,
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="check-square" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
    <ScanFAB />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    height: 85,
    paddingBottom: 20,
    paddingTop: 8,
  },
  checkpointBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  scanFab: {
    position: "absolute",
    top: 58,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
});
