import React from "react";
import { useNavigate, useLocation } from "react-router";
import { Users, ListChecks, Bookmark, ArrowRightLeft, BarChart3 } from "lucide-react";

const navItems = [
  { path: "/patients", icon: Users, label: "Patients" },
  { path: "/tasks", icon: ListChecks, label: "Tasks" },
  { path: "/checkpoint", icon: Bookmark, label: "" },
  { path: "/handover", icon: ArrowRightLeft, label: "Handover" },
  { path: "/analytics", icon: BarChart3, label: "Analytics" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-lg mx-auto flex items-end justify-around px-2 pb-5 pt-2 relative">
        {navItems.map((item) => {
          if (item.label === "") {
            // Floating center checkpoint button
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative -mt-8 w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center active:scale-95 transition-transform"
              >
                <Bookmark className="w-7 h-7" />
              </button>
            );
          }
          const isActive =
            location.pathname === item.path ||
            (item.path === "/patients" && location.pathname === "/");
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 py-1 px-3 min-w-[56px] ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[11px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
