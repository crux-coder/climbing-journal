import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/config/database.types';

let supabase: SupabaseClient<Database> | null = null;

const getSupabaseClient = (): SupabaseClient<Database> => {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        throw new Error("Missing SUPABASE_URL or SUPABASE_KEY environment variables");
    }

    if (supabase) {
        return supabase;
    }

    supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false
        }
    });

    return supabase;
};

export default getSupabaseClient;