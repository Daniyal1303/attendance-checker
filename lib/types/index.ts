import type { AttendanceStatus } from "@/lib/generated/prisma/enums";

export type { AttendanceStatus };

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  createdAt: Date;
};

export type AttendanceEntry = {
  date: string;
  status: AttendanceStatus;
};

export type UserReport = {
  user: Pick<User, "id" | "firstName" | "lastName">;
  entries: AttendanceEntry[];
  totals: Record<AttendanceStatus, number>;
};

export type AttendanceReport = {
  from: string;
  to: string;
  reports: UserReport[];
};
