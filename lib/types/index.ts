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

/**
 * Discriminated result returned by server actions. Designed for use with
 * React's `useActionState`: `idle` is the initial state, `success` carries the
 * action payload, and `error` carries a message plus optional per-field errors.
 */
export type FormState<T = undefined> =
  | { status: "idle" }
  | { status: "success"; data: T }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> };

export const idleState: FormState<never> = { status: "idle" };
