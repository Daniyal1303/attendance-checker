import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { AttendanceReport, AttendanceStatus } from "@/lib/types";

export type StatusTone = "success" | "danger" | "warning";

/** Maps an attendance status to its badge tone. */
export const statusTone: Record<AttendanceStatus, StatusTone> = {
  PRESENT: "success",
  ABSENT: "danger",
  LATE: "warning",
};

/** Returns the localized label for an attendance status. */
export function statusLabel(
  status: AttendanceStatus,
  dict: Dictionary["reports"],
): string {
  return status === "PRESENT"
    ? dict.present
    : status === "ABSENT"
      ? dict.absent
      : dict.late;
}

/** Serializes a report to CSV (User, Date, Status rows). */
export function buildReportCsv(report: AttendanceReport): string {
  const header = ["User", "Date", "Status"];
  const rows = report.reports.flatMap((entry) =>
    entry.entries.map((row) => [
      `${entry.user.firstName} ${entry.user.lastName}`,
      row.date,
      row.status,
    ]),
  );
  return [header, ...rows].map((cols) => cols.join(",")).join("\n");
}

/** Builds the human-readable summary text shared via the Web Share API or clipboard. */
export function buildReportShareText(
  report: AttendanceReport,
  dict: Dictionary["reports"],
): string {
  const lines = report.reports.map(
    (entry) =>
      `${entry.user.firstName} ${entry.user.lastName}: ${dict.present} ${entry.totals.PRESENT}, ${dict.absent} ${entry.totals.ABSENT}, ${dict.late} ${entry.totals.LATE}`,
  );
  return `${dict.title} (${report.from} → ${report.to})\n${lines.join("\n")}`;
}

/** Triggers a browser download of the report as a CSV file. */
export function exportReportCsv(report: AttendanceReport): void {
  const blob = new Blob([buildReportCsv(report)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `attendance-${report.from}_${report.to}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/** Shares the report summary via the Web Share API, falling back to the clipboard. */
export async function shareReport(
  report: AttendanceReport,
  dict: Dictionary["reports"],
): Promise<void> {
  const payload = buildReportShareText(report, dict);
  if (navigator.share) {
    await navigator.share({ title: dict.title, text: payload });
  } else {
    await navigator.clipboard.writeText(payload);
  }
}
