"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseEnv, usernameToEmail } from "@/lib/supabase/config";
import type { FormState } from "@/lib/types";
import { loginSchema } from "@/lib/validations";
import { field } from "./form-data";

function localeOf(formData: FormData): string {
  const lang = field(formData, "lang");
  return lang && isLocale(lang) ? lang : defaultLocale;
}

/** Signs the admin in with username + password, then redirects to the users page. */
export async function signInAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const lang = localeOf(formData);
  const parsed = loginSchema.safeParse({
    username: field(formData, "username"),
    password: field(formData, "password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please enter your username and password.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  if (!getSupabaseEnv()) {
    logger.error("auth.supabase_unconfigured");
    return {
      status: "error",
      message: "Authentication is not configured. Set the Supabase environment variables.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: usernameToEmail(parsed.data.username),
    password: parsed.data.password,
  });

  if (error) {
    logger.warn("auth.sign_in_failed", { message: error.message });
    return { status: "error", message: "Incorrect username or password." };
  }

  logger.info("auth.signed_in");
  redirect(`/${lang}/users`);
}

/** Signs the admin out and returns to the login page. */
export async function signOutAction(formData: FormData): Promise<void> {
  const lang = localeOf(formData);
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  logger.info("auth.signed_out");
  redirect(`/${lang}/login`);
}
