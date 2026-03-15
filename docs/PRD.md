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

Frontend
- React Native with Expo
- TypeScript
- React Navigation
- Zustand for state

Backend
- Node.js
- Express
- TypeScript

Database
- Supabase Postgres

Speech to Text
- Deepgram API

AI Extraction
- GEMINI API

Charts / analytics
- Recharts

Mock data
- Local JSON dataset

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
- Expo Audio API

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
- Deepgram API

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
- GEMINI API

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

Status labels
- confirmed
- uncertain
- missing

---

# Feature 9 — Checkpoint Storage

Requirement
- Save checkpoint data for later retrieval.

Database
- Supabase Postgres

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
- GEMINI API summary generation

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