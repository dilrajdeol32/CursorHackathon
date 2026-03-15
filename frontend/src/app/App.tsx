import React, { useMemo } from "react";
import { RouterProvider, createBrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { AuthenticatedLayout } from "./components/AuthenticatedLayout";
import { Dashboard } from "./pages/Dashboard";
import { PatientList } from "./pages/PatientList";
import { PatientContext } from "./pages/PatientContext";
import { CheckpointCapture } from "./pages/CheckpointCapture";
import { ResumeTask } from "./pages/ResumeTask";
import { ShiftHandover } from "./pages/ShiftHandover";
import { Analytics } from "./pages/Analytics";
import { Tasks } from "./pages/Tasks";
import { Login } from "./pages/Login";

export default function App() {
  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: "/login",
          Component: Login,
        },
        {
          path: "/",
          Component: AuthenticatedLayout,
          children: [
            { index: true, Component: Dashboard },
            { path: "patients", Component: PatientList },
            { path: "patient/:id", Component: PatientContext },
            { path: "capture/:id", Component: CheckpointCapture },
            { path: "resume/:id", Component: ResumeTask },
            { path: "tasks", Component: Tasks },
            { path: "checkpoint", Component: CheckpointCapture },
            { path: "handover", Component: ShiftHandover },
            { path: "analytics", Component: Analytics },
          ],
        },
      ]),
    []
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
