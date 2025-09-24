import { Switch, Route, Router as BaseRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";
import Dashboard from "@/pages/dashboard";
import CourseRegistration from "@/pages/course-registration";
import Academics from "@/pages/academics";
import Results from "@/pages/results";
import Finance from "@/pages/finance";
import Timetable from "@/pages/timetable";
import Resources from "@/pages/resources";
import Messages from "@/pages/messages";
import Settings from "@/pages/settings";
import Help from "@/pages/help";
import LifecyclePage from "@/pages/lifecycle";
import { AuthProvider } from "@/hooks/use-auth";
import { LanguageProvider } from "./hooks/use-language";
import { ThemeProvider } from "@/hooks/use-theme";
// import InstallPWA from "@/components/InstallPWA";
import OfflineIndicator from "@/components/OfflineIndicator";

// Router component with proper route matching
function Router() {
  return (
    <BaseRouter base="">
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <ProtectedRoute path="/" component={Dashboard} />
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <ProtectedRoute path="/course-registration" component={CourseRegistration} />
        <ProtectedRoute path="/academics" component={Academics} />
        <ProtectedRoute path="/results" component={Results} />
        <ProtectedRoute path="/finance" component={Finance} />
        <ProtectedRoute path="/timetable" component={Timetable} />
        <ProtectedRoute path="/resources" component={Resources} />
        <ProtectedRoute path="/messages" component={Messages} />
        <ProtectedRoute path="/settings" component={Settings} />
        <ProtectedRoute path="/help" component={Help} />
        <ProtectedRoute path="/lifecycle" component={LifecyclePage} />
        <Route path="/:rest*" component={NotFound} />
      </Switch>
    </BaseRouter>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemeProvider attribute="class" defaultTheme="light">
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <TooltipProvider>
                {children}
              </TooltipProvider>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </NextThemeProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  return (
    <>
      <Router />
      <OfflineIndicator />
    </>
  );
}

function App() {
  return (
    <Providers>
      <Toaster />
      <AppContent />
    </Providers>
  );
}

export default App;
