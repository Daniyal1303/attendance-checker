import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { defaultLocale, isLocale, locales, type Locale } from "@/lib/i18n/config";
import { logger } from "@/lib/logger";
import { getSupabaseEnv } from "@/lib/supabase/config";

const protectedRoutes = ["/users", "/attendance", "/reports"];

function resolveLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language");
  if (!header) return defaultLocale;

  const preferred = header
    .split(",")
    .map((part) => part.split(";")[0]?.trim().slice(0, 2).toLowerCase())
    .filter((code): code is string => Boolean(code));

  return preferred.find(isLocale) ?? defaultLocale;
}

/**
 * Refreshes the Supabase session, keeping the rolling auth cookies on a
 * response that callers can either return directly or copy onto a redirect.
 */
async function refreshSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const env = getSupabaseEnv();
  if (!env) {
    logger.warn("auth.supabase_unconfigured", {
      hint: "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then restart dev.",
    });
    return { user: null, response };
  }

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { user, response };
}

function redirectWithCookies(url: URL, source: NextResponse): NextResponse {
  const redirect = NextResponse.redirect(url);
  for (const cookie of source.cookies.getAll()) redirect.cookies.set(cookie);
  return redirect;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (!hasLocale) {
    const locale = resolveLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  const { user, response } = await refreshSession(request);

  const locale = pathname.split("/")[1] as Locale;
  const rest = pathname.slice(`/${locale}`.length) || "/";
  const isLoginRoute = rest === "/login";
  const isProtected = protectedRoutes.some(
    (route) => rest === route || rest.startsWith(`${route}/`),
  );

  if (isProtected && !user) {
    return redirectWithCookies(new URL(`/${locale}/login`, request.url), response);
  }
  if (isLoginRoute && user) {
    return redirectWithCookies(new URL(`/${locale}/users`, request.url), response);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
