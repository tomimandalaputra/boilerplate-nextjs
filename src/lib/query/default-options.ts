import type { DefaultOptions } from "@tanstack/react-query";

// A non-zero staleTime is required by the prefetch → hydrate pattern (PRD §5):
// without it, a prefetched query is considered stale and refetches the instant
// it mounts on the client, defeating the point of prefetching.
export const defaultQueryOptions: DefaultOptions = {
  queries: {
    staleTime: 60 * 1000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  },
};
