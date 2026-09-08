# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **npm**. Husky runs `lint-staged` (eslint --fix + prettier) on pre-commit.

```bash
npm run dev                 # next dev on http://localhost:3000
npm run build / npm start
npm run lint / npm run lint:fix
npm run typecheck           # tsc --noEmit
npm run format / npm run format:check
npm test                # vitest run (all)
npm run test:watch
npm run test:coverage       # v8 coverage; thresholds intentionally disabled in vitest.config.mts
npx vitest run src/lib/api/client.test.ts        # single file
npx vitest run -t "unwraps the envelope"          # single test by name
```

Next.js 16 removed `next lint` and `next build` no longer runs ESLint, so `lint`, `typecheck`, `format:check`, and `test` are separate quality gates and must all be run before considering a change done.

Env: copy `.env.example` to `.env.local`. `NEXT_PUBLIC_API_BASE_URL` is validated with Zod at import time in `src/config/env.ts` (throws if missing/invalid). Vitest injects a test value for it in `vitest.config.mts`, so any module importing `env` loads in tests.

## Architecture

Feature-first Next.js App Router starter. Stack: Next 16, React 19, TS strict, Tailwind v4, shadcn/ui (radix-nova style, `components.json`), TanStack Query 5, Zustand, next-themes, React Hook Form + Zod 4, Vitest + RTL. Path alias `@/*` → `src/*`.

### Two hard rules

1. **Server state → TanStack Query. Client/UI state → Zustand. Never mix.** Never copy `useQuery` data into a store. `src/stores/ui-store.ts` holds global UI state only (sidebar etc.).
2. **Default to server fetching.** Prefetch in a Server Component → `dehydrate` → `<HydrationBoundary>` → read on the client with `useApiQuery`. Both sides share the same `queryOptions()` object so key and fetch can never drift.

### Dependency direction

`app/` → `features/` → `lib/` / `components/` / `types/`. Features must not import from other features (`@/features/*/*` is blocked by ESLint `no-restricted-imports`); share via `@/lib`, `@/components`, or `@/types`.

### Data layer (read these together)

- `src/lib/api/client.ts` — thin `fetch` wrapper. Prefixes `env.apiBaseUrl`, runs a global request-interceptor registry, throws a single `ApiError` (status + optional field `errors`) on non-2xx, and **unwraps the `BaseResponse<T>` envelope** so callers get `T` directly. Not a `"use client"` module: it runs in both server prefetch and client code.
- `src/types/responses/base-response-type.ts` — the `{ success, message, data }` envelope, `PaginatedData`, and `ApiErrorBody`. Domain types (e.g. `User`) live in their feature's `types.ts`, not here.
- `src/lib/api/auth.ts` — auth slot. Registers a client-side cookie→Bearer interceptor once (called at module load in `app/providers.tsx`). The interceptor registry is a process-global, so **never push per-request server tokens onto it**; server prefetch must pass tokens explicitly. No concrete auth provider is wired yet (open decision).
- `src/lib/query/get-query-client.ts` — fresh `QueryClient` per request on the server, singleton in the browser; also dehydrates pending queries. `default-options.ts` sets a 1-minute `staleTime`, which the prefetch→hydrate pattern depends on (0 would refetch immediately on mount).
- `src/hooks/use-api.ts` — `useApiQuery(options)` (takes a `queryOptions` object, pins error type to `ApiError`) and `useApiMutation(path, method, { invalidate, ...})` (opt-in cache invalidation on success). These never fetch on their own.

### Feature slice pattern (`src/features/users` is the reference)

```
features/<name>/
  api/query-keys.ts     # key factory: all / list() / detail(id) — no stringly-typed keys elsewhere
  api/<name>-queries.ts # queryOptions() shared by server page and client component (NOT "use client")
  api/use-*.ts          # mutation hooks built on useApiMutation, invalidating via the key factory
  components/           # client components using useApiQuery / mutation hooks
  schema.ts             # Zod schema = single source of truth; types via z.infer, never hand-written
  types.ts              # domain types
```

Forms: React Hook Form + `zodResolver` for client validation (gate 1); on `ApiError` with `errors`, map server field errors back with `form.setError` (gate 2); other errors go to `sonner` toast. See `create-user-form.tsx`.

### Routing

- `src/app/page.tsx` — public landing. `dashboard/` — app-shell layout (`components/shared/dashboard-shell.tsx`) with example `/dashboard/users` page showing the full prefetch→hydrate path. `(auth)/` — minimal centered layout, auth provider slot.
- `app/providers.tsx` wires `ThemeProvider` + `QueryClientProvider`; root layout uses a title template (`"<page> | Tukucode"`).

### Testing boundary

Vitest (jsdom, globals on, `next/navigation` mocked in `vitest.setup.ts`) **cannot render async Server Components**. That is why fetch logic lives in `features/*/api` and `lib/api` as plain functions — test those directly (mock `fetch` with `vi.spyOn(globalThis, "fetch")`, see `client.test.ts`). Async-RSC pages are an E2E (Playwright, deferred) concern.

## Conventions

- Prettier: 100 cols, double quotes, trailing commas, Tailwind class sorting plugin. ESLint enforces `consistent-type-imports` (use `import type`) and unused vars must be `_`-prefixed.
- `NEXT_PUBLIC_*` vars must be referenced statically as `process.env.NEXT_PUBLIC_FOO` in `env.ts` (Next inlines them); don't loop over env.
- Add shadcn components via the CLI into `src/components/ui`; cross-feature hand-written pieces go in `src/components/shared`.
- README references `PRD-nextjs-boilerplate-FINAL.md` and `CONVENTIONS.md`, but neither file exists in the repo; the "PRD §" comments in source refer to that absent document.
