import { Router, Request, Response } from "express";
import { readFileSync } from "fs";
import { join } from "path";

const dataPath = join(process.cwd(), "src", "mock-data", "patients.json");

type Patient = {
  patient_id: string;
  name: string;
  room_number: string;
  allergies: string[];
  medications: string[];
  latest_vitals: Record<string, number | string>;
};

function loadPatients(): Patient[] {
  const raw = readFileSync(dataPath, "utf-8");
  return JSON.parse(raw) as Patient[];
}

const router = Router();
const patients = loadPatients();

/** GET /patients — return all patients */
router.get("/", (_req: Request, res: Response) => {
  res.json(patients);
});

/** GET /patients/:id — return a single patient by patient_id */
router.get("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const patient = patients.find((p) => p.patient_id === id);
  if (!patient) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }
  res.json(patient);
});

export { router as patientsRouter };
