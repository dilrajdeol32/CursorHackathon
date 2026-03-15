import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseKey = process.env.SUPABASE_ANON_KEY ?? "";

function isValidUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

const hasRealCredentials =
  isValidUrl(supabaseUrl) &&
  !!supabaseKey &&
  supabaseKey !== "your_supabase_key";

export const supabase: SupabaseClient | null = hasRealCredentials
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (!supabase) {
  console.log("[supabase] No real credentials — using in-memory fallback");
}