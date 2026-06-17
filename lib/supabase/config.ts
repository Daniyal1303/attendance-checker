/**
 * Domain appended to a username to form the synthetic email Supabase Auth signs
 * in with (e.g. `admin` → `admin@attendo.local`). Configurable via env.
 */
export function authEmailDomain(): string {
  return process.env.AUTH_EMAIL_DOMAIN ?? "attendo.local";
}

/** Maps a username to the synthetic email used as the Supabase Auth identifier. */
export function usernameToEmail(username: string): string {
  return `${username}@${authEmailDomain()}`;
}

export type SupabaseEnv = { url: string; anonKey: string };

/** Reads the public Supabase URL + anon key, or `null` when either is unset. */
export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && anonKey ? { url, anonKey } : null;
}

/** Like {@link getSupabaseEnv} but throws when the vars are unset. */
export function supabaseEnv(): SupabaseEnv {
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return env;
}
