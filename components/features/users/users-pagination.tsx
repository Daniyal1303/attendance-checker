"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type UsersPaginationProps = {
  page: number;
  totalPages: number;
  labels: { previous: string; next: string; pageInfo: string };
};

/** Prev/next pagination wired to the `page` query param. */
export function UsersPagination({ page, totalPages, labels }: UsersPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goTo(target: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (target <= 1) params.delete("page");
    else params.set("page", String(target));
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const info = labels.pageInfo
    .replace("{page}", String(page))
    .replace("{totalPages}", String(totalPages));

  return (
    <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-6 py-3">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
        <span className="hidden sm:inline">{labels.previous}</span>
      </Button>
      <span className="text-xs font-medium text-slate-500">{info}</span>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
      >
        <span className="hidden sm:inline">{labels.next}</span>
        <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
      </Button>
    </div>
  );
}
