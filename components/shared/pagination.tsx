"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Pagination as PaginationNav,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export type PaginationLabels = {
  previous: string;
  next: string;
};

type PaginationProps = {
  page: number;
  totalPages: number;
  labels: PaginationLabels;
  /** Query param the page number is written to. Defaults to `page`. */
  paramName?: string;
  /** Overrides the container padding/border (e.g. when standalone vs. in a card). */
  className?: string;
};

/** Builds the visible page sequence with `ellipsis` gaps around the current page. */
function pageItems(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  const items: (number | "ellipsis")[] = [1];
  if (left > 2) items.push("ellipsis");
  for (let page = left; page <= right; page += 1) items.push(page);
  if (right < total - 1) items.push("ellipsis");
  items.push(total);
  return items;
}

/**
 * URL-driven pagination built on the shadcn `Pagination` primitive. Each control
 * is a real `<Link>` (SSR-friendly, middle-click works) targeting the same path
 * with an updated page param. Reusable across any list route.
 */
export function Pagination({
  page,
  totalPages,
  labels,
  paramName = "page",
  className,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hrefFor = (target: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (target <= 1) params.delete(paramName);
    else params.set(paramName, String(target));
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <PaginationNav
      className={cn(className ?? "border-t border-slate-100 px-6 py-3")}
    >
      <PaginationContent>
        <PaginationItem>
          {isFirst ? (
            <PaginationLink
              size="md"
              aria-disabled
              className="gap-1 px-2.5 pointer-events-none opacity-50"
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              <span className="hidden sm:inline">{labels.previous}</span>
            </PaginationLink>
          ) : (
            <PaginationLink asChild size="md" className="gap-1 px-2.5">
              <Link href={hrefFor(page - 1)} aria-label={labels.previous}>
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                <span className="hidden sm:inline">{labels.previous}</span>
              </Link>
            </PaginationLink>
          )}
        </PaginationItem>

        {pageItems(page, totalPages).map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item} className="hidden sm:list-item">
              <PaginationLink asChild isActive={item === page}>
                <Link href={hrefFor(item)}>{item}</Link>
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          {isLast ? (
            <PaginationLink
              size="md"
              aria-disabled
              className="gap-1 px-2.5 pointer-events-none opacity-50"
            >
              <span className="hidden sm:inline">{labels.next}</span>
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </PaginationLink>
          ) : (
            <PaginationLink asChild size="md" className="gap-1 px-2.5">
              <Link href={hrefFor(page + 1)} aria-label={labels.next}>
                <span className="hidden sm:inline">{labels.next}</span>
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </PaginationLink>
          )}
        </PaginationItem>
      </PaginationContent>
    </PaginationNav>
  );
}
