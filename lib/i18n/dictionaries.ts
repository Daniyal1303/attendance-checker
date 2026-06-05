import "server-only";
import type { Locale } from "./config";
import en from "./dictionaries/en.json";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => Promise.resolve(en),
  ur: () => import("./dictionaries/ur.json").then((m) => m.default),
};

/** Loads the translation dictionary for the given locale (server only). */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
