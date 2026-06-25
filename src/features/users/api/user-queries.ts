import { queryOptions } from "@tanstack/react-query";
import { apiClient, type ApiError } from "@/lib/api/client";
import { userKeys } from "./query-keys";
import type { User } from "../types";

// NOTE: intentionally NOT a "use client" module. This single definition is
// imported by BOTH the server prefetch (app/(dashboard)/users/page.tsx) and the
// client hook (UsersTable). `apiClient` is environment-agnostic, so the same
// key↔path binding runs in both — they can never disagree (PRD §5).
//
// The error type is declared as ApiError here so it flows through useApiQuery
// to the component, where `error` is typed as ApiError (PRD §10.3).
export const usersQueryOptions = () =>
  queryOptions<User[], ApiError>({
    queryKey: userKeys.list(),
    queryFn: () => apiClient.get<User[]>("/users"),
  });
