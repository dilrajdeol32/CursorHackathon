import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
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

export function BottomTabs() {
  return (
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
});
