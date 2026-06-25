// Auth-only layout (PRD §4): a minimal centered shell with no app chrome.
// The concrete auth provider that fills this slot is per-project (PRD §11 #2).
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
