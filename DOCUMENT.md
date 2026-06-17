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
| 1 | Register user | Admin creates a user (name, etc.). | ✅ Done |
| 2 | Mark attendance | Admin marks a user present/absent/late for a date. | ✅ Done |
| 3 | Report — single user | Attendance for one user over a date range. | ✅ Done |
| 4 | Report — all users | Attendance for all users over a date range. | ✅ Done |
| 5 | Share report | Export/share the generated report. | ✅ Done |
| 6 | i18n (en/ur) | Full app translation; Urdu is RTL. | ✅ Done |

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
proxy.ts                  # locale redirect + Supabase session refresh + route guard
components/
  ui/                     # radix-based primitives
  features/{users,attendance,reports}/
lib/
  i18n/
    config.ts             # locales, defaultLocale
    dictionaries.ts       # getDictionary(lang) — server-only loader
    dictionaries/{en,ur}.json
  supabase/               # auth clients: server.ts, client.ts, config.ts (env + username→email)
  types/                  # shared domain types
  validations/            # zod schemas (single source of types + runtime validation)
  logger.ts               # structured logging wrapper
  db/                     # Prisma client singleton (pg driver adapter)
  data/                   # data-access layer (all Prisma queries live here)
  actions/                # "use server" form actions; validate → call data → FormState (incl. auth.ts)
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
| 2026-06-16 | Prisma 7 client via `@prisma/adapter-pg` driver adapter | Prisma 7 `prisma-client` generator requires a driver adapter; pg adapter takes `DATABASE_URL` connection string. |
| 2026-06-16 | Report share = Web Share API + CSV export (client-side) | No backend needed; `navigator.share` with clipboard fallback, CSV via Blob download. |
| 2026-06-16 | Feature components under `components/features/{users,attendance,reports}/` | Server pages stay thin; client interactivity (forms, marking) isolated in feature components. |
| 2026-06-16 | Admin auth via Supabase Auth (`@supabase/ssr`) | Hosted sessions/password handling; cookie session refreshed in `proxy.ts`, app routes guarded there. |
| 2026-06-16 | Username login mapped to synthetic email `<username>@AUTH_EMAIL_DOMAIN` | Supabase Auth keys on email; single admin signs in with a username, action maps it before `signInWithPassword`. |

## 9. Open questions

- ~~Auth: how does the admin authenticate?~~ **Resolved:** Supabase Auth. Admin signs in with a
  username (mapped to `<username>@AUTH_EMAIL_DOMAIN`) + password; create the admin in the Supabase
  dashboard (Authentication > Users) with that synthetic email. Requires `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `AUTH_EMAIL_DOMAIN` (see `.env.example`).
