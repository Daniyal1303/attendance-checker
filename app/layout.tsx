import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AttenDO — Timesheet tracking",
  description: "Lightweight weekly timesheets for modern teams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
