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

function validateAndEnrich(data: Record<string, string>): {
  status: Record<string, string>;
  enriched: Record<string, string>;
} {
  const status: Record<string, string> = {};
  const enriched = { ...data };
  const patientName = (data.patient_name ?? "").trim().toLowerCase();
  const roomNumber = (data.room_number ?? "").trim();
  const medication = (data.medication ?? "").trim().toLowerCase();
  const dosage = (data.dosage ?? "").trim().toLowerCase();

  let matched: Patient | undefined;
  if (patientName.length >= 2) {
    matched = patients.find(
      (p) =>
        p.name.toLowerCase().includes(patientName) ||
        patientName.includes(p.name.split(" ").pop()?.toLowerCase() ?? "_")
    );
  }

  if (matched) {
    enriched.patient_name = matched.name;
    status.patient_name = "confirmed";

    if (matched.room_number === roomNumber) {
      status.room_number = "confirmed";
    } else if (roomNumber) {
      enriched.room_number = matched.room_number;
      status.room_number = "confirmed";
    } else {
      status.room_number = "missing";
    }
  } else {
    status.patient_name = patientName ? "uncertain" : "missing";
    status.room_number = roomNumber ? "uncertain" : "missing";
  }

  if (medication.length >= 2 && matched) {
    const matchedMed = matched.medications.find((m) => m.toLowerCase().includes(medication));
    if (matchedMed) {
      status.medication = "confirmed";
      if (dosage) {
        const doseDigits = dosage.replace(/[^0-9.]/g, "");
        if (doseDigits && matchedMed.includes(doseDigits)) {
          status.dosage = "confirmed";
        } else {
          status.dosage = "uncertain";
        }
      } else {
        status.dosage = "missing";
      }
    } else {
      status.medication = "uncertain";
      status.dosage = dosage ? "uncertain" : "missing";
    }
  } else {
    status.medication = medication ? "uncertain" : "missing";
    status.dosage = dosage ? "uncertain" : "missing";
  }

  status.interruption_type = data.interruption_type ? "confirmed" : "missing";

  return { status, enriched };
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
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Extract structured fields from this nurse's voice checkpoint transcript.

IMPORTANT normalisation rules:
- room_number: digits only, no spaces (e.g. "20 4" → "204", "three eleven" → "311")
- dosage: convert spoken numbers to digits with unit abbreviation (e.g. "twenty five milligrams" → "25mg", "ten units" → "10 units")
- medication: capitalise the first letter (e.g. "metoprolol" → "Metoprolol")
- interruption_type: title-case (e.g. "bed alarm" → "Bed Alarm")
- patient_name: keep as spoken, title-case

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

const WORD_TO_NUM: Record<string, number> = {
  zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,
  ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,
  seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50,
  sixty:60,seventy:70,eighty:80,ninety:90,hundred:100,thousand:1000,
};

function wordsToNumber(text: string): number | null {
  const words = text.toLowerCase().replace(/-/g, " ").split(/\s+/);
  let total = 0, current = 0, found = false;
  for (const w of words) {
    const v = WORD_TO_NUM[w];
    if (v === undefined) continue;
    found = true;
    if (v === 100) { current = (current || 1) * 100; }
    else if (v === 1000) { current = (current || 1) * 1000; total += current; current = 0; }
    else { current += v; }
  }
  total += current;
  return found ? total : null;
}

function normalizeExtracted(data: Record<string, string>): Record<string, string> {
  const out = { ...data };

  if (out.room_number) {
    out.room_number = out.room_number.replace(/\s+/g, "");
    const num = wordsToNumber(out.room_number);
    if (num !== null) out.room_number = String(num);
  }

  if (out.dosage) {
    const unitMatch = out.dosage.match(/(mg|milligrams?|ml|milliliters?|mcg|micrograms?|units?|cc)/i);
    const unit = unitMatch ? unitMatch[1].replace(/milligrams?/i,"mg").replace(/milliliters?/i,"ml").replace(/micrograms?/i,"mcg") : "";
    const num = out.dosage.match(/(\d+(?:\.\d+)?)/)?.[1];
    if (num) {
      out.dosage = `${num}${unit}`;
    } else {
      const wordNum = wordsToNumber(out.dosage);
      if (wordNum !== null) out.dosage = `${wordNum}${unit}`;
    }
  }

  if (out.medication) {
    out.medication = out.medication.charAt(0).toUpperCase() + out.medication.slice(1);
  }

  if (out.interruption_type) {
    out.interruption_type = out.interruption_type
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }

  return out;
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

  structured_data = normalizeExtracted(structured_data);
  const { status: validation_status, enriched } = validateAndEnrich(structured_data);
  structured_data = enriched;

  res.json({
    transcript,
    structured_data,
    validation_status,
    patient_id: patient_id ?? null,
  });
});

export { router as audioRouter };
