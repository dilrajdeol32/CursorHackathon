import React from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  AlertTriangle,
  Pill,
  Activity,
  Bookmark,
  StickyNote,
  ListChecks,
} from "lucide-react";
import { ExpandableCard } from "../components/ExpandableCard";
import { StatusChip } from "../components/StatusChip";
import { usePatient } from "../hooks/usePatients";
import {
  getCheckpointCount,
  getMedicationLabel,
  getPatientNote,
  getPatientStatus,
  getPrimaryMedication,
} from "../../lib/patients";

export function PatientContext() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: patient, loading, error } = usePatient(id);

  if (loading) {
    return (
      <div className="pb-28 px-5 pt-6 text-muted-foreground">
        Loading patient context...
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="pb-28 px-5 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="rounded-2xl bg-[#FFEBEE] px-4 py-3 text-[#C62828]">
          Unable to load that patient: {error ?? "Patient not found"}
        </div>
      </div>
    );
  }

  const status = getPatientStatus(patient);
  const primaryMedication = getPrimaryMedication(patient);
  const checkpointCount = getCheckpointCount(status);
  const hasCheckpoint = checkpointCount > 0;
  const routeLabel =
    / IV /i.test(primaryMedication) ? "IV" : / PO /i.test(primaryMedication) ? "PO" : "Review MAR";
  const doseLabel =
    primaryMedication.match(/\d+\s?(?:mg|mL|mEq|g)/i)?.[0] ?? "Review order";
  const frequencyLabel = primaryMedication.split(/ IV | PO /i)[1] ?? "Per order";

  return (
    <div className="pb-28 px-5 pt-6">
      <div className="sticky top-0 bg-background z-10 pb-4 -mx-5 px-5 pt-1">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-foreground">{patient.name}</h1>
            <p className="text-muted-foreground mt-0.5">Room {patient.room_number}</p>
          </div>
          <StatusChip status={status} />
        </div>
        {patient.allergies[0] ? (
          <div className="flex items-center gap-2 mt-3 bg-[#FFEBEE] text-[#C62828] px-3 py-2 rounded-xl">
            <AlertTriangle className="w-4 h-4" />
            <span>Allergy: {patient.allergies.join(", ")}</span>
          </div>
        ) : null}
      </div>

      <div className="space-y-4 mt-4">
        <ExpandableCard
          title="Current Task"
          icon={<ListChecks className="w-5 h-5" />}
          defaultExpanded={true}
        >
          <div className="space-y-2">
            <p className="text-foreground">{getMedicationLabel(primaryMedication)}</p>
            <p className="text-muted-foreground">{primaryMedication}</p>
            <p className="text-[#E5A84D]">
              {hasCheckpoint
                ? "Resume with re-verification before continuing."
                : "In progress from current mock patient dataset."}
            </p>
          </div>
        </ExpandableCard>

        <ExpandableCard
          title="Medication Context"
          icon={<Pill className="w-5 h-5" />}
        >
          <div className="space-y-2">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Medication</span>
              <span className="text-foreground text-right">
                {getMedicationLabel(primaryMedication)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Dose</span>
              <span className="text-foreground text-right">{doseLabel}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Route</span>
              <span className="text-foreground text-right">{routeLabel}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Frequency</span>
              <span className="text-foreground text-right">{frequencyLabel}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Last Given</span>
              <span className="text-foreground text-right">See active medication record</span>
            </div>
          </div>
        </ExpandableCard>

        <ExpandableCard
          title="Recent Vitals"
          icon={<Activity className="w-5 h-5" />}
        >
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Blood Pressure</span>
              <span className="text-foreground">
                {patient.latest_vitals.blood_pressure} mmHg
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Heart Rate</span>
              <span className="text-foreground">{patient.latest_vitals.heart_rate} bpm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Temperature</span>
              <span className="text-foreground">{patient.latest_vitals.temp_c} C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SpO2</span>
              <span className="text-foreground">{patient.latest_vitals.spo2}%</span>
            </div>
            <p className="text-muted-foreground pt-1">
              Resp Rate {patient.latest_vitals.resp_rate} bpm
            </p>
          </div>
        </ExpandableCard>

        <ExpandableCard
          title={`Open Checkpoints (${checkpointCount})`}
          icon={<Bookmark className="w-5 h-5" />}
        >
          {checkpointCount > 0 ? (
            <p className="text-foreground">
              {checkpointCount} checkpoint{checkpointCount > 1 ? "s" : ""} inferred from the
              current risk state. Tap Resume Task to restore context.
            </p>
          ) : (
            <p className="text-muted-foreground">No open checkpoints.</p>
          )}
        </ExpandableCard>

        <ExpandableCard
          title="Notes"
          icon={<StickyNote className="w-5 h-5" />}
        >
          <p className="text-foreground">{getPatientNote(patient)}</p>
        </ExpandableCard>
      </div>

      <div className="fixed bottom-24 left-0 right-0 px-5 max-w-lg mx-auto">
        {hasCheckpoint ? (
          <button
            onClick={() => navigate(`/resume/${id}`)}
            className="w-full bg-[#5BA8A0] text-white py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-transform"
          >
            Resume Task
          </button>
        ) : (
          <button
            onClick={() => navigate(`/capture/${id}`)}
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-transform"
          >
            Create Checkpoint
          </button>
        )}
      </div>
    </div>
  );
}
