import * as z from "zod";

// Validated environment (PRD §9). Fails fast on missing/invalid vars so a
// misconfigured deploy breaks at startup, not at the first request.
//
// NEXT_PUBLIC_* vars are inlined by Next.js only when referenced statically as
// `process.env.NEXT_PUBLIC_FOO` — keep the explicit object below, do not loop.
const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.url("NEXT_PUBLIC_API_BASE_URL must be a valid URL."),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", z.flattenError(parsed.error).fieldErrors);
  throw new Error("Invalid environment variables — see the logged errors above.");
}

export const env = {
  apiBaseUrl: parsed.data.NEXT_PUBLIC_API_BASE_URL,
} as const;
