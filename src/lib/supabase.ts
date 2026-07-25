import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl) {
  console.warn("Supabase URL env variable is missing!");
}

// Client for general public queries (uses Anon Key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for backend operations (uses Service Role Key to bypass RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
