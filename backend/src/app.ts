import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.js";
import { patientsRouter } from "./routes/patients.js";
import { checkpointsRouter } from "./routes/checkpoints.js";
import { audioRouter } from "./routes/audio.js";
import { handoverRouter } from "./routes/handover.js";
import testRouter from "./routes/test.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    env: env.NODE_ENV,
  });
});

app.use("/auth", authRouter);
app.use("/patients", patientsRouter);
app.use("/checkpoints", checkpointsRouter);
app.use("/audio", audioRouter);
app.use("/handover", handoverRouter);
app.use("/test", testRouter);

export { app };