# Progress

## Done
- **Backend Setup**: Initialized Express + TypeScript backend, installed dependencies, created folder structure (`src/`, `src/config/`, `src/routes/`, `src/middleware/`, `src/lib/`), added environment variable support via `dotenv` and `.env.example`.

- **Mock Patients**: Created `src/mock-data/patients.json` with 4 demo patients. Added `GET /patients` and `GET /patients/:id` endpoints in `src/routes/patients.ts`.

- **Supabase Client**: Created `src/lib/supabase.ts` with singleton Supabase client. Verified database connection via `GET /test/test-db`.

- **Auth (nurse login)**: Connected Supabase Auth; added `POST /auth/login` (email + password), `GET /auth/me` (protected); added auth middleware that validates `Authorization: Bearer <access_token>` and attaches `req.user`. Created `src/routes/auth.ts`, `src/middleware/auth.ts`, and `src/types/express.d.ts`.

## In Progress
-

## Blocked
-

## Next task
**Checkpoints**: Create checkpoint schema/table, then add `POST /checkpoints` and `GET /checkpoints` endpoints. Auth middleware can be applied to checkpoint routes so only logged-in nurses can create/list checkpoints.
