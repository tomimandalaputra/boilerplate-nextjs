import { addRequestInterceptor } from "@/lib/api/client";

// ---------------------------------------------------------------------------
// AUTH SLOT (PRD §10.2 / §11, open decision #2).
//
// The token SOURCE differs by environment, so we inject it via the interceptor
// registry rather than reading a global inside the client:
//   - Client: read a browser-readable cookie (below).
//   - Server prefetch: read cookies() from `next/headers` and pass the token
//     explicitly into the prefetch path — the global registry is shared across
//     requests, so per-request server tokens must NOT be pushed onto it (that
//     would leak one user's token into another's request).
//
// Wiring a concrete provider (cookie-session vs bearer) is per-project; this
// file ships the client mechanism and documents the server contract.
// ---------------------------------------------------------------------------

const AUTH_COOKIE = "access_token";

export function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${AUTH_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

let registered = false;

// Registers the CLIENT-side auth interceptor exactly once. Idempotent so React
// fast-refresh / re-mounts don't stack duplicate interceptors.
export function registerClientAuthInterceptor(): void {
  if (registered) return;
  registered = true;

  addRequestInterceptor((init) => {
    const token = getTokenFromCookie();
    return token
      ? {
          ...init,
          headers: { ...init.headers, authorization: `Bearer ${token}` },
        }
      : init;
  });
}
