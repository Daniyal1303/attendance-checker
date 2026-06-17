import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const attendanceStatusSchema = z.enum(["PRESENT", "ABSENT", "LATE"]);

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(64),
  password: z.string().min(1),
});

export const registerUserSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.preprocess(emptyToUndefined, z.string().trim().email().optional()),
  phone: z.preprocess(
    emptyToUndefined,
    z.string().trim().min(5).max(20).optional(),
  ),
});

export const updateUserSchema = registerUserSchema.extend({
  id: z.string().min(1),
});

export const deleteUserSchema = z.object({
  id: z.string().min(1),
});

export const markAttendanceSchema = z.object({
  userId: z.string().min(1),
  date: z.iso.date(),
  status: attendanceStatusSchema,
});

export const reportRequestSchema = z
  .object({
    scope: z.enum(["single", "all"]),
    userId: z.string().min(1).optional(),
    from: z.iso.date(),
    to: z.iso.date(),
  })
  .refine((value) => value.scope === "all" || Boolean(value.userId), {
    message: "Select a user for a single-user report.",
    path: ["userId"],
  })
  .refine((value) => value.from <= value.to, {
    message: "The start date must be on or before the end date.",
    path: ["to"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>;
export type ReportRequest = z.infer<typeof reportRequestSchema>;
