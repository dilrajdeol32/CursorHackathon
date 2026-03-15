import React from "react";
import { useNavigate } from "react-router";
import { Clock, Pill, Droplets, Activity, Bandage } from "lucide-react";
import { StatusChip } from "../components/StatusChip";

const tasks = [
  {
    id: "1",
    patientId: "1",
    patient: "Mr. Patel",
    room: "Room 204",
    task: "Metoprolol Administration",
    icon: Pill,
    status: "interrupted" as const,
    time: "08:00",
    priority: "High",
  },
  {
    id: "2",
    patientId: "2",
    patient: "Mrs. Johnson",
    room: "Room 208",
    task: "IV Fluid Check",
    icon: Droplets,
    status: "normal" as const,
    time: "08:30",
    priority: "Normal",
  },
  {
    id: "3",
    patientId: "3",
    patient: "Mr. Garcia",
    room: "Room 211",
    task: "Wound Dressing Change",
    icon: Bandage,
    status: "high-risk" as const,
    time: "09:00",
    priority: "High",
  },
  {
    id: "4",
    patientId: "5",
    patient: "Mr. Thompson",
    room: "Room 219",
    task: "Insulin Administration",
    icon: Pill,
    status: "interrupted" as const,
    time: "08:15",
    priority: "High",
  },
];

export function Tasks() {
  const navigate = useNavigate();

  return (
    <div className="pb-28 px-5 pt-6">
      <h1 className="text-foreground mb-2">Active Tasks</h1>
      <p className="text-muted-foreground mb-6">4 tasks remaining</p>

      <div className="space-y-4">
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => navigate(`/patient/${task.patientId}`)}
            className="w-full bg-card rounded-2xl p-5 shadow-sm border border-border text-left transition-shadow hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <task.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-foreground mb-1">{task.task}</h4>
                <p className="text-muted-foreground">
                  {task.patient} &middot; {task.room}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <StatusChip status={task.status} />
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{task.time}</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
