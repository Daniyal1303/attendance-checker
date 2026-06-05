import "server-only";
import { prisma } from "@/lib/db";
import type { AttendanceStatus } from "@/lib/types";
import type { MarkAttendanceInput } from "@/lib/validations";

export type DailyAttendance = {
  id: string;
  firstName: string;
  lastName: string;
  status: AttendanceStatus | null;
};

export async function getDailyAttendance(date: string): Promise<DailyAttendance[]> {
  const users = await prisma.user.findMany({
    orderBy: { firstName: "asc" },
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

  return users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    status: user.attendance[0]?.status ?? null,
  }));
}

export async function markAttendance(input: MarkAttendanceInput) {
  const date = new Date(input.date);
  return prisma.attendanceRecord.upsert({
    where: { userId_date: { userId: input.userId, date } },
    create: { userId: input.userId, date, status: input.status },
    update: { status: input.status },
  });
}
