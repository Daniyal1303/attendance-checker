import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { isLocale, localeDirection, locales } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "AttenDO — Timesheet tracking",
  description: "Lightweight weekly timesheets for modern teams.",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} dir={localeDirection[lang]}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
