import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Mic, MicOff, X, Pencil } from "lucide-react";
import { ValidationField } from "../components/ValidationField";
import { usePatient, usePatients } from "../hooks/usePatients";
import { getMedicationLabel, getPrimaryMedication } from "../../lib/patients";

export function CheckpointCapture() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showFields, setShowFields] = useState(false);
  const { data: patients } = usePatients();
  const fallbackPatientId = patients?.[0]?.patient_id;
  const activePatientId = id ?? fallbackPatientId;
  const { data: patient } = usePatient(activePatientId);

  const medication = useMemo(
    () => (patient ? getMedicationLabel(getPrimaryMedication(patient)) : "Medication review"),
    [patient]
  );
  const name = patient?.name ?? "Select a patient first";
  const room = patient?.room_number ?? "--";

  useEffect(() => {
    if (!recording) {
      return;
    }

    const words = `${name}, room ${room}, ${medication}, interruption noted.`.split(
      " "
    );
    let index = 0;
    const interval = setInterval(() => {
      if (index < words.length) {
        setTranscript((previous) => (previous ? `${previous} ${words[index]}` : words[index]));
        index += 1;
        return;
      }

      setRecording(false);
      setShowFields(true);
      clearInterval(interval);
    }, 300);

    return () => clearInterval(interval);
  }, [recording, medication, name, room]);

  function handleRecord() {
    if (!recording) {
      setTranscript("");
      setShowFields(false);
      setRecording(true);
      return;
    }

    setRecording(false);
    setShowFields(true);
  }

  return (
    <div className="pb-28 px-5 pt-6 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="text-center mb-2">
        <h1 className="text-foreground mb-1">Save Task Context</h1>
        <p className="text-muted-foreground">
          {name} &middot; Room {room}
        </p>
      </div>

      {!patient ? (
        <div className="mb-6 rounded-2xl bg-card border border-border px-4 py-5 text-muted-foreground">
          Pick a patient from the patient list first. This screen is ready for a future
          `/checkpoints` backend endpoint.
        </div>
      ) : null}

      <div className="flex flex-col items-center my-10">
        <button
          onClick={handleRecord}
          disabled={!patient}
          className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg disabled:opacity-50 ${
            recording ? "bg-[#E54D4D] scale-110 animate-pulse" : "bg-primary"
          }`}
        >
          {recording ? (
            <MicOff className="w-10 h-10 text-white" />
          ) : (
            <Mic className="w-10 h-10 text-white" />
          )}
        </button>
        <p className="text-muted-foreground mt-4">
          {recording ? "Listening..." : "Tap to record"}
        </p>
      </div>

      {transcript ? (
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-6">
          <p className="text-muted-foreground mb-2">Transcript</p>
          <p className="text-foreground italic">"{transcript}"</p>
        </div>
      ) : null}

      {showFields && patient ? (
        <div className="bg-card rounded-2xl shadow-sm border border-border p-5 mb-6">
          <h4 className="text-foreground mb-3">Extracted Fields</h4>
          <ValidationField label="Patient" value={patient.name} status="confirmed" />
          <ValidationField label="Room" value={patient.room_number} status="confirmed" />
          <ValidationField label="Medication" value={medication} status="confirmed" />
          <ValidationField
            label="Dosage"
            value={getPrimaryMedication(patient).match(/\d+\s?(?:mg|mL|mEq|g)/i)?.[0] ?? "Review order"}
            status="uncertain"
          />
          <ValidationField
            label="Interruption"
            value="Checkpoint API not yet connected"
            status="uncertain"
          />
        </div>
      ) : null}

      {showFields && patient ? (
        <div className="fixed bottom-24 left-0 right-0 px-5 max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl shadow-lg mb-3 active:scale-[0.98] transition-transform"
          >
            Save Checkpoint
          </button>
          <div className="flex gap-3">
            <button className="flex-1 bg-card border border-border text-foreground py-3 rounded-xl flex items-center justify-center gap-2">
              <Pencil className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-card border border-border text-muted-foreground py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
