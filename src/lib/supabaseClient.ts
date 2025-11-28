import {
  createClient,
  type SupabaseClient,
  type SupabaseClientOptions,
} from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set");
}

const serverOptions: SupabaseClientOptions = {
  auth: {
    persistSession: false,
    detectSessionInUrl: false,
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function createSupabaseServerClient(accessToken?: string): SupabaseClient {
  const client = createClient(supabaseUrl, supabaseAnonKey, serverOptions);
  if (accessToken) {
    client.auth.setAuth(accessToken);
  }
  return client;
}
