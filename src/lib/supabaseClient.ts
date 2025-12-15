import {
  createClient,
  type SupabaseClient,
  type SupabaseClientOptions,
} from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

const missingKeys: string[] = [];
if (!supabaseUrl) {
  missingKeys.push("NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL");
}
if (!supabaseAnonKey) {
  missingKeys.push("NEXT_PUBLIC_SUPABASE_ANON_KEY/SUPABASE_ANON_KEY");
}

if (missingKeys.length) {
  throw new Error(`${missingKeys.join(" and ")} must be set`);
}

const serverOptions: SupabaseClientOptions<"public"> = {
  auth: {
    persistSession: false,
    detectSessionInUrl: false,
  },
};

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

export function createSupabaseServerClient(): SupabaseClient {
  return createClient(supabaseUrl!, supabaseAnonKey!, serverOptions);
}
