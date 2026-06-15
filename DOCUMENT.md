# Attendance Checker — Project Document

> Living spec. Update the relevant section whenever a feature is added or changed.
> This is the human/architecture doc. Conventions Claude must follow live in `AGENTS.md`.

## 1. Overview

A mobile-first, responsive web app for managing attendance. A single **admin** role
registers users, marks their attendance, and shares attendance reports. The entire UI
is internationalized: **English (en)** and **Urdu (ur)**.

- **Framework:** Next.js 16 (App Router) — note: this is a modified Next, see `AGENTS.md`.
- **UI:** Radix UI primitives + shadcn-style components in `components/ui`, Tailwind v4, `lucide-react` icons.
- **DB:** Supabase (Postgres). **ORM:** Prisma.
- **Language:** TypeScript (no `any`, prefer `type` aliases — see conventions).
- **Design reference:** `design/` (Stitch mockups: screens + DESIGN.md). Reference only — never imported.

## 2. Features

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 1 | Register user | Admin creates a user (name, etc.). | ☐ Planned |
| 2 | Mark attendance | Admin marks a user present/absent/late for a date. | ☐ Planned |
| 3 | Report — single user | Attendance for one user over a date range. | ☐ Planned |
| 4 | Report — all users | Attendance for all users over a date range. | ☐ Planned |
| 5 | Share report | Export/share the generated report. | ☐ Planned |
| 6 | i18n (en/ur) | Full app translation; Urdu is RTL. | ☐ Planned |

## 3. Architecture / Folder structure

```
app/
  [lang]/                 # locale segment wraps the whole app
    layout.tsx            # sets <html lang dir>, loads dictionary
    (auth)/login/
    (app)/
      layout.tsx
      users/              # register + list users (feature 1)
      attendance/         # mark attendance (feature 2)
      reports/            # build + share reports (features 3-5)
proxy.ts                  # locale detection/redirect (Next 16's renamed middleware)
components/
  ui/                     # radix-based primitives
  features/{users,attendance,reports}/
lib/
  i18n/
    config.ts             # locales, defaultLocale
    dictionaries.ts       # getDictionary(lang) — server-only loader
    dictionaries/{en,ur}.json
  types/                  # shared domain types
  validations/            # zod schemas (single source of types + runtime validation)
  logger.ts               # structured logging wrapper
  db/                     # Prisma client singleton
  data/                   # data-access layer (all Prisma queries live here)
  actions/                # "use server" form actions; validate → call data → FormState
prisma/
  schema.prisma           # models: User, AttendanceRecord
design/                   # Stitch design mockups (reference only, never imported)
```

## 4. Domain model (draft)

```ts
type UserId = string;

interface User {
  id: UserId;
  name: string;
  createdAt: string; // ISO
}

type AttendanceStatus = "present" | "absent" | "late";

interface AttendanceRecord {
  id: string;
  userId: UserId;
  date: string;            // ISO date (YYYY-MM-DD)
  status: AttendanceStatus;
}

interface ReportRequest {
  scope: "single" | "all";
  userId?: UserId;         // required when scope === "single"
  from: string;            // ISO date
  to: string;              // ISO date
}
```

> Keep these in `lib/types` (or derive from zod schemas in `lib/validations`). Never use `any`.

## 5. Internationalization

- Locales: `en` (LTR, default), `ur` (RTL).
- Route segment `app/[lang]/...`; locale resolved/redirected in `proxy.ts`.
- Strings live in `lib/i18n/dictionaries/{en,ur}.json`; loaded via `getDictionary(lang)`.
- `[lang]/layout.tsx` sets `<html lang={lang} dir={lang === "ur" ? "rtl" : "ltr"}>`.
- Use Tailwind **logical** properties (`ps-/pe-/ms-/me-/start-/end-`) so RTL works automatically.

## 6. Logging

- Single wrapper in `lib/logger.ts` (e.g. `logger.info/warn/error`) so the impl can change.
- Server code logs structured events (action, userId, outcome). Avoid logging PII beyond need.
- Don't leave `console.log` debugging in committed code; route through the logger.

## 7. Conventions (summary — full rules in `AGENTS.md`)

- No `any`. Prefer zod schemas → infer types.
- Read the relevant `node_modules/next/dist/docs/` guide before using a Next API.
- Mobile-first; verify with screenshots before considering UI done.

## 8. Decisions log

| Date | Decision | Why |
|------|----------|-----|
| 2026-06-05 | Use `app/[lang]` + dictionaries for i18n | Matches bundled Next 16 i18n guide; no heavy lib needed. |
| 2026-06-05 | Locale detection in `proxy.ts` | Next 16 renamed `middleware` → `proxy`. |
| 2026-06-05 | Supabase (Postgres) + Prisma | Hosted Postgres + typed ORM; queries isolated in `lib/data`. |
| 2026-06-15 | Server actions in `lib/actions` return a `FormState` discriminated union | Drop-in for `useActionState`; zod validation maps to per-field errors; pages stay thin. |

## 9. Open questions

- Auth: how does the admin authenticate? (Supabase Auth vs custom; login UI exists, backend TBD)
- Report sharing: file export (CSV/PDF) vs share link vs both?
