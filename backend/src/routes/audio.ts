import { Router, Request, Response } from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import { join } from "path";
import { env } from "../config/env.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

type Patient = {
  patient_id: string;
  name: string;
  room_number: string;
  allergies: string[];
  medications: string[];
};

function loadPatients(): Patient[] {
  const raw = readFileSync(join(process.cwd(), "src", "mock-data", "patients.json"), "utf-8");
  return JSON.parse(raw) as Patient[];
}

const patients = loadPatients();

function validateExtracted(data: Record<string, string>): Record<string, string> {
  const status: Record<string, string> = {};
  const patientName = (data.patient_name ?? "").toLowerCase();
  const roomNumber = data.room_number ?? "";
  const medication = (data.medication ?? "").toLowerCase();

  const matched = patients.find(
    (p) =>
      p.name.toLowerCase().includes(patientName) ||
      patientName.includes(p.name.split(" ").pop()?.toLowerCase() ?? "")
  );

  status.patient_name = matched ? "confirmed" : patientName ? "uncertain" : "missing";

  if (matched && matched.room_number === roomNumber) {
    status.room_number = "confirmed";
  } else if (roomNumber) {
    status.room_number = "uncertain";
  } else {
    status.room_number = "missing";
  }

  if (matched) {
    const hasMed = matched.medications.some((m) => m.toLowerCase().includes(medication));
    status.medication = hasMed ? "confirmed" : medication ? "uncertain" : "missing";
  } else {
    status.medication = medication ? "uncertain" : "missing";
  }

  status.dosage = data.dosage ? "uncertain" : "missing";
  status.interruption_type = data.interruption_type ? "confirmed" : "missing";

  return status;
}

async function transcribeAudio(audioBuffer: Buffer, mimetype: string): Promise<string> {
  if (!env.DEEPGRAM_API_KEY || env.DEEPGRAM_API_KEY === "your_deepgram_api_key") {
    return "";
  }

  const response = await fetch("https://api.deepgram.com/v1/listen?model=nova-3&language=en&smart_format=true", {
    method: "POST",
    headers: {
      Authorization: `Token ${env.DEEPGRAM_API_KEY}`,
      "Content-Type": mimetype || "audio/wav",
    },
    body: audioBuffer,
  });

  if (!response.ok) {
    throw new Error(`Deepgram API error: ${response.status}`);
  }

  const result = await response.json() as any;
  return result?.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "";
}

async function extractStructured(transcript: string): Promise<Record<string, string>> {
  if (!env.GEMINI_API_KEY || env.GEMINI_API_KEY === "your_gemini_api_key") {
    return parseFallback(transcript);
  }

  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Extract structured fields from this nurse's voice checkpoint transcript.
Return ONLY valid JSON with exactly these fields:
{
  "patient_name": "string or empty",
  "room_number": "string or empty",
  "medication": "string or empty",
  "dosage": "string or empty",
  "interruption_type": "string or empty"
}

Transcript: "${transcript}"`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return parseFallback(transcript);

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return parseFallback(transcript);
  }
}

function parseFallback(transcript: string): Record<string, string> {
  const lower = transcript.toLowerCase();
  const fields: Record<string, string> = {
    patient_name: "",
    room_number: "",
    medication: "",
    dosage: "",
    interruption_type: "",
  };

  for (const p of patients) {
    const lastName = p.name.split(" ").pop()?.toLowerCase() ?? "";
    if (lower.includes(lastName)) {
      fields.patient_name = p.name;
      fields.room_number = p.room_number;
      break;
    }
  }

  const roomMatch = lower.match(/room\s*(\d+)/);
  if (roomMatch) fields.room_number = roomMatch[1];

  const medNames = ["metoprolol", "lisinopril", "aspirin", "insulin", "metformin", "gabapentin", "amoxicillin", "acetaminophen", "warfarin", "furosemide", "cefazolin"];
  for (const med of medNames) {
    if (lower.includes(med)) { fields.medication = med.charAt(0).toUpperCase() + med.slice(1); break; }
  }

  const doseMatch = lower.match(/(\d+\s*(?:mg|milligrams?|ml|units?))/i);
  if (doseMatch) fields.dosage = doseMatch[1].replace(/milligrams?/, "mg");

  const interruptions = ["bed alarm", "code blue", "code alert", "phone call", "patient request", "fall", "emergency"];
  for (const intr of interruptions) {
    if (lower.includes(intr)) { fields.interruption_type = intr.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "); break; }
  }

  return fields;
}

const router = Router();

router.post("/", upload.single("audio"), async (req: Request, res: Response): Promise<void> => {
  const file = req.file;
  const patient_id = req.body?.patient_id;

  let transcript = "";
  let structured_data: Record<string, string>;

  if (file && file.buffer.length > 0) {
    try {
      transcript = await transcribeAudio(file.buffer, file.mimetype || "audio/wav");
    } catch (err: any) {
      console.error("[audio] Deepgram error:", err.message);
    }
  }

  if (!transcript && req.body?.transcript) {
    transcript = req.body.transcript;
  }

  if (!transcript) {
    transcript = "No transcript available";
  }

  try {
    structured_data = await extractStructured(transcript);
  } catch (err: any) {
    console.error("[audio] Gemini error:", err.message);
    structured_data = parseFallback(transcript);
  }

  const validation_status = validateExtracted(structured_data);

  res.json({
    transcript,
    structured_data,
    validation_status,
    patient_id: patient_id ?? null,
  });
});

export { router as audioRouter };
