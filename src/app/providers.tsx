"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { getQueryClient } from "@/lib/query/get-query-client";
import { registerClientAuthInterceptor } from "@/lib/api/auth";

// Register the client-side auth interceptor once, at module load on the client
// (PRD §10.2). The server prefetch path passes its token explicitly instead.
registerClientAuthInterceptor();

export function Providers({ children }: { children: React.ReactNode }) {
  // getQueryClient() returns the browser singleton on the client.
  const queryClient = getQueryClient();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
