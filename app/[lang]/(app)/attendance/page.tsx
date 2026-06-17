import { AttendanceBoard } from "@/components/features/attendance/attendance-board";
import { getDailyAttendance } from "@/lib/data/attendance";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function AttendancePage({
  params,
  searchParams,
}: PageProps<"/[lang]/attendance">) {
  const { lang } = await params;
  const { date } = await searchParams;
  const dict = await getDictionary(lang as Locale);

  const selectedDate = typeof date === "string" ? date : todayIso();
  const rows = await getDailyAttendance(selectedDate);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">{dict.attendance.title}</h1>
      </header>
      <AttendanceBoard
        key={selectedDate}
        date={selectedDate}
        rows={rows}
        dict={dict.attendance}
      />
    </div>
  );
}
