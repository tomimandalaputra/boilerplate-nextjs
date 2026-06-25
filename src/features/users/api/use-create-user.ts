"use client";
import { useApiMutation } from "@/hooks/use-api";
import { userKeys } from "./query-keys";
import type { User } from "../types";
import type { CreateUserInput } from "../schema";

// Reuses useApiMutation (PRD §10.3), so the interceptor + error normalization
// come for free. On success, invalidate the list so it refetches.
export const useCreateUser = () =>
  useApiMutation<User, CreateUserInput>("/users", "post", {
    invalidate: userKeys.list(),
  });
