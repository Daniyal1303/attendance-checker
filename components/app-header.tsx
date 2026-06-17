"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, LogOut, Users, CalendarCheck, BarChart3 } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";
import { Logo } from "@/components/ui/logo";
import { locales, localeLabels, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

type AppHeaderProps = {
  lang: Locale;
  nav: Dictionary["nav"];
  common: Pick<Dictionary["common"], "signOut" | "language">;
};

const icons = {
  users: Users,
  attendance: CalendarCheck,
  reports: BarChart3,
} as const;

/** Top navigation bar: locale-prefixed feature links, a language toggle, and sign out. */
export function AppHeader({ lang, nav, common }: AppHeaderProps) {
  const pathname = usePathname();
  const links = (["users", "attendance", "reports"] as const).map((key) => ({
    key,
    href: `/${lang}/${key}`,
    label: nav[key],
    Icon: icons[key],
  }));

  const otherLocale = locales.find((l) => l !== lang) ?? lang;
  const switchHref = pathname.replace(`/${lang}`, `/${otherLocale}`);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href={`/${lang}/users`}>
            <Logo variant="dark" />
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {links.map(({ key, href, label, Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={key}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href={switchHref}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label={common.language}
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{localeLabels[otherLocale]}</span>
          </Link>
          <form action={signOutAction}>
            <input type="hidden" name="lang" value={lang} />
            <button
              type="submit"
              className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              aria-label={common.signOut}
            >
              <LogOut className="h-[18px] w-[18px]" />
            </button>
          </form>
        </div>
      </div>

      <nav className="flex items-center gap-1 border-t border-slate-100 px-4 py-2 sm:hidden">
        {links.map(({ key, href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={key}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-md py-1.5 text-xs font-medium transition-colors",
                active ? "bg-blue-50 text-blue-700" : "text-slate-600",
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
