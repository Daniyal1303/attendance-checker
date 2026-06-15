"use server";
import { z } from "zod";
import { getAttendanceReport } from "@/lib/data/reports";
import { logger } from "@/lib/logger";
import type { AttendanceReport, FormState } from "@/lib/types";
import { reportRequestSchema } from "@/lib/validations";
import { field } from "./form-data";

/** Builds a single-user or all-users attendance report over a date range (features 3-4). */
export async function generateReportAction(
  _prev: FormState<AttendanceReport>,
  formData: FormData,
): Promise<FormState<AttendanceReport>> {
  const parsed = reportRequestSchema.safeParse({
    scope: field(formData, "scope"),
    userId: field(formData, "userId"),
    from: field(formData, "from"),
    to: field(formData, "to"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please complete the report options.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    const report = await getAttendanceReport(parsed.data);
    logger.info("report.generated", {
      scope: parsed.data.scope,
      from: parsed.data.from,
      to: parsed.data.to,
      users: report.reports.length,
    });
    return { status: "success", data: report };
  } catch (error) {
    logger.error("report.generate_failed", { error: String(error) });
    return { status: "error", message: "Could not build the report. Please try again." };
  }
}
