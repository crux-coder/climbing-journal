import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "src/config/database.types";

let supabase: SupabaseClient<Database> | null = null;

export const getAnonSupabaseClient = (): SupabaseClient<Database> => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_KEY environment variables",
    );
  }

  if (supabase) {
    return supabase;
  }

  supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

  return supabase;
};

export const getAuthenticatedSupabaseClient = (
  accessToken: string,
): SupabaseClient<Database> => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_KEY environment variables",
    );
  }

  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    // SupabaseClient type requires accessToken to be a function that returns a Promise<string>
    accessToken: async () => {
      return accessToken;
    },
  });

  return supabase;
};
