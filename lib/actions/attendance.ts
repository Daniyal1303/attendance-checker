"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { markAttendance } from "@/lib/data/attendance";
import { logger } from "@/lib/logger";
import type { FormState } from "@/lib/types";
import { markAttendanceSchema } from "@/lib/validations";
import { field } from "./form-data";

/** Marks a single user present/absent/late for a date (feature 2). */
export async function markAttendanceAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = markAttendanceSchema.safeParse({
    userId: field(formData, "userId"),
    date: field(formData, "date"),
    status: field(formData, "status"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please choose a user, date, and status.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    await markAttendance(parsed.data);
    logger.info("attendance.marked", {
      userId: parsed.data.userId,
      date: parsed.data.date,
      status: parsed.data.status,
    });
    revalidatePath("/attendance");
    return { status: "success", data: undefined };
  } catch (error) {
    logger.error("attendance.mark_failed", { error: String(error) });
    return { status: "error", message: "Could not save attendance. Please try again." };
  }
}
