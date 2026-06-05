# Attendance Checker

Mobile-first, responsive attendance web app. Single **admin** role: registers users, marks
attendance, and shares attendance reports (per user or all users, over a date range).
Fully internationalized: **English (en)** and **Urdu (ur)**. See `DOCUMENT.md` for the full
spec, domain model, architecture, and decisions.

> **Next 16 note:** this is a modified Next.js with breaking changes vs. older versions
> (e.g. middleware is `proxy.ts`). When unsure of an API, check `node_modules/next/dist/docs/`.

## Stack

- Next.js 16 (App Router), React 19, TypeScript.
- UI: Radix UI + shadcn-style components in `components/ui`, Tailwind v4, `lucide-react`.
- DB: **Supabase (Postgres)**. ORM: **Prisma** (`prisma/schema.prisma`, client in `lib/db`).
- Validation: `zod`.

## Commands

- `yarn dev` — start dev server
- `yarn build` / `yarn start` — production build / run
- `yarn lint` — eslint
- `yarn prisma migrate dev` — create/apply a migration
- `yarn prisma generate` — regenerate the Prisma client

## Code rules

- **Use proper, explicit types — never `any`.** Prefer `type` aliases for object shapes and
  unions. Define `zod` schemas in `lib/validations` and infer types from them; keep shared
  domain types in `lib/types`. Use Next's `PageProps`/`LayoutProps` route helpers.
- **DB access only through Prisma** in the data layer (`lib/data`). Don't scatter queries in components.
- **Logging:** route everything through `lib/logger.ts`. No stray `console.log` in committed code.
- **Mobile-first** and responsive. Verify UI with a screenshot before calling it done.
- **No dead code.** Keep the tree symmetric with `DOCUMENT.md`; delete unused files instead of leaving them.
- **Comments:** use JSDoc (`/** ... */`) to document exports where it adds value. Avoid `//` line
  comments — prefer clear names and self-explanatory code.

## i18n (English + Urdu)

- All user-facing strings come from `lib/i18n/dictionaries/{en,ur}.json` — never hardcode UI text.
- Urdu is **RTL**: use Tailwind logical properties (`ps-/pe-/ms-/me-/start-/end-`), not `left/right`.

## Documentation policy

- **No changelog in this file** — git is the source of truth for changes.
- When you add or change a feature, update the relevant section + the Features/Decisions
  tables in `DOCUMENT.md`. Keep this file lean (rules only).
