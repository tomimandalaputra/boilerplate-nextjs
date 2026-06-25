import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Renders as "Tukucode | Sign in" via the root layout's title template.
export const metadata: Metadata = {
  title: "Sign in",
};

// PLACEHOLDER for the auth slot (PRD §11, open decision #2). Wiring a concrete
// provider — and whether the session is cookie- or bearer-based — is per-project
// and changes the client interceptor + server prefetch token-passing (§10.2).
export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Auth provider slot — wire your provider here (PRD §11).</CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        This boilerplate ships the layout and interceptor mechanism, not a specific auth provider.
      </CardContent>
    </Card>
  );
}
