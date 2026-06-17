import type { Locale } from "@/lib/i18n/config";

/** Formats an ISO date string or `Date` using the locale's medium date style. */
export function formatDate(value: string | Date, locale: Locale): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
}
