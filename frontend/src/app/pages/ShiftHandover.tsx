import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, User, Clock, CheckCircle } from "lucide-react";
import { ExpandableCard } from "../components/ExpandableCard";
import { usePatients } from "../hooks/usePatients";
import {
  getCheckpointCount,
  getPatientNote,
  getPatientStatus,
  getPrimaryMedication,
} from "../../lib/patients";

export function ShiftHandover() {
  const navigate = useNavigate();
  const { data: patients, loading, error } = usePatients();
  const checkpointTotal =
    patients?.reduce(
      (count, patient) => count + getCheckpointCount(getPatientStatus(patient)),
      0
    ) ?? 0;
  const incompleteCount =
    patients?.filter((patient) => getPatientStatus(patient) !== "normal").length ?? 0;
  const stableCount =
    patients?.filter((patient) => getPatientStatus(patient) === "normal").length ?? 0;

  return (
    <div className="pb-36 px-5 pt-6 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <h1 className="text-foreground mb-6">Shift Handover</h1>

      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-foreground">Current Nurse</p>
              <p className="text-muted-foreground">Outgoing — Day Shift</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>19:00</span>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-3 border-t border-border">
          <div className="w-10 h-10 rounded-full bg-[#5BA8A0]/10 flex items-center justify-center">
            <User className="w-5 h-5 text-[#5BA8A0]" />
          </div>
          <div>
            <p className="text-foreground">Incoming Nurse</p>
            <p className="text-muted-foreground">Review generated from backend patient list</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#FFF3E0] rounded-xl p-3 text-center">
          <p className="text-2xl text-[#E65100]">{checkpointTotal}</p>
          <p className="text-[#E65100]">Checkpoints</p>
        </div>
        <div className="bg-[#FFEBEE] rounded-xl p-3 text-center">
          <p className="text-2xl text-[#C62828]">{incompleteCount}</p>
          <p className="text-[#C62828]">Incomplete</p>
        </div>
        <div className="bg-[#E8F5E9] rounded-xl p-3 text-center">
          <p className="text-2xl text-[#2E7D32]">{stableCount}</p>
          <p className="text-[#2E7D32]">Stable</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-card border border-border px-4 py-5 text-muted-foreground">
          Building handover from backend data...
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl bg-[#FFEBEE] px-4 py-3 text-[#C62828]">
          Unable to build handover: {error}
        </div>
      ) : null}

      <div className="space-y-4">
        {(patients ?? []).map((patient) => {
          const status = getPatientStatus(patient);
          const checkpointCount = getCheckpointCount(status);

          return (
            <ExpandableCard
              key={patient.patient_id}
              title={`${patient.name} — Room ${patient.room_number}`}
            >
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground mb-1">Unresolved Checkpoints</p>
                  <p className="text-foreground">{checkpointCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Incomplete Tasks</p>
                  <p className="text-foreground">{getPrimaryMedication(patient)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Medication Events</p>
                  <p className="text-foreground">{patient.medications.join(", ")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Notes</p>
                  <p className="text-foreground">{getPatientNote(patient)}</p>
                </div>
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <p className="text-primary mb-1">AI Summary</p>
                  <p className="text-foreground">
                    {status === "high-risk"
                      ? "Prioritize reassessment before resume."
                      : status === "interrupted"
                        ? "Resume with a quick recheck of allergies and orders."
                        : "Patient appears stable in the current mock dataset."}
                  </p>
                </div>
              </div>
            </ExpandableCard>
          );
        })}
      </div>

      <div className="fixed bottom-24 left-0 right-0 px-5 max-w-lg mx-auto">
        <button className="w-full bg-primary text-primary-foreground py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Approve Handover
        </button>
      </div>
    </div>
  );
}
