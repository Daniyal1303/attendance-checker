import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseEnv } from "./config";

/**
 * Supabase client bound to the request cookie store, for use in Server
 * Components and Server Actions. Cookie writes from Server Components are
 * swallowed (read-only context); the proxy refreshes the session instead.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = supabaseEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          /* Called from a Server Component; the proxy handles session refresh. */
        }
      },
    },
  });
}
