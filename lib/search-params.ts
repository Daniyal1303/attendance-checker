/** A Next.js resolved search-param value. */
export type SearchParamValue = string | string[] | undefined;

/** Returns the first value of a search param, or an empty string when absent. */
export function firstParam(value: SearchParamValue): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

/** Reads and trims the search term from a `q`-style param. */
export function parseSearch(value: SearchParamValue): string {
  return firstParam(value).trim();
}

/** Reads a 1-based page number, falling back to 1 for missing/invalid input. */
export function parsePage(value: SearchParamValue): number {
  const page = Number.parseInt(firstParam(value), 10);
  return Number.isNaN(page) || page < 1 ? 1 : page;
}
