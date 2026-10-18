import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** null when no keys are configured – the app then runs fully local. */
export const supabase = url && key ? createClient(url, key) : null;
