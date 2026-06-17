import { ReportBuilder } from "@/components/features/reports/report-builder";
import { listUsers } from "@/lib/data/users";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export default async function ReportsPage({ params }: PageProps<"/[lang]/reports">) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const users = await listUsers();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">{dict.reports.title}</h1>
      </header>
      <ReportBuilder
        lang={lang as Locale}
        users={users.map((u) => ({ id: u.id, firstName: u.firstName, lastName: u.lastName }))}
        dict={dict.reports}
        common={dict.common}
      />
    </div>
  );
}
