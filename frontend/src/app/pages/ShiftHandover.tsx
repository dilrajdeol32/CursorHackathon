import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, User, Clock, CheckCircle } from "lucide-react";
import { ExpandableCard } from "../components/ExpandableCard";
import { StatusChip } from "../components/StatusChip";

const handoverPatients = [
  {
    name: "Mr. Patel",
    room: "Room 204",
    unresolvedCheckpoints: 1,
    incompleteTasks: "Metoprolol administration interrupted",
    medicationEvents: "Metoprolol 25mg pending",
    notes: "Mild dizziness reported. Monitor BP.",
    aiSummary:
      "Patient had one interrupted medication event. Metoprolol 25mg was not administered due to bed alarm interruption. Recommend re-verification before continuing. BP slightly elevated.",
  },
  {
    name: "Mr. Garcia",
    room: "Room 211",
    unresolvedCheckpoints: 2,
    incompleteTasks: "Wound dressing change interrupted",
    medicationEvents: "Cefazolin 1g IV given at 06:00",
    notes: "Elevated temp 37.8°C. Wound culture pending.",
    aiSummary:
      "High-risk patient with two unresolved checkpoints. Wound dressing was interrupted by Code Blue. Temperature trending up, possible surgical site infection. Cefazolin on schedule. Prioritize wound assessment.",
  },
  {
    name: "Mr. Thompson",
    room: "Room 219",
    unresolvedCheckpoints: 1,
    incompleteTasks: "Insulin administration interrupted",
    medicationEvents: "Blood glucose 186 mg/dL at 07:00",
    notes: "Patient requested breakfast early.",
    aiSummary:
      "Insulin dose interrupted. Blood glucose elevated at 186. Patient was requesting food which may have contributed to timing issue. Recommend glucose recheck before insulin administration.",
  },
];

export function ShiftHandover() {
  const navigate = useNavigate();

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

      {/* Nurse Info */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-foreground">Sarah Mitchell</p>
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
            <p className="text-foreground">James Rivera</p>
            <p className="text-muted-foreground">Incoming — Night Shift</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#FFF3E0] rounded-xl p-3 text-center">
          <p className="text-2xl text-[#E65100]">4</p>
          <p className="text-[#E65100]">Checkpoints</p>
        </div>
        <div className="bg-[#FFEBEE] rounded-xl p-3 text-center">
          <p className="text-2xl text-[#C62828]">3</p>
          <p className="text-[#C62828]">Incomplete</p>
        </div>
        <div className="bg-[#E8F5E9] rounded-xl p-3 text-center">
          <p className="text-2xl text-[#2E7D32]">3</p>
          <p className="text-[#2E7D32]">Stable</p>
        </div>
      </div>

      {/* Patient Accordion Cards */}
      <div className="space-y-4">
        {handoverPatients.map((patient) => (
          <ExpandableCard
            key={patient.name}
            title={`${patient.name} — ${patient.room}`}
          >
            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground mb-1">Unresolved Checkpoints</p>
                <p className="text-foreground">{patient.unresolvedCheckpoints}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Incomplete Tasks</p>
                <p className="text-foreground">{patient.incompleteTasks}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Medication Events</p>
                <p className="text-foreground">{patient.medicationEvents}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Notes</p>
                <p className="text-foreground">{patient.notes}</p>
              </div>
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                <p className="text-primary mb-1">AI Summary</p>
                <p className="text-foreground">{patient.aiSummary}</p>
              </div>
            </div>
          </ExpandableCard>
        ))}
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-24 left-0 right-0 px-5 max-w-lg mx-auto">
        <button className="w-full bg-primary text-primary-foreground py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Approve Handover
        </button>
      </div>
    </div>
  );
}
