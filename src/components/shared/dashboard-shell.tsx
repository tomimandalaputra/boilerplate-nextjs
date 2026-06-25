"use client";

import Link from "next/link";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { siteConfig } from "@/config/site";
import { useUiStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

// App-shell chrome. The sidebar open/closed flag is UI-only state and lives in
// Zustand (PRD §3 Rule 1 / §6) — never in React Query.
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <div className="flex min-h-full flex-1">
      <aside
        className={cn(
          "bg-sidebar text-sidebar-foreground border-r transition-[width] duration-200",
          sidebarOpen ? "w-60" : "w-0 overflow-hidden border-r-0",
        )}
      >
        <div className="flex h-14 items-center px-4 font-semibold">{siteConfig.name}</div>
        <nav className="space-y-1 px-2">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground block rounded-md px-3 py-2 text-sm"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b px-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle sidebar">
            <PanelLeft className="size-4" />
          </Button>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
