import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query/get-query-client";
import { usersQueryOptions } from "@/features/users/api/user-queries";
import { UsersTable } from "@/features/users/components/users-table";
import { CreateUserForm } from "@/features/users/components/create-user-form";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Renders as "Tukucode | Users" via the root layout's title template.
export const metadata: Metadata = {
  title: "Users",
};

// Server Component: prefetch on the server, dehydrate, hand to the client via
// <HydrationBoundary>. The client reads the SAME usersQueryOptions() so the key
// and fetch can never drift (PRD §5).
export default async function UsersPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(usersQueryOptions());

  return (
    <div className="space-y-8">
      <PageHeader
        title="Users"
        description="Server-prefetched, hydrated, then read on the client via useApiQuery."
      />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <UsersTable />

          <Card>
            <CardHeader>
              <CardTitle>Create user</CardTitle>
              <CardDescription>
                Client Zod validation + server field errors mapped back.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateUserForm />
            </CardContent>
          </Card>
        </div>
      </HydrationBoundary>
    </div>
  );
}
