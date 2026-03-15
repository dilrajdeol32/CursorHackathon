import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { patientsRouter } from "./routes/patients.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, env: env.NODE_ENV });
});

app.use("/patients", patientsRouter);

export { app };
