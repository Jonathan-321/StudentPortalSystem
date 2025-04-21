import { Switch, Route, Router as BaseRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
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
import { AuthProvider } from "@/hooks/use-auth";
import { LanguageProvider } from "./hooks/use-language";
import InstallPWA from "@/components/InstallPWA";
import { useEffect, useState } from "react";
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
        <Route path="/:rest*" component={NotFound} />
      </Switch>
    </BaseRouter>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  // Show the install button only after a delay to avoid interrupting the initial user experience
  const [showInstallButton, setShowInstallButton] = useState(false);
  
  useEffect(() => {
    // Show the install button after 2 minutes of using the app
    const timer = setTimeout(() => {
      setShowInstallButton(true);
    }, 120000); // 2 minutes
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      <Router />
      <OfflineIndicator />
      {showInstallButton && <InstallPWA />}
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
