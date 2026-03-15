import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase.js";

const testRouter = Router();

/** GET /test — basic ping */
testRouter.get("/", (_req: Request, res: Response) => {
  res.json({ ok: true, message: "test route works" });
});

/** GET /test/test-db — verifies Supabase connection */
testRouter.get("/test-db", async (_req: Request, res: Response) => {
  if (!supabase) {
    res.status(503).json({ ok: false, error: "Supabase not configured — using in-memory mode" });
    return;
  }
  const { error } = await supabase.from("checkpoints").select("id").limit(1);
  if (error) {
    res.status(500).json({ ok: false, error: error.message });
    return;
  }
  res.json({ ok: true, message: "test-db route works" });
});

export default testRouter;
