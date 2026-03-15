import React from "react";
import { ShieldAlert } from "lucide-react";

interface RiskCardProps {
  level: "Low" | "Medium" | "High";
  details: string[];
}

const levelColors = {
  Low: { bg: "bg-[#E8F5E9]", text: "text-[#2E7D32]", border: "border-[#4CAF7D]" },
  Medium: { bg: "bg-[#FFF3E0]", text: "text-[#E65100]", border: "border-[#E5A84D]" },
  High: { bg: "bg-[#FFEBEE]", text: "text-[#C62828]", border: "border-[#E54D4D]" },
};

export function RiskCard({ level, details }: RiskCardProps) {
  const colors = levelColors[level];
  return (
    <div className={`rounded-2xl p-5 ${colors.bg} border ${colors.border}`}>
      <div className="flex items-center gap-3 mb-3">
        <ShieldAlert className={`w-6 h-6 ${colors.text}`} />
        <h4 className={colors.text}>Risk Level: {level}</h4>
      </div>
      <ul className="space-y-1.5">
        {details.map((detail, i) => (
          <li key={i} className={`${colors.text} opacity-80`}>
            {detail}
          </li>
        ))}
      </ul>
    </div>
  );
}
