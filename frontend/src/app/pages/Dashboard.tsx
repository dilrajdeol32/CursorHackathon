import React from "react";
import { useNavigate } from "react-router";
import {
  Users,
  ListChecks,
  Bookmark,
  ArrowRightLeft,
  Clock,
  Sun,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePatients } from "../hooks/usePatients";
import {
  getCheckpointCount,
  getPatientStatus,
  getTaskListItem,
} from "../../lib/patients";

export function Dashboard() {
  const navigate = useNavigate();
  const { nurse, logout } = useAuth();
  const { data: patients, loading, error } = usePatients();

  const taskCount = patients?.map(getTaskListItem).length ?? 0;
  const checkpointCount =
    patients?.reduce(
      (count, patient) => count + getCheckpointCount(getPatientStatus(patient)),
      0
    ) ?? 0;
  const highRiskCount =
    patients?.filter((patient) => getPatientStatus(patient) === "high-risk")
      .length ?? 0;

  const cards = [
    {
      title: "Assigned Patients",
      count: patients?.length ?? 0,
      preview:
        loading || error
          ? "Waiting for patient data"
          : `${highRiskCount} need attention`,
      icon: Users,
      color: "bg-primary/10 text-primary",
      path: "/patients",
    },
    {
      title: "Active Tasks",
      count: taskCount,
      preview: loading || error ? "Task feed unavailable" : "Synced from patient meds",
      icon: ListChecks,
      color: "bg-[#5BA8A0]/10 text-[#5BA8A0]",
      path: "/tasks",
    },
    {
      title: "Unresolved Checkpoints",
      count: checkpointCount,
      preview:
        loading || error
          ? "Checkpoint API not live yet"
          : `${highRiskCount} high risk in current mock data`,
      icon: Bookmark,
      color: "bg-[#E5A84D]/10 text-[#E5A84D]",
      path: "/checkpoint",
    },
    {
      title: "Shift Handover",
      count: highRiskCount,
      preview: "Built from current patient summary",
      icon: ArrowRightLeft,
      color: "bg-[#7B6BD9]/10 text-[#7B6BD9]",
      path: "/handover",
    },
  ];

  return (
    <div className="pb-28 px-5 pt-6">
      <div className="mb-8">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-[#E5A84D]">
            <Sun className="w-5 h-5" />
            <span className="text-muted-foreground">Good Morning</span>
          </div>
          <button
            onClick={logout}
            className="text-sm text-muted-foreground border border-border rounded-full px-3 py-1.5"
          >
            Sign out
          </button>
        </div>
        <h1 className="text-foreground mb-1">
          Hello, {nurse?.email?.split("@")[0] || "Nurse"}
        </h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Day Shift
          </span>
          <span>{loading ? "Loading..." : `${patients?.length ?? 0} Patients`}</span>
        </div>
      </div>

      {error ? (
        <div className="mb-5 rounded-2xl bg-[#FFEBEE] px-4 py-3 text-[#C62828]">
          Unable to load patients from the backend: {error}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4">
        {cards.map((card) => (
          <button
            key={card.title}
            onClick={() => navigate(card.path)}
            className="bg-card rounded-2xl p-5 shadow-sm border border-border text-left transition-shadow hover:shadow-md active:shadow-none"
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${card.color}`}
            >
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-3xl text-foreground mb-1">{card.count}</p>
            <h4 className="text-foreground mb-1">{card.title}</h4>
            <p className="text-muted-foreground">{card.preview}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
