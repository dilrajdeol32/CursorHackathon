import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase.js";

/**
 * Auth middleware: validates Bearer token (Supabase access_token) and attaches user to req.
 * Use on routes that require nurse login.
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader ?? null;

  if (!token) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }

  if (!supabase) {
    res.status(503).json({ error: "Supabase not configured" });
    return;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    res.status(401).json({
      error: "Invalid or expired token",
      details: error?.message ?? "User not found",
    });
    return;
  }

  req.user = user;
  next();
}
