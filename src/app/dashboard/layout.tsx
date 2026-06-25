import { DashboardShell } from "@/components/shared/dashboard-shell";

// Route-group layout (PRD §4): the app-shell wrapper for authenticated pages.
// Route groups like (dashboard) organize layouts without affecting the URL.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
