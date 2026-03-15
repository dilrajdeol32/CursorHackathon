import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Mic, MicOff, X, Pencil } from "lucide-react";
import { ValidationField } from "../components/ValidationField";

const patientNames: Record<string, string> = {
  "1": "Mr. Patel",
  "2": "Mrs. Johnson",
  "3": "Mr. Garcia",
  "4": "Ms. Chen",
  "5": "Mr. Thompson",
  "6": "Mrs. Williams",
};

const patientRooms: Record<string, string> = {
  "1": "204",
  "2": "208",
  "3": "211",
  "4": "215",
  "5": "219",
  "6": "222",
};

export function CheckpointCapture() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showFields, setShowFields] = useState(false);

  const name = patientNames[id || "1"] || "Mr. Patel";
  const room = patientRooms[id || "1"] || "204";

  // Simulated recording
  useEffect(() => {
    if (!recording) return;
    const words = `${name}, room ${room}, metoprolol 25 milligrams, bed alarm.`.split(" ");
    let i = 0;
    const interval = setInterval(() => {
      if (i < words.length) {
        setTranscript((prev) => (prev ? prev + " " : "") + words[i]);
        i++;
      } else {
        setRecording(false);
        setShowFields(true);
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [recording, name, room]);

  const handleRecord = () => {
    if (!recording) {
      setTranscript("");
      setShowFields(false);
      setRecording(true);
    } else {
      setRecording(false);
      setShowFields(true);
    }
  };

  return (
    <div className="pb-28 px-5 pt-6 min-h-screen">
      {/* Header */}
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

      {/* Voice Capture Orb */}
      <div className="flex flex-col items-center my-10">
        <button
          onClick={handleRecord}
          className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            recording
              ? "bg-[#E54D4D] scale-110 animate-pulse"
              : "bg-primary"
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

      {/* Transcript */}
      {transcript && (
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-6">
          <p className="text-muted-foreground mb-2">Transcript</p>
          <p className="text-foreground italic">"{transcript}"</p>
        </div>
      )}

      {/* Extracted Fields */}
      {showFields && (
        <div className="bg-card rounded-2xl shadow-sm border border-border p-5 mb-6">
          <h4 className="text-foreground mb-3">Extracted Fields</h4>
          <ValidationField label="Patient" value={name} status="confirmed" />
          <ValidationField label="Room" value={room} status="confirmed" />
          <ValidationField label="Medication" value="Metoprolol" status="confirmed" />
          <ValidationField label="Dosage" value="25mg" status="uncertain" />
          <ValidationField label="Interruption" value="Bed Alarm" status="confirmed" />
        </div>
      )}

      {/* Bottom Actions */}
      {showFields && (
        <div className="fixed bottom-24 left-0 right-0 px-5 max-w-lg mx-auto">
          <button
            onClick={() => {
              navigate(-1);
            }}
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
      )}
    </div>
  );
}
