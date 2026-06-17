"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchInput } from "@/components/shared/search-input";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AttendanceToolbarProps = {
  date: string;
  selectDateLabel: string;
  searchPlaceholder: string;
};

/**
 * Date picker and user search for the attendance board. Lives above the keyed
 * board so the search input keeps focus across re-queries.
 */
export function AttendanceToolbar({
  date,
  selectDateLabel,
  searchPlaceholder,
}: AttendanceToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const changeDate = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", value);
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Card>
      <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-1.5 sm:w-56">
          <Label htmlFor="date">{selectDateLabel}</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(event) => changeDate(event.target.value)}
          />
        </div>
        <div className="flex-1">
          <SearchInput placeholder={searchPlaceholder} />
        </div>
      </CardBody>
    </Card>
  );
}
