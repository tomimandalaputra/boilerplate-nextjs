import { QueryClient, defaultShouldDehydrateQuery, isServer } from "@tanstack/react-query";
import { defaultQueryOptions } from "./default-options";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      ...defaultQueryOptions,
      dehydrate: {
        // also dehydrate pending queries so streamed/prefetched-but-in-flight
        // queries hydrate on the client (Next.js App Router guide).
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

// Per-request on the server (a fresh client per render avoids cross-request
// state leaks); a singleton in the browser (PRD §4).
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
