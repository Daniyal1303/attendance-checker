import "server-only";
import { prisma } from "@/lib/db";
import {
  resolvePagination,
  type PageParams,
  type Paginated,
} from "@/lib/pagination";
import type { AttendanceStatus } from "@/lib/types";
import type { MarkAttendanceInput } from "@/lib/validations";
import { userSearchWhere } from "./users";

/** Number of users shown per page on the attendance board. */
export const ATTENDANCE_PAGE_SIZE = 8;

export type DailyAttendance = {
  id: string;
  firstName: string;
  lastName: string;
  status: AttendanceStatus | null;
};

/**
 * Returns users with their status for `date`, paginated and filtered by an
 * optional search term over name/email/phone.
 */
export async function getDailyAttendance(
  date: string,
  params: PageParams = {},
): Promise<Paginated<DailyAttendance>> {
  const pageSize = params.pageSize ?? ATTENDANCE_PAGE_SIZE;
  const where = userSearchWhere(params.search);

  const total = await prisma.user.count({ where });
  const { page, totalPages, skip, take } = resolvePagination(
    total,
    params.page,
    pageSize,
  );

  const users = await prisma.user.findMany({
    where,
    orderBy: { firstName: "asc" },
    skip,
    take,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      attendance: {
        where: { date: new Date(date) },
        select: { status: true },
        take: 1,
      },
    },
  });

  const items = users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    status: user.attendance[0]?.status ?? null,
  }));

  return { items, total, page, pageSize, totalPages };
}

export async function markAttendance(input: MarkAttendanceInput) {
  const date = new Date(input.date);
  return prisma.attendanceRecord.upsert({
    where: { userId_date: { userId: input.userId, date } },
    create: { userId: input.userId, date, status: input.status },
    update: { status: input.status },
  });
}
