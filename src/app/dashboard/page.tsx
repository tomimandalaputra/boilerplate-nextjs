import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

// Renders as "Tukucode | Dashboard" via the root layout's title template.
export const metadata: Metadata = {
  title: "Dashboard",
};

// Dashboard overview — links out to the feature slices.
export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description={`Welcome to ${siteConfig.name}.`} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/users" className="group">
          <Card className="group-hover:border-ring transition-colors">
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                The example feature slice — server prefetch, hydrate, forms.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
