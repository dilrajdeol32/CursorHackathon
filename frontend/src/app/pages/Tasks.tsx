import React from "react";
import { useNavigate } from "react-router";
import { Clock, Pill, Droplets, Activity, Bandage } from "lucide-react";
import { StatusChip } from "../components/StatusChip";
import { usePatients } from "../hooks/usePatients";
import { getTaskListItem } from "../../lib/patients";

function getTaskIcon(taskName: string) {
  if (/insulin|metformin|metoprolol|warfarin/i.test(taskName)) {
    return Pill;
  }

  if (/iv/i.test(taskName)) {
    return Droplets;
  }

  if (/vitals|pressure/i.test(taskName)) {
    return Activity;
  }

  return Bandage;
}

export function Tasks() {
  const navigate = useNavigate();
  const { data, loading, error } = usePatients();
  const tasks = (data ?? []).map(getTaskListItem);

  return (
    <div className="pb-28 px-5 pt-6">
      <h1 className="text-foreground mb-2">Active Tasks</h1>
      <p className="text-muted-foreground mb-6">
        {loading ? "Loading active tasks..." : `${tasks.length} tasks derived from medications`}
      </p>

      {error ? (
        <div className="mb-4 rounded-2xl bg-[#FFEBEE] px-4 py-3 text-[#C62828]">
          Unable to load tasks from the backend: {error}
        </div>
      ) : null}

      <div className="space-y-4">
        {tasks.map((task) => {
          const Icon = getTaskIcon(task.task);

          return (
            <button
              key={task.id}
              onClick={() => navigate(`/patient/${task.patientId}`)}
              className="w-full bg-card rounded-2xl p-5 shadow-sm border border-border text-left transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
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
                      <span>
                        {task.time} · {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
