import { createContext, ReactNode, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "./use-auth-supabase";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

type LanguageContextType = {
  currentLanguage: string;
  changeLanguage: (language: string) => void;
};

export const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const { user } = useAuth();

  const updateLanguageMutation = useMutation({
    mutationFn: async (language: string) => {
      const res = await apiRequest("PATCH", "/api/user/language", { language });
      return await res.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
    },
  });

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    
    // If user is logged in, update their language preference
    if (user) {
      updateLanguageMutation.mutate(language);
    }
  };

  // Initialize language from user settings if available
  useEffect(() => {
    if (user?.language && user.language !== i18n.language) {
      i18n.changeLanguage(user.language);
    }
  }, [user, i18n]);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage: i18n.language,
        changeLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
