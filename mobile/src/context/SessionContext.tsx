import React, { createContext, useContext, useState, useCallback } from "react";

export type MedicationEvent = {
  medication: string;
  dosage: string;
  timestamp: string;
};

type SessionState = {
  activePatientId: string | null;
  activePatientName: string | null;
  completedTaskIds: string[];
  medicationEvents: Record<string, MedicationEvent>;
  startSession: (patientId: string, patientName: string) => void;
  completeTask: (patientId: string) => void;
  recordMedication: (patientId: string, medication: string, dosage: string) => void;
  clearSession: () => void;
};

const SessionContext = createContext<SessionState>({
  activePatientId: null,
  activePatientName: null,
  completedTaskIds: [],
  medicationEvents: {},
  startSession: () => {},
  completeTask: () => {},
  recordMedication: () => {},
  clearSession: () => {},
});

export const useSession = () => useContext(SessionContext);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [activePatientId, setActivePatientId] = useState<string | null>(null);
  const [activePatientName, setActivePatientName] = useState<string | null>(null);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [medicationEvents, setMedicationEvents] = useState<Record<string, MedicationEvent>>({});

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

  const recordMedication = useCallback((patientId: string, medication: string, dosage: string) => {
    setMedicationEvents((prev) => ({
      ...prev,
      [patientId]: { medication, dosage, timestamp: new Date().toISOString() },
    }));
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
        medicationEvents,
        startSession,
        completeTask,
        recordMedication,
        clearSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
