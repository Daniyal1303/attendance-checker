export const locales = ["en", "ur"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ur: "rtl",
};

export const localeLabels: Record<Locale, string> = {
  en: "English",
  ur: "اردو",
};

/** Type guard narrowing an arbitrary string to a supported {@link Locale}. */
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
