import React, { createContext, useContext, useState, useCallback } from "react";

type SessionState = {
  activePatientId: string | null;
  activePatientName: string | null;
  completedTaskIds: string[];
  startSession: (patientId: string, patientName: string) => void;
  completeTask: (patientId: string) => void;
  clearSession: () => void;
};

const SessionContext = createContext<SessionState>({
  activePatientId: null,
  activePatientName: null,
  completedTaskIds: [],
  startSession: () => {},
  completeTask: () => {},
  clearSession: () => {},
});

export const useSession = () => useContext(SessionContext);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [activePatientId, setActivePatientId] = useState<string | null>(null);
  const [activePatientName, setActivePatientName] = useState<string | null>(null);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);

  const startSession = useCallback((patientId: string, patientName: string) => {
    setActivePatientId(patientId);
    setActivePatientName(patientName);
  }, []);

  const completeTask = useCallback((patientId: string) => {
    setCompletedTaskIds((prev) =>
      prev.includes(patientId) ? prev : [...prev, patientId]
    );
    setActivePatientId(null);
    setActivePatientName(null);
  }, []);

  const clearSession = useCallback(() => {
    setActivePatientId(null);
    setActivePatientName(null);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        activePatientId,
        activePatientName,
        completedTaskIds,
        startSession,
        completeTask,
        clearSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
