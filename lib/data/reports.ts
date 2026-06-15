import "server-only";
import { prisma } from "@/lib/db";
import { AttendanceStatus } from "@/lib/generated/prisma/enums";
import type { AttendanceReport, UserReport } from "@/lib/types";
import type { ReportRequest } from "@/lib/validations";

function emptyTotals(): Record<AttendanceStatus, number> {
  return { [AttendanceStatus.PRESENT]: 0, [AttendanceStatus.ABSENT]: 0, [AttendanceStatus.LATE]: 0 };
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Builds an attendance report for a date range. When `scope` is `single` the
 * report contains only the requested user; when `all` it covers every user.
 * Both `from` and `to` are inclusive ISO dates (YYYY-MM-DD).
 */
export async function getAttendanceReport(input: ReportRequest): Promise<AttendanceReport> {
  const users = await prisma.user.findMany({
    where: input.scope === "single" ? { id: input.userId } : undefined,
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      attendance: {
        where: { date: { gte: new Date(input.from), lte: new Date(input.to) } },
        orderBy: { date: "asc" },
        select: { date: true, status: true },
      },
    },
  });

  const reports: UserReport[] = users.map((user) => {
    const totals = emptyTotals();
    const entries = user.attendance.map((record) => {
      totals[record.status] += 1;
      return { date: toIsoDate(record.date), status: record.status };
    });

    return {
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName },
      entries,
      totals,
    };
  });

  return { from: input.from, to: input.to, reports };
}
