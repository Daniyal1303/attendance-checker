import { AttendanceBoard } from "@/components/features/attendance/attendance-board";
import { AttendanceToolbar } from "@/components/features/attendance/attendance-toolbar";
import { Pagination } from "@/components/shared/pagination";
import { Card } from "@/components/ui/card";
import { getDailyAttendance } from "@/lib/data/attendance";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { firstParam, parsePage, parseSearch } from "@/lib/search-params";
import type { Locale } from "@/lib/i18n/config";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function AttendancePage({
  params,
  searchParams,
}: PageProps<"/[lang]/attendance">) {
  const { lang } = await params;
  const sp = await searchParams;
  const dict = await getDictionary(lang as Locale);

  const selectedDate = firstParam(sp.date) || todayIso();
  const search = parseSearch(sp.q);
  const { items: rows, page, totalPages } = await getDailyAttendance(selectedDate, {
    search,
    page: parsePage(sp.page),
  });

  const emptyMessage = search ? dict.attendance.noResults : dict.attendance.noUsers;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">{dict.attendance.title}</h1>
      </header>

      <div className="space-y-5">
        <AttendanceToolbar
          date={selectedDate}
          selectDateLabel={dict.attendance.selectDate}
          searchPlaceholder={dict.attendance.searchPlaceholder}
        />

        <AttendanceBoard
          key={`${selectedDate}:${page}:${search}`}
          date={selectedDate}
          rows={rows}
          dict={dict.attendance}
          emptyMessage={emptyMessage}
        />

        {totalPages > 1 && (
          <Card>
            <Pagination
              page={page}
              totalPages={totalPages}
              className="px-6 py-3"
              labels={{
                previous: dict.attendance.previous,
                next: dict.attendance.next,
              }}
            />
          </Card>
        )}
      </div>
    </div>
  );
}
