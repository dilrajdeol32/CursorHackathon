import React from "react";
import { useNavigate } from "react-router";
import { Search } from "lucide-react";
import { PatientCard, Patient } from "../components/PatientCard";

const patients: Patient[] = [
  {
    id: "1",
    name: "Mr. Patel",
    room: "Room 204",
    activeTask: "Metoprolol Administration",
    status: "interrupted",
    checkpointTime: "6 min ago",
    allergy: "Penicillin",
  },
  {
    id: "2",
    name: "Mrs. Johnson",
    room: "Room 208",
    activeTask: "IV Fluid Check",
    status: "normal",
    checkpointTime: "12 min ago",
  },
  {
    id: "3",
    name: "Mr. Garcia",
    room: "Room 211",
    activeTask: "Wound Dressing Change",
    status: "high-risk",
    checkpointTime: "22 min ago",
  },
  {
    id: "4",
    name: "Ms. Chen",
    room: "Room 215",
    activeTask: "Vitals Monitoring",
    status: "normal",
    checkpointTime: "3 min ago",
  },
  {
    id: "5",
    name: "Mr. Thompson",
    room: "Room 219",
    activeTask: "Insulin Administration",
    status: "interrupted",
    checkpointTime: "15 min ago",
  },
  {
    id: "6",
    name: "Mrs. Williams",
    room: "Room 222",
    activeTask: "Post-Op Assessment",
    status: "normal",
    checkpointTime: "8 min ago",
  },
];

export function PatientList() {
  const navigate = useNavigate();

  return (
    <div className="pb-28 px-5 pt-6">
      <h1 className="text-foreground mb-2">Patients</h1>
      <p className="text-muted-foreground mb-5">6 assigned this shift</p>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search patients..."
          className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Patient Cards */}
      <div className="space-y-4">
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onClick={() => navigate(`/patient/${patient.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
