"use client";
import { useActionState } from "react";
import { Download, FileBarChart, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { generateReportAction } from "@/lib/actions/reports";
import { formatDate } from "@/lib/format";
import { exportReportCsv, shareReport, statusLabel, statusTone } from "@/lib/reports";
import { idleState, type AttendanceReport, type FormState } from "@/lib/types";
import type { ReportBuilderProps } from "./types";

export function ReportBuilder({ lang, users, dict, common }: ReportBuilderProps) {
  const [state, action, pending] = useActionState<FormState<AttendanceReport>, FormData>(
    generateReportAction,
    idleState,
  );
  const report = state.status === "success" ? state.data : null;
  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <FileBarChart className="h-5 w-5 text-blue-600" />
            {dict.title}
          </h2>
        </CardHeader>
        <CardBody>
          <form action={action} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="scope">{dict.scope}</Label>
              <Select id="scope" name="scope" defaultValue="all">
                <option value="all">{dict.all}</option>
                <option value="single">{dict.single}</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="userId">{dict.selectUser}</Label>
              <Select id="userId" name="userId" defaultValue="">
                <option value="">{common.all}</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName}
                  </option>
                ))}
              </Select>
              {fieldErrors?.userId ? (
                <p className="text-xs text-red-600">{fieldErrors.userId[0]}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="from">{common.from}</Label>
              <Input id="from" name="from" type="date" required />
              {fieldErrors?.from ? (
                <p className="text-xs text-red-600">{fieldErrors.from[0]}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="to">{common.to}</Label>
              <Input id="to" name="to" type="date" required />
              {fieldErrors?.to ? (
                <p className="text-xs text-red-600">{fieldErrors.to[0]}</p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              {state.status === "error" && state.message ? (
                <p className="mb-3 text-sm text-red-600">{state.message}</p>
              ) : null}
              <Button type="submit" disabled={pending} className="w-full sm:w-auto">
                {dict.generate}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {report ? (
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-slate-900">{dict.summary}</h2>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => shareReport(report, dict)}
              >
                <Share2 className="h-4 w-4" />
                {dict.share}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => exportReportCsv(report)}
              >
                <Download className="h-4 w-4" />
                {dict.export}
              </Button>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            {report.reports.every((r) => r.entries.length === 0) ? (
              <p className="px-6 py-10 text-center text-sm text-slate-500">{dict.empty}</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {report.reports.map((r) => (
                  <li key={r.user.id} className="px-6 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {r.user.firstName} {r.user.lastName}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge tone="success">
                          {dict.present} {r.totals.PRESENT}
                        </Badge>
                        <Badge tone="danger">
                          {dict.absent} {r.totals.ABSENT}
                        </Badge>
                        <Badge tone="warning">
                          {dict.late} {r.totals.LATE}
                        </Badge>
                      </div>
                    </div>
                    {r.entries.length > 0 ? (
                      <div className="mt-3 overflow-hidden rounded-lg border border-slate-100">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                              <th className="px-3 py-2 text-start font-semibold">
                                {common.date}
                              </th>
                              <th className="px-3 py-2 text-end font-semibold">
                                {common.status}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {r.entries.map((e) => (
                              <tr key={e.date}>
                                <td className="px-3 py-2 text-slate-700">
                                  {formatDate(e.date, lang)}
                                </td>
                                <td className="px-3 py-2 text-end">
                                  <Badge tone={statusTone[e.status]}>
                                    {statusLabel(e.status, dict)}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}
