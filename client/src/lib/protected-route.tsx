import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Route, Redirect } from "wouter";

// Component wrapper to fix TypeScript errors
export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: React.ComponentType;
}) {
  // TEMPORARY: Bypassing authentication for development testing
  // This lets us see all pages without logging in
  const isDev = import.meta.env.DEV;
  
  // In development mode, we will create a mock user
  const mockUser = isDev ? {
    id: 1,
    username: "john",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "student",
    studentId: "STU12345",
    language: "en",
    program: "Computer Science",
    year: 2
  } : null;
  
  // Only use auth in production
  const authData = useAuth();
  const { isLoading } = authData;
  const user = isDev ? mockUser : authData.user;

  return (
    <Route path={path}>
      {() => {
        if (isLoading && !isDev) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          );
        }
        
        if (!user && !isDev) {
          return <Redirect to="/auth" />;
        }
        
        return <Component />;
      }}
    </Route>
  );
}
