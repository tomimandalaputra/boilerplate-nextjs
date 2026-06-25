import Link from "next/link";
import { Button } from "@/components/ui/button";

// Route-level 404 (PRD §9).
export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-xl font-semibold">Page not found</h2>
      <p className="text-muted-foreground text-sm">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button asChild>
        <Link href="/dashboard">Back to app</Link>
      </Button>
    </div>
  );
}
