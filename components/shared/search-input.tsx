"use client";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type SearchInputProps = {
  placeholder: string;
  /** Query param the term is written to. Defaults to `q`. */
  paramName?: string;
  /** Param reset to its first page on every change. Defaults to `page`. */
  resetParam?: string;
  delay?: number;
};

/**
 * Debounced, URL-driven search box: reflects its value into a query param and
 * resets pagination, letting a Server Component re-query on navigation. Reusable
 * across any list route.
 */
export function SearchInput({
  placeholder,
  paramName = "q",
  resetParam = "page",
  delay = 300,
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get(paramName) ?? "");

  const commit = useDebouncedCallback((next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = next.trim();
    if (trimmed) params.set(paramName, trimmed);
    else params.delete(paramName);
    params.delete(resetParam);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, delay);

  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          commit(event.target.value);
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className="ps-9"
      />
    </div>
  );
}
