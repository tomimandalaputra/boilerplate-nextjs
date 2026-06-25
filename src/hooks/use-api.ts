"use client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { apiClient, type ApiError } from "@/lib/api/client";

/**
 * Reads: pass a feature's queryOptions object (key + queryFn bound together — PRD §5).
 * Taking `options`, not `(key, path)`, is deliberate: it makes key/URL drift
 * impossible, because the key and the fetch live in ONE definition the feature owns.
 * What this adds over plain useQuery: it pins the error type to ApiError.
 * TQueryKey is preserved so a narrowly-typed key (e.g. the userKeys factory) stays
 * compatible with its queryFn.
 */
export function useApiQuery<TData, TQueryKey extends QueryKey = QueryKey>(
  options: UseQueryOptions<TData, ApiError, TData, TQueryKey>,
) {
  return useQuery<TData, ApiError, TData, TQueryKey>(options);
}

/** Writes: typed mutation with opt-in cache invalidation on success. */
export function useApiMutation<TData, TVariables>(
  path: string,
  method: "post" | "put" | "patch" | "delete" = "post",
  options?: UseMutationOptions<TData, ApiError, TVariables> & {
    invalidate?: readonly unknown[];
  },
) {
  const queryClient = useQueryClient();
  const { invalidate, onSuccess, ...rest } = options ?? {};

  return useMutation<TData, ApiError, TVariables>({
    mutationFn: (variables) =>
      method === "delete"
        ? apiClient.delete<TData>(path)
        : apiClient[method]<TData>(path, variables),
    onSuccess: (...args) => {
      if (invalidate) queryClient.invalidateQueries({ queryKey: invalidate });
      onSuccess?.(...args);
    },
    ...rest,
  });
}
