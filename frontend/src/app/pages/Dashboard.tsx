import React from "react";
import { useNavigate } from "react-router";
import { Users, ListChecks, Bookmark, ArrowRightLeft, Clock, Sun } from "lucide-react";

const cards = [
  {
    title: "Assigned Patients",
    count: 6,
    preview: "2 need attention",
    icon: Users,
    color: "bg-primary/10 text-primary",
    path: "/patients",
  },
  {
    title: "Active Tasks",
    count: 4,
    preview: "1 medication due",
    icon: ListChecks,
    color: "bg-[#5BA8A0]/10 text-[#5BA8A0]",
    path: "/tasks",
  },
  {
    title: "Unresolved Checkpoints",
    count: 2,
    preview: "1 high risk",
    icon: Bookmark,
    color: "bg-[#E5A84D]/10 text-[#E5A84D]",
    path: "/checkpoint",
  },
  {
    title: "Shift Handover",
    count: 0,
    preview: "Scheduled at 19:00",
    icon: ArrowRightLeft,
    color: "bg-[#7B6BD9]/10 text-[#7B6BD9]",
    path: "/handover",
  },
];

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="pb-28 px-5 pt-6">
      {/* Greeting */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[#E5A84D] mb-2">
          <Sun className="w-5 h-5" />
          <span className="text-muted-foreground">Good Morning</span>
        </div>
        <h1 className="text-foreground mb-1">Hello, Sarah</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Day Shift
          </span>
          <span>6 Patients</span>
        </div>
      </div>

      {/* Cards Grid */}
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
