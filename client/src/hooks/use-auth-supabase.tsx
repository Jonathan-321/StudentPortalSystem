import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { User as SelectUser } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { supabaseApi } from "@/lib/supabase";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [user, setUser] = useState<SelectUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Check for existing user on mount
  useEffect(() => {
    const currentUser = supabaseApi.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For demo, accept admin/admin123 or john/student123
      if (
        (username === 'admin' && password === 'admin123') ||
        (username === 'john' && password === 'student123')
      ) {
        const userData = await supabaseApi.login(username, password);
        setUser(userData);
        setLocation("/");
        toast({
          title: "Login successful",
          description: `Welcome back, ${userData.first_name || userData.firstName || 'Student'}!`,
        });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      setError(error as Error);
      toast({
        title: "Login failed",
        description: (error as Error).message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    supabaseApi.logout();
    setUser(null);
    setLocation("/auth");
    toast({
      title: "Logged out successfully",
    });
  };

  const register = async (data: any) => {
    // For demo, we don't support registration
    toast({
      title: "Registration not available",
      description: "Please use the demo accounts",
      variant: "destructive",
    });
    throw new Error("Registration not available in demo");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}