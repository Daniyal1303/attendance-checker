"use client";
import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Check, Clock, X } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { markAttendanceAction } from "@/lib/actions/attendance";
import type { DailyAttendance } from "@/lib/data/attendance";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { idleState, type AttendanceStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type AttendanceBoardProps = {
  date: string;
  rows: DailyAttendance[];
  dict: Dictionary["attendance"];
};

const options: {
  status: AttendanceStatus;
  key: "present" | "absent" | "late";
  Icon: typeof Check;
  active: string;
}[] = [
  { status: "PRESENT", key: "present", Icon: Check, active: "border-emerald-500 bg-emerald-50 text-emerald-700" },
  { status: "ABSENT", key: "absent", Icon: X, active: "border-red-500 bg-red-50 text-red-700" },
  { status: "LATE", key: "late", Icon: Clock, active: "border-amber-500 bg-amber-50 text-amber-700" },
];

function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/** Date picker plus a per-user present/absent/late selector wired to {@link markAttendanceAction}. */
export function AttendanceBoard({ date, rows, dict }: AttendanceBoardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus | null>>(
    () => Object.fromEntries(rows.map((r) => [r.id, r.status])),
  );
  const [savingId, setSavingId] = useState<string | null>(null);

  const changeDate = (value: string) => {
    router.replace(`${pathname}?date=${value}`);
  };

  const mark = (userId: string, status: AttendanceStatus) => {
    setSavingId(userId);
    const formData = new FormData();
    formData.set("userId", userId);
    formData.set("date", date);
    formData.set("status", status);
    startTransition(async () => {
      const result = await markAttendanceAction(idleState, formData);
      if (result.status === "success") {
        setStatuses((prev) => ({ ...prev, [userId]: status }));
      }
      setSavingId(null);
    });
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardBody className="flex flex-col gap-1.5">
          <Label htmlFor="date">{dict.selectDate}</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => changeDate(e.target.value)}
            className="sm:w-56"
          />
        </CardBody>
      </Card>

      {rows.length === 0 ? (
        <Card>
          <CardBody>
            <p className="py-8 text-center text-sm text-slate-500">{dict.noUsers}</p>
          </CardBody>
        </Card>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => {
            const current = statuses[row.id] ?? null;
            const isSaving = pending && savingId === row.id;
            return (
              <li key={row.id}>
                <Card>
                  <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                        {initials(row.firstName, row.lastName)}
                      </span>
                      <p className="text-sm font-semibold text-slate-900">
                        {row.firstName} {row.lastName}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "grid grid-cols-3 gap-2 sm:flex",
                        isSaving && "pointer-events-none opacity-60",
                      )}
                    >
                      {options.map(({ status, key, Icon, active }) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => mark(row.id, status)}
                          aria-pressed={current === status}
                          className={cn(
                            "flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                            current === status
                              ? active
                              : "border-slate-200 text-slate-600 hover:bg-slate-50",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {dict[key]}
                        </button>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
