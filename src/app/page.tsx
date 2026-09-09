import Link from "next/link";
import { Counter } from "@/components/shared/counter";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

// Simple public landing page. The app itself lives under /dashboard.
export default function Home() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center gap-8 p-6 text-center">
      <div className="space-y-4">
        <span className="bg-muted text-muted-foreground inline-block rounded-full px-3 py-1 text-xs font-medium">
          Next.js Boilerplate
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{siteConfig.name}</h1>
        <p className="text-muted-foreground mx-auto max-w-md text-balance">
          {siteConfig.description}
        </p>
      </div>
      <Counter />
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    </main>
  );
}
