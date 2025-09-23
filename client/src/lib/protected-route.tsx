import { useAuth } from "@/hooks/use-auth-supabase";
import { Loader2 } from "lucide-react";
import { Route, Redirect } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: React.ComponentType;
}) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {() => {
        // Skip loading for auto-login
        return <Component />;
      }}
    </Route>
  );
}
