import React from "react";
import { Clock, ChevronRight } from "lucide-react";
import { StatusChip } from "./StatusChip";

export interface Patient {
  id: string;
  name: string;
  room: string;
  activeTask: string;
  status: "normal" | "interrupted" | "high-risk";
  checkpointTime: string;
  allergy?: string;
}

interface PatientCardProps {
  patient: Patient;
  onClick?: () => void;
}

export function PatientCard({ patient, onClick }: PatientCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-card rounded-2xl p-5 shadow-sm border border-border text-left transition-shadow hover:shadow-md active:shadow-none"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-foreground">{patient.name}</h3>
          <p className="text-muted-foreground mt-0.5">{patient.room}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground mt-1" />
      </div>
      <p className="text-foreground/80 mb-3">
        Active Task: {patient.activeTask}
      </p>
      <div className="flex items-center justify-between">
        <StatusChip status={patient.status} />
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{patient.checkpointTime}</span>
        </div>
      </div>
    </button>
  );
}
