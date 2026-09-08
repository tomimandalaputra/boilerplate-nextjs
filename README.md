# Next.js Frontend Boilerplate

A production-ready, **feature-first** Next.js (App Router) starter. Implements
[`PRD-nextjs-boilerplate-FINAL.md`](./PRD-nextjs-boilerplate-FINAL.md); coding
standards live in [`CONVENTIONS.md`](./CONVENTIONS.md).

## Stack

Next.js 16 · React 19 · TypeScript (strict) · Tailwind v4 · shadcn/ui ·
TanStack Query 5 · Zustand · next-themes · React Hook Form + Zod ·
ESLint 9 (flat) + Prettier · Vitest + React Testing Library · npm.

## Getting started

```bash
npm install
cp .env.example .env.local   # then point NEXT_PUBLIC_API_BASE_URL at your API
npm run dev
```

Open http://localhost:3000 — `/` is a simple landing page; the app lives under
`/dashboard`, with the example feature at `/dashboard/users`.

> The example feature fetches `${NEXT_PUBLIC_API_BASE_URL}/users` expecting the
> `BaseResponse<T>` envelope (PRD §10.1). With the placeholder URL the table
> shows its error state; point the env var at a real API to see data.

## Scripts

| Script                                      | What it does                |
| ------------------------------------------- | --------------------------- |
| `npm run dev` / `build` / `start`           | Next.js dev / build / serve |
| `npm run lint` / `lint:fix`                 | ESLint (flat config)        |
| `npm run format` / `format:check`           | Prettier                    |
| `npm run typecheck`                         | `tsc --noEmit`              |
| `npm test` / `test:watch` / `test:coverage` | Vitest                      |

> **Next.js 16 removed `next lint`** and `next build` no longer runs ESLint.
> CI must run `lint`, `typecheck`, `format:check`, and `test` as separate gates.

## The two hard rules (PRD §3)

1. **Server state → TanStack Query. Client/UI state → Zustand. Never mix.**
   Anything that could be stale relative to the API lives in React Query; pure
   UI state (sidebar open, active modal) lives in Zustand. Never copy `useQuery`
   data into a store — that creates two sources of truth that drift.
2. **Default to server fetching:** prefetch in a Server Component → `dehydrate`
   → `<HydrationBoundary>` → read on the client with `useApiQuery`. The
   `users` feature demonstrates the full path sharing one `usersQueryOptions()`.

## Structure

```
src/
├── app/            # routing, layouts, RSC pages, providers
│   ├── page.tsx    # public landing page at /
│   ├── (auth)/     # auth-only layout (provider slot — PRD §11)
│   └── dashboard/  # app-shell layout + example /dashboard/users page
├── features/users/ # vertical slice: api/, components/, types.ts, schema.ts
├── components/ui/   # shadcn/ui   · components/shared/ cross-feature pieces
├── lib/             # api/client.ts (interceptors, ApiError), query/, utils
├── hooks/use-api.ts # typed wrappers over React Query (no fetching of their own)
├── stores/          # global Zustand (UI-only)
├── types/responses/ # shared BaseResponse<T> envelope
└── config/          # env.ts (validated), site.ts
```

**Dependency direction:** `app/` → `features/` → `lib/` / `components/ui` /
`types/`. Features must not import each other — enforced by the ESLint
`no-restricted-imports` rule.

## Testing boundary (PRD §9.3)

Vitest **cannot render async Server Components** (`page.tsx` that `await`s data).
That is why fetch logic is pulled out of components into `features/*/api` and
`lib/api` — those are plain, unit-testable functions. Async-RSC coverage is a
deferred E2E (Playwright) concern.

## Open decisions (PRD §11)

- **Auth provider / session strategy** — `(auth)` is a slot; the client
  interceptor mechanism ships in `lib/api/auth.ts`, the concrete provider does not.
- **E2E / Playwright** — deferred.
