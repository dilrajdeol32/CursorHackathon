import React from "react";

type ChipStatus = "normal" | "interrupted" | "high-risk";

const statusStyles: Record<ChipStatus, string> = {
  normal: "bg-[#E8F5E9] text-[#2E7D32]",
  interrupted: "bg-[#FFF3E0] text-[#E65100]",
  "high-risk": "bg-[#FFEBEE] text-[#C62828]",
};

const statusLabels: Record<ChipStatus, string> = {
  normal: "Normal",
  interrupted: "Interrupted",
  "high-risk": "High Risk",
};

interface StatusChipProps {
  status: ChipStatus;
  label?: string;
}

export function StatusChip({ status, label }: StatusChipProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full ${statusStyles[status]}`}
    >
      <span className="w-2 h-2 rounded-full mr-2 bg-current opacity-70" />
      {label || statusLabels[status]}
    </span>
  );
}
