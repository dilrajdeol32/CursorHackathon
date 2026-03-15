import type { BackendPatient, PatientStatus } from "./types";

export interface PatientListItem {
  id: string;
  name: string;
  room: string;
  activeTask: string;
  status: PatientStatus;
  checkpointTime: string;
  allergy?: string;
}

export interface TaskListItem {
  id: string;
  patientId: string;
  patient: string;
  room: string;
  task: string;
  status: PatientStatus;
  time: string;
  priority: "Normal" | "High";
}

const checkpointMinutes = [4, 7, 11, 15, 18, 22];
const taskTimes = ["08:00", "08:15", "08:30", "09:00", "09:15", "09:30"];

function getSystolicPressure(bloodPressure: string) {
  const [systolic] = bloodPressure.split("/");
  return Number.parseInt(systolic ?? "0", 10);
}

export function getPrimaryMedication(patient: BackendPatient) {
  return patient.medications[0] ?? "Patient follow-up";
}

export function getMedicationLabel(medication: string) {
  return medication.split(",")[0]?.trim() || medication;
}

export function getPatientStatus(patient: BackendPatient): PatientStatus {
  const systolic = getSystolicPressure(patient.latest_vitals.blood_pressure);

  if (
    patient.latest_vitals.temp_c >= 37.2 ||
    systolic >= 140 ||
    patient.latest_vitals.heart_rate >= 85
  ) {
    return "high-risk";
  }

  if (patient.allergies.length > 1 || patient.latest_vitals.resp_rate >= 16) {
    return "interrupted";
  }

  return "normal";
}

export function getCheckpointCount(status: PatientStatus) {
  if (status === "high-risk") {
    return 2;
  }

  if (status === "interrupted") {
    return 1;
  }

  return 0;
}

export function getPatientListItem(
  patient: BackendPatient,
  index: number
): PatientListItem {
  const status = getPatientStatus(patient);

  return {
    id: patient.patient_id,
    name: patient.name,
    room: `Room ${patient.room_number}`,
    activeTask: getMedicationLabel(getPrimaryMedication(patient)),
    status,
    checkpointTime: `${checkpointMinutes[index % checkpointMinutes.length]} min ago`,
    allergy: patient.allergies[0],
  };
}

export function getTaskListItem(patient: BackendPatient, index: number): TaskListItem {
  const status = getPatientStatus(patient);

  return {
    id: `${patient.patient_id}-task`,
    patientId: patient.patient_id,
    patient: patient.name,
    room: `Room ${patient.room_number}`,
    task: getMedicationLabel(getPrimaryMedication(patient)),
    status,
    time: taskTimes[index % taskTimes.length],
    priority: status === "normal" ? "Normal" : "High",
  };
}

export function getPatientNote(patient: BackendPatient) {
  const status = getPatientStatus(patient);

  if (status === "high-risk") {
    return `Prioritize reassessment. Latest vitals show BP ${patient.latest_vitals.blood_pressure} and temp ${patient.latest_vitals.temp_c} C.`;
  }

  if (patient.allergies.length > 0) {
    return `Review allergies before continuing: ${patient.allergies.join(", ")}.`;
  }

  return "No active alerts noted in the current mock dataset.";
}

export function getResumeRiskLevel(
  patient: BackendPatient
): "Low" | "Medium" | "High" {
  const status = getPatientStatus(patient);

  if (status === "high-risk") {
    return "High";
  }

  if (status === "interrupted") {
    return "Medium";
  }

  return "Low";
}
