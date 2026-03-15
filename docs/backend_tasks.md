# Backend Tasks

## Setup
- [x] Initialize Express + TypeScript backend
- [x] Install dependencies
- [x] Create folder structure
- [x] Add environment variable support

## Auth
- [x] Connect Supabase Auth
- [x] Add login endpoint
- [x] Add auth middleware

## Mock Patients
- [x] Create mock patients JSON file
- [x] Add GET /patients endpoint
- [x] Add GET /patients/:id endpoint

## Checkpoints
- [x] Create checkpoint schema/table (Supabase) and in-memory fallback
- [x] Add POST /checkpoints endpoint with Supabase + in-memory fallback
- [x] Add GET /checkpoints endpoint with Supabase + in-memory fallback

## Voice Pipeline
- [x] Add audio upload endpoint (`POST /audio`) using `multer` for file handling
- [x] Integrate Deepgram transcription via REST API (with graceful fallback when API key is missing)
- [x] Integrate GEMINI structured extraction (with strict JSON schema and heuristic fallback parser)
- [x] Add validation against mock patient data (patients JSON)

## Resume
- [x] Add resume behavior via checkpoint retrieval endpoints
- [x] Add risk score calculation utility used when saving checkpoints

## Handover
- [x] Add handover summary generation endpoint (`POST /handover`) using GEMINI (with fallback summary when API is unavailable)