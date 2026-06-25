// Per-feature query-key factory (PRD §5/§10.4) — never scatter stringly-typed
// keys like ["users"] around the codebase.
export const userKeys = {
  all: ["users"] as const,
  list: () => [...userKeys.all, "list"] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
};
