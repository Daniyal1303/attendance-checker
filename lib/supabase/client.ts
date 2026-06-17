"use client";
import { createBrowserClient } from "@supabase/ssr";
import { supabaseEnv } from "./config";

/** Browser Supabase client for Client Components. */
export function createSupabaseBrowserClient() {
  const { url, anonKey } = supabaseEnv();
  return createBrowserClient(url, anonKey);
}
