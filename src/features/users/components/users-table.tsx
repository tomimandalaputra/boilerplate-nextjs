"use client";

import { useApiQuery } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usersQueryOptions } from "../api/user-queries";

// Reads server data from the React Query cache (prefetched + hydrated by the
// server component). `error` is typed as ApiError via useApiQuery (PRD §10.3).
export function UsersTable() {
  const { data, isLoading, error } = useApiQuery(usersQueryOptions());

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-destructive text-sm" role="alert">
        {error.message}
      </p>
    );
  }

  const users = data ?? [];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={2} className="text-muted-foreground text-center">
              No users yet.
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
