import React from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { RiskCard } from "../components/RiskCard";
import { usePatient } from "../hooks/usePatients";
import {
  getPatientNote,
  getPrimaryMedication,
  getResumeRiskLevel,
} from "../../lib/patients";

export function ResumeTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: patient, loading, error } = usePatient(id);

  if (loading) {
    return <div className="pb-36 px-5 pt-6 text-muted-foreground">Loading resume context...</div>;
  }

  if (error || !patient) {
    return (
      <div className="pb-36 px-5 pt-6 min-h-screen">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="rounded-2xl bg-[#FFEBEE] px-4 py-3 text-[#C62828]">
          Unable to load resume context: {error ?? "Patient not found"}
        </div>
      </div>
    );
  }

  const medication = getPrimaryMedication(patient);
  const riskLevel = getResumeRiskLevel(patient);

  return (
    <div className="pb-36 px-5 pt-6 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="bg-primary/5 rounded-2xl p-5 mb-6 border border-primary/20">
        <h1 className="text-foreground mb-1">
          {patient.name} — Room {patient.room_number}
        </h1>
        <p className="text-muted-foreground">Checkpoint summary based on current backend patient data</p>
      </div>

      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-foreground">What you were doing</h3>
        </div>
        <p className="text-foreground ml-11">Medication administration</p>
        <p className="text-muted-foreground ml-11">{medication}</p>
      </div>

      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-[#4CAF7D]" />
          </div>
          <h3 className="text-foreground">What is confirmed</h3>
        </div>
        <ul className="ml-11 space-y-2">
          <li className="flex items-center gap-2 text-foreground">
            <CheckCircle className="w-4 h-4 text-[#4CAF7D]" />
            Patient identity available from backend dataset
          </li>
          <li className="flex items-center gap-2 text-foreground">
            <CheckCircle className="w-4 h-4 text-[#4CAF7D]" />
            Latest medication list loaded successfully
          </li>
        </ul>
      </div>

      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#FFF3E0] flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-[#E5A84D]" />
          </div>
          <h3 className="text-foreground">What is uncertain</h3>
        </div>
        <ul className="ml-11 space-y-2">
          <li className="flex items-center gap-2 text-[#E5A84D]">
            <AlertTriangle className="w-4 h-4" />
            Checkpoint persistence endpoint is not implemented yet
          </li>
          <li className="flex items-center gap-2 text-[#E5A84D]">
            <AlertTriangle className="w-4 h-4" />
            Reconfirm dosage and charting before proceeding
          </li>
        </ul>
      </div>

      <div className="mb-4">
        <RiskCard
          level={riskLevel}
          details={[
            getPatientNote(patient),
            `${patient.allergies.length} allergy record(s) on file`,
            `SpO2 ${patient.latest_vitals.spo2}%`,
          ]}
        />
      </div>

      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-foreground">Recommended next action</h3>
        </div>
        <p className="text-foreground ml-11">
          Re-verify patient identity, allergies, and the medication order before continuing.
        </p>
      </div>

      <div className="fixed bottom-24 left-0 right-0 px-5 max-w-lg mx-auto">
        <button
          onClick={() => navigate(`/patient/${patient.patient_id}`)}
          className="w-full bg-[#4CAF7D] text-white py-4 rounded-2xl shadow-lg mb-3 active:scale-[0.98] transition-transform"
        >
          Resume Safely
        </button>
        <div className="flex gap-3">
          <button className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl active:scale-[0.98] transition-transform">
            Mark Verified
          </button>
          <button className="flex-1 bg-[#E54D4D] text-white py-3 rounded-xl active:scale-[0.98] transition-transform">
            Escalate
          </button>
        </div>
      </div>
    </div>
  );
}
