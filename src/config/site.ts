// Static, non-secret site constants. Anything secret or environment-specific
// belongs in `env.ts` (validated), not here.
export const siteConfig = {
  name: "Boilerplate Project",
  description: "A production-ready, feature-first Next.js App Router starter.",
  nav: [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Users", href: "/dashboard/users" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
