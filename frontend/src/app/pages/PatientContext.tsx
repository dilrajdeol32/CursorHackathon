import React from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, AlertTriangle, Pill, Activity, Bookmark, StickyNote, ListChecks } from "lucide-react";
import { ExpandableCard } from "../components/ExpandableCard";
import { StatusChip } from "../components/StatusChip";

const patientData: Record<string, any> = {
  "1": {
    name: "Mr. Patel",
    room: "Room 204",
    allergy: "Penicillin",
    status: "interrupted",
    hasCheckpoint: true,
    currentTask: {
      title: "Metoprolol Administration",
      details: "25mg oral, scheduled for 08:00",
      status: "Interrupted — Bed alarm in Room 206",
    },
    medication: {
      name: "Metoprolol Tartrate",
      dose: "25mg",
      route: "Oral",
      frequency: "Twice daily",
      lastGiven: "Yesterday 20:00",
    },
    vitals: {
      bp: "138/82 mmHg",
      hr: "76 bpm",
      temp: "37.1°C",
      spo2: "97%",
      time: "07:45",
    },
    checkpoints: 1,
    notes: "Patient reports mild dizziness this morning. Monitor BP closely.",
  },
  "2": {
    name: "Mrs. Johnson",
    room: "Room 208",
    allergy: null,
    status: "normal",
    hasCheckpoint: false,
    currentTask: { title: "IV Fluid Check", details: "Normal Saline 1000ml at 125ml/hr", status: "In Progress" },
    medication: { name: "Normal Saline", dose: "1000ml", route: "IV", frequency: "Continuous", lastGiven: "Running" },
    vitals: { bp: "120/78 mmHg", hr: "68 bpm", temp: "36.8°C", spo2: "99%", time: "07:30" },
    checkpoints: 0,
    notes: "Stable. Scheduled for discharge assessment at 14:00.",
  },
  "3": {
    name: "Mr. Garcia",
    room: "Room 211",
    allergy: "Latex",
    status: "high-risk",
    hasCheckpoint: true,
    currentTask: { title: "Wound Dressing Change", details: "Surgical site, left knee", status: "Interrupted — Code Blue nearby" },
    medication: { name: "Cefazolin", dose: "1g", route: "IV", frequency: "Q8h", lastGiven: "06:00" },
    vitals: { bp: "145/90 mmHg", hr: "88 bpm", temp: "37.8°C", spo2: "95%", time: "07:15" },
    checkpoints: 2,
    notes: "Elevated temp, possible infection. Wound culture pending.",
  },
};

export function PatientContext() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patient = patientData[id || "1"] || patientData["1"];

  return (
    <div className="pb-28 px-5 pt-6">
      {/* Sticky Header */}
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
            <p className="text-muted-foreground mt-0.5">{patient.room}</p>
          </div>
          <StatusChip status={patient.status} />
        </div>
        {patient.allergy && (
          <div className="flex items-center gap-2 mt-3 bg-[#FFEBEE] text-[#C62828] px-3 py-2 rounded-xl">
            <AlertTriangle className="w-4 h-4" />
            <span>Allergy: {patient.allergy}</span>
          </div>
        )}
      </div>

      {/* Expandable Cards */}
      <div className="space-y-4 mt-4">
        <ExpandableCard
          title="Current Task"
          icon={<ListChecks className="w-5 h-5" />}
          defaultExpanded={true}
        >
          <div className="space-y-2">
            <p className="text-foreground">{patient.currentTask.title}</p>
            <p className="text-muted-foreground">{patient.currentTask.details}</p>
            <p className="text-[#E5A84D]">{patient.currentTask.status}</p>
          </div>
        </ExpandableCard>

        <ExpandableCard
          title="Medication Context"
          icon={<Pill className="w-5 h-5" />}
        >
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Medication</span>
              <span className="text-foreground">{patient.medication.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dose</span>
              <span className="text-foreground">{patient.medication.dose}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Route</span>
              <span className="text-foreground">{patient.medication.route}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Frequency</span>
              <span className="text-foreground">{patient.medication.frequency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Given</span>
              <span className="text-foreground">{patient.medication.lastGiven}</span>
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
              <span className="text-foreground">{patient.vitals.bp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Heart Rate</span>
              <span className="text-foreground">{patient.vitals.hr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Temperature</span>
              <span className="text-foreground">{patient.vitals.temp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SpO2</span>
              <span className="text-foreground">{patient.vitals.spo2}</span>
            </div>
            <p className="text-muted-foreground pt-1">Recorded at {patient.vitals.time}</p>
          </div>
        </ExpandableCard>

        <ExpandableCard
          title={`Open Checkpoints (${patient.checkpoints})`}
          icon={<Bookmark className="w-5 h-5" />}
        >
          {patient.checkpoints > 0 ? (
            <p className="text-foreground">
              {patient.checkpoints} checkpoint{patient.checkpoints > 1 ? "s" : ""} saved.
              Tap Resume Task to restore context.
            </p>
          ) : (
            <p className="text-muted-foreground">No open checkpoints.</p>
          )}
        </ExpandableCard>

        <ExpandableCard
          title="Notes"
          icon={<StickyNote className="w-5 h-5" />}
        >
          <p className="text-foreground">{patient.notes}</p>
        </ExpandableCard>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-24 left-0 right-0 px-5 max-w-lg mx-auto">
        {patient.hasCheckpoint ? (
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
