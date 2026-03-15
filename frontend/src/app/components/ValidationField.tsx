import React from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface ValidationFieldProps {
  label: string;
  value: string;
  status: "confirmed" | "uncertain";
}

export function ValidationField({ label, value, status }: ValidationFieldProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-muted-foreground">{label}</p>
        <p className="text-foreground mt-0.5">{value}</p>
      </div>
      {status === "confirmed" ? (
        <div className="flex items-center gap-1.5 text-[#4CAF7D]">
          <CheckCircle className="w-5 h-5" />
          <span>Confirmed</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-[#E5A84D]">
          <AlertTriangle className="w-5 h-5" />
          <span>Uncertain</span>
        </div>
      )}
    </div>
  );
}
