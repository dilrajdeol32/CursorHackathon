import { Router, Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import { join } from "path";
import { supabase } from "../lib/supabase.js";
import { checkpointStore, Checkpoint } from "./checkpoints.js";
import { env } from "../config/env.js";

type Patient = {
  patient_id: string;
  name: string;
  room_number: string;
  medications: string[];
};

function loadPatients(): Patient[] {
  const raw = readFileSync(join(process.cwd(), "src", "mock-data", "patients.json"), "utf-8");
  return JSON.parse(raw) as Patient[];
}

const patients = loadPatients();

async function getCheckpointsForNurse(nurseId: string): Promise<Checkpoint[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("checkpoints")
      .select("*")
      .eq("nurse_id", nurseId)
      .order("timestamp", { ascending: false });
    if (!error && data) return data as Checkpoint[];
  }
  return checkpointStore.filter((c) => c.nurse_id === nurseId);
}

async function generateSummary(
  patientName: string,
  checkpoints: Checkpoint[],
  patientData: Patient | undefined
): Promise<string> {
  if (!env.GEMINI_API_KEY || env.GEMINI_API_KEY === "your_gemini_api_key") {
    return generateFallbackSummary(patientName, checkpoints, patientData);
  }

  try {
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const context = checkpoints.map((c) => ({
      timestamp: c.timestamp,
      transcript: c.transcript,
      structured_data: c.structured_data,
      risk_score: c.risk_score,
      interruption_type: c.interruption_type,
    }));

    const prompt = `You are a clinical handover assistant. Generate a concise shift handover summary for the incoming nurse about this patient.

Patient: ${patientName}
Room: ${patientData?.room_number ?? "unknown"}
Medications: ${patientData?.medications?.join(", ") ?? "unknown"}

Checkpoints from this shift:
${JSON.stringify(context, null, 2)}

Write 2-3 sentences covering: what happened, what's unresolved, and what the incoming nurse should prioritize. Be direct and clinical.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err: any) {
    console.error("[handover] Gemini error:", err.message);
    return generateFallbackSummary(patientName, checkpoints, patientData);
  }
}

function generateFallbackSummary(
  patientName: string,
  checkpoints: Checkpoint[],
  patientData: Patient | undefined
): string {
  const count = checkpoints.length;
  const highRisk = checkpoints.filter((c) => c.risk_score === "HIGH").length;
  const medications = patientData?.medications?.join(", ") ?? "unknown medications";

  if (count === 0) {
    return `${patientName} had no recorded checkpoints this shift. Current medications: ${medications}. No outstanding issues to report.`;
  }

  const lastCheckpoint = checkpoints[0];
  const interruptionTypes = [...new Set(checkpoints.map((c) => c.interruption_type).filter(Boolean))];

  let summary = `${patientName} had ${count} checkpoint(s) this shift`;
  if (interruptionTypes.length > 0) {
    summary += ` with interruptions: ${interruptionTypes.join(", ")}`;
  }
  summary += ".";

  if (highRisk > 0) {
    summary += ` ${highRisk} high-risk checkpoint(s) require immediate attention.`;
  }

  if (lastCheckpoint?.structured_data) {
    const sd = lastCheckpoint.structured_data as Record<string, string>;
    if (sd.medication) {
      summary += ` Last activity involved ${sd.medication}${sd.dosage ? ` ${sd.dosage}` : ""}.`;
    }
  }

  summary += " Recommend verification of any unresolved items before continuing care.";
  return summary;
}

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const nurseId = req.user?.id ?? "demo-nurse";
  const { patient_ids } = req.body ?? {};

  const allCheckpoints = await getCheckpointsForNurse(nurseId);

  const targetIds: string[] = patient_ids ?? [...new Set(allCheckpoints.map((c) => c.patient_id))];

  const summaries = await Promise.all(
    targetIds.map(async (pid) => {
      const patientCheckpoints = allCheckpoints.filter((c) => c.patient_id === pid);
      const patientData = patients.find((p) => p.patient_id === pid);
      const patientName = patientData?.name ?? `Patient ${pid}`;

      const summary = await generateSummary(patientName, patientCheckpoints, patientData);

      return {
        patient_id: pid,
        patient_name: patientName,
        room: patientData?.room_number ?? "—",
        checkpoint_count: patientCheckpoints.length,
        high_risk_count: patientCheckpoints.filter((c) => c.risk_score === "HIGH").length,
        summary,
      };
    })
  );

  res.json({
    nurse_id: nurseId,
    generated_at: new Date().toISOString(),
    patients: summaries,
  });
});

export { router as handoverRouter };
