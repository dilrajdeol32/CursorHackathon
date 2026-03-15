import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase.js";
import { authMiddleware } from "../middleware/auth.js";
import { randomUUID } from "crypto";

export type Checkpoint = {
  id: string;
  nurse_id: string;
  patient_id: string;
  timestamp: string;
  transcript: string | null;
  structured_data: Record<string, any> | null;
  validation_status: Record<string, string> | null;
  interruption_type: string | null;
  risk_score: string | null;
};

const inMemoryStore: Checkpoint[] = [];

function computeRiskScore(
  checkpoint: Partial<Checkpoint>,
  minutesElapsed = 0
): string {
  const interruptionWeights: Record<string, number> = {
    "bed alarm": 15,
    "code blue": 30,
    "code alert": 30,
    "phone call": 10,
    "patient request": 10,
    other: 10,
  };

  const interType = (checkpoint.interruption_type ?? "other").toLowerCase();
  const base =
    interruptionWeights[interType] ?? interruptionWeights["other"];

  const timePenalty = Math.min(minutesElapsed * 2, 40);

  let uncertainCount = 0;
  if (checkpoint.validation_status) {
    uncertainCount = Object.values(checkpoint.validation_status).filter(
      (v) => v === "uncertain" || v === "missing"
    ).length;
  }
  const uncertaintyPenalty = uncertainCount * 10;

  const total = base + timePenalty + uncertaintyPenalty;
  if (total < 30) return "LOW";
  if (total <= 60) return "MEDIUM";
  return "HIGH";
}

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const {
    patient_id,
    transcript,
    structured_data,
    validation_status,
    interruption_type,
  } = req.body ?? {};

  if (!patient_id) {
    res.status(400).json({ error: "patient_id is required" });
    return;
  }

  const nurse_id = req.user?.id ?? "demo-nurse";

  const risk_score = computeRiskScore(
    { interruption_type, validation_status },
    0
  );

  if (supabase) {
    const { data, error } = await supabase
      .from("checkpoints")
      .insert({
        nurse_id,
        patient_id,
        transcript: transcript ?? null,
        structured_data: structured_data ?? null,
        validation_status: validation_status ?? null,
        interruption_type: interruption_type ?? null,
        risk_score,
      })
      .select()
      .single();

    if (error) {
      console.warn("[checkpoints] Supabase insert failed, using in-memory:", error.message);
    } else {
      res.status(201).json(data);
      return;
    }
  }

  const checkpoint: Checkpoint = {
    id: randomUUID(),
    nurse_id,
    patient_id,
    timestamp: new Date().toISOString(),
    transcript: transcript ?? null,
    structured_data: structured_data ?? null,
    validation_status: validation_status ?? null,
    interruption_type: interruption_type ?? null,
    risk_score,
  };
  inMemoryStore.push(checkpoint);
  res.status(201).json(checkpoint);
});

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const nurse_id = req.user?.id ?? "demo-nurse";

  if (supabase) {
    const { data, error } = await supabase
      .from("checkpoints")
      .select("*")
      .eq("nurse_id", nurse_id)
      .order("timestamp", { ascending: false });

    if (!error && data) {
      res.json(data);
      return;
    }
    console.warn("[checkpoints] Supabase query failed, using in-memory:", error?.message);
  }

  const filtered = inMemoryStore
    .filter((c) => c.nurse_id === nurse_id)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  res.json(filtered);
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (supabase) {
    const { data, error } = await supabase
      .from("checkpoints")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      res.json(data);
      return;
    }
  }

  const checkpoint = inMemoryStore.find((c) => c.id === id);
  if (!checkpoint) {
    res.status(404).json({ error: "Checkpoint not found" });
    return;
  }
  res.json(checkpoint);
});

export { router as checkpointsRouter, inMemoryStore as checkpointStore, computeRiskScore };
