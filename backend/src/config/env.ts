import "dotenv/config";

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: parseInt(process.env.PORT ?? "3000", 10),
  // Supabase (for later Auth/DB)
  SUPABASE_URL: process.env.SUPABASE_URL ?? "",
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? "",
  // Deepgram (for later Voice Pipeline)
  DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY ?? "",
  // Gemini (for later Extraction)
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? "",
} as const;
