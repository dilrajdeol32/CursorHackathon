# Checkpoint MVP PRD
Cognitive Continuity System for Nurses in High-Interruption Environments

This PRD defines the core features required to build the MVP for the 24-hour hackathon.

Important constraints:
- No real hospital APIs
- Use mock patient data
- Focus on fast demo experience
- Mobile-first interface

---

# Tech Stack

Frontend (mobile)
- React Native with Expo
- TypeScript
- React Navigation (native stack + bottom tabs)
- Lightweight in-app state via React Context (`SessionContext` for active session + completed tasks)

Frontend (web)
- React + Vite (reference UI, not primary demo surface)

Backend
- Node.js
- Express
- TypeScript

Database
- Supabase Postgres (optional for demo; app can run in in-memory fallback mode when credentials/tables are missing)

Speech to Text
- Deepgram API (REST)

AI Extraction
- GEMINI API (JSON-structured extraction + summaries, with deterministic JSON schema)

Charts / analytics
- React Native charting library (for interruption analytics)

Mock data
- Local JSON dataset (patients and demo checkpoints)

---

# Feature 1 — Nurse Authentication

Requirement
- Nurses must log in to access the system.

Implementation
- Use Supabase Auth.

Supported method
- Email + password

Data stored
- nurse_id
- email
- session_token

---

# Feature 2 — Mock Patient Dataset

Requirement
- Because no hospital APIs are available, the system must simulate patient data.

Implementation
- Create local dataset


Example fields
- patient_id
- name
- room_number
- medications
- allergies
- vitals

Used for
- validation
- demo interface

---

# Feature 3 — Patient Dashboard

Requirement
- Nurse must see a list of patients.

UI shows
- patient name
- room number
- medications
- alerts

Data source
- mock patient dataset

---

# Feature 4 — One-Tap Checkpoint Capture

Requirement
- Nurse must quickly save task context during interruption.

UI
- Large "Checkpoint" button

When pressed
1. Start voice recording
2. Save timestamp
3. Associate patient + nurse

Data captured
- nurse_id
- patient_id
- timestamp
- audio_file

---

# Feature 5 — Voice Recording

Requirement
- Record short voice message.

Implementation
- Expo Audio API (via `expo-audio` in the final implementation)

Audio format
- WAV
- 16kHz
- mono

Audio uploaded to backend.

---

# Feature 6 — Speech to Text

Requirement
- Convert voice recording to text.

Implementation
- Deepgram API (server-side REST call)

Flow
mobile → backend → deepgram

Output
- transcript string

Example
"Patel room 204 metoprolol 25 milligrams bed alarm"

---

# Feature 7 — Structured Extraction

Requirement
- Convert transcript into structured fields.

Implementation
- GEMINI API (server-side call with strict JSON schema and defensive parsing fallback when API is unavailable)

Output format must be strict JSON.

Fields extracted
- patient_name
- room_number
- medication
- dosage
- interruption_type

---

# Feature 8 — Validation Layer

Requirement
- Extracted fields must be validated against patient dataset.

Validation checks
- patient exists
- room matches patient
- medication exists
- dosage present

Fallback behavior
- When external services or the database are unavailable, the system falls back to:
  - local mock patient dataset
  - a heuristic parser for medication/dosage
  - in-memory checkpoint storage

Status labels
- confirmed
- uncertain
- missing

---

# Feature 9 — Checkpoint Storage

Requirement
- Save checkpoint data for later retrieval.

Database
- Supabase Postgres (with in-memory fallback when Supabase is not configured)

Checkpoint table fields
- id
- nurse_id
- patient_id
- timestamp
- transcript
- structured_data
- validation_status
- interruption_type
- risk_score

---

# Feature 10 — Resume Task Screen

Requirement
- Nurse can reopen a checkpoint.

Screen displays
- patient
- room
- medication
- dosage
- interruption type
- time since checkpoint

System provides
- recommended next action

Example
"Re-verify patient identity before administering medication."

Additional requirement
- The system must keep track of which patient/task is currently “in session” so that:
  - the dashboard can show an *Active Session* banner
  - patient lists and task lists reflect *In Session* or *Completed* status based on recent actions

---

# Feature 11 — Risk Score

Requirement
- Calculate risk of resuming task incorrectly.

Inputs
- time since checkpoint
- interruption type
- validation certainty

Risk levels
- LOW
- MEDIUM
- HIGH

---

# Feature 12 — Shift Handover Summary

Requirement
- Generate summary of unresolved tasks.

Inputs
- checkpoints
- patient context
- interruption history

Implementation
- GEMINI API summary generation (with a deterministic fallback summary when the API is unavailable)

Output
- short handover text

---

# Feature 13 — Interruption Analytics

Requirement
- Track interruption patterns.

Data logged
- interruption type
- timestamp
- task type
- risk score

Visualization
- charts showing interruptions per hour

---

# Feature 14 — Patient Identification via QR Wristband (Mobile)

Requirement
- Nurse can scan a patient’s wristband (QR code) from any screen to jump into that patient’s context.

Implementation
- Use `expo-camera` with barcode scanning enabled.
- Add a global floating action button available from all main tabs to open the scanner.
- Parse QR payload (e.g., patient_id, name, room_number) and map it to the app’s internal mock patient IDs.

Flow
1. Nurse taps global Scan button.
2. Camera view opens with QR scanner.
3. On successful scan:
   - parse QR payload into `{ patient_id, name?, room_number? }`
   - resolve to internal app patient ID via mapping rules
   - navigate to `PatientContext` for that patient

Simulator behavior
- Because the iOS simulator has no real camera, provide “Demo scan” buttons that simulate scanning real wristbands.

---

# Feature 15 — Session & Task State (Mobile)

Requirement
- The system should reflect which patient the nurse is currently working with, and which tasks have been completed during the shift.

Implementation
- Frontend-only session state using React Context (`SessionContext`):
  - `activePatientId`, `activePatientName`
  - `completedTaskIds`
- “Resume Task” flow:
  - When the nurse taps **Resume Safely**, the app records the active patient in session state and returns to the dashboard.
- “Mark Verified” flow:
  - When the nurse taps **Mark Verified**, the app records the task as completed, clears the active session, and updates dashboard + task views.

UI impact
- Dashboard:
  - shows an “Active Session” banner when a patient is in session
  - shows a “Tasks Completed” banner listing completed patients
- Patients list:
  - status chip shows “In Session” or “Completed” in addition to the baseline status (normal/interrupted/high-risk)
- Tasks list:
  - tasks that are in session or completed are visually distinguished (icon, text decoration, opacity)