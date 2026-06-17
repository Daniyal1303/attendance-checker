import { Mail, Phone, Users as UsersIcon } from "lucide-react";
import { RegisterUserForm } from "@/components/features/users/register-user-form";
import { UserRowActions } from "@/components/features/users/user-row-actions";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { listUsers } from "@/lib/data/users";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { parsePage, parseSearch } from "@/lib/search-params";
import type { Locale } from "@/lib/i18n/config";

function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatDate(date: Date, lang: Locale): string {
  return new Intl.DateTimeFormat(lang, { dateStyle: "medium" }).format(date);
}

export default async function UsersPage({
  params,
  searchParams,
}: PageProps<"/[lang]/users">) {
  const { lang } = await params;
  const sp = await searchParams;

  const search = parseSearch(sp.q);

  const dict = await getDictionary(lang as Locale);
  const { items: users, total, page, totalPages } = await listUsers({
    search,
    page: parsePage(sp.page),
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">
          {dict.users.title}
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <RegisterUserForm dict={dict.users} />

        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <UsersIcon className="h-5 w-5 text-blue-600" />
              {dict.users.title}
            </h2>
            <span className="text-sm font-medium text-slate-500">{total}</span>
          </CardHeader>
          <CardBody className="space-y-4 p-0 pt-4">
            <div className="px-6">
              <SearchInput placeholder={dict.users.searchPlaceholder} />
            </div>

            {users.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-slate-500">
                {search ? dict.users.noResults : dict.users.empty}
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {users.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center gap-3 px-6 py-3.5"
                  >
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                      {initials(user.firstName, user.lastName)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
                        {user.email ? (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </span>
                        ) : null}
                        {user.phone ? (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="hidden flex-none text-end text-xs text-slate-400 sm:block">
                      <p>{dict.users.registeredOn}</p>
                      <p className="font-medium text-slate-600">
                        {formatDate(user.createdAt, lang as Locale)}
                      </p>
                    </div>
                    <UserRowActions
                      user={user}
                      dict={dict.users}
                      common={dict.common}
                    />
                  </li>
                ))}
              </ul>
            )}

            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                labels={{
                  previous: dict.users.previous,
                  next: dict.users.next,
                }}
              />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
