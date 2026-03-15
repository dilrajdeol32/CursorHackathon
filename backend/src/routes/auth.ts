import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

/**
 * POST /auth/login
 * Nurse login with email + password (Supabase Auth).
 * Body: { email: string, password: string }
 * Returns: { user, session } with access_token, refresh_token for use in Authorization header.
 */
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    res.status(400).json({
      error: "Missing credentials",
      details: "Request body must include email and password",
    });
    return;
  }

  if (!supabase) {
    res.status(503).json({ error: "Supabase not configured" });
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: String(email).trim(),
    password: String(password),
  });

  if (error) {
    res.status(401).json({
      error: "Login failed",
      details: error.message,
    });
    return;
  }

  const { user, session } = data;
  if (!user || !session) {
    res.status(500).json({ error: "Login succeeded but no session returned" });
    return;
  }

  res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
    },
    session: {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
    },
  });
});

/**
 * GET /auth/me
 * Returns the currently authenticated nurse (requires Authorization: Bearer <access_token>).
 */
router.get("/me", authMiddleware, (req: Request, res: Response): void => {
  const user = req.user!;
  res.json({
    nurse_id: user.id,
    email: user.email,
  });
});

export { router as authRouter };
