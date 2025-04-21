import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getCachedUser } from "@/lib/offlineStorage";

type Theme = {
  primary: string;
  secondary: string;
  accent: string;
  mode: 'light' | 'dark';
};

// Default themes
export const PRESET_THEMES = {
  default: {
    primary: '#3b82f6', // blue-500
    secondary: '#10b981', // emerald-500
    accent: '#f59e0b', // amber-500
    mode: 'light' as const,
  },
  rwanda: {
    primary: '#006AC3', // blue (Rwanda flag)
    secondary: '#18A84B', // green (Rwanda flag)
    accent: '#E8A317', // yellow/gold (academic color)
    mode: 'light' as const,
  },
  academic: {
    primary: '#840032', // dark red (academic color)
    secondary: '#E4A010', // gold (academic color)
    accent: '#334B49', // dark teal
    mode: 'light' as const,
  },
  tech: {
    primary: '#5E17EB', // bright purple
    secondary: '#18CDCA', // teal
    accent: '#FF338F', // bright pink
    mode: 'light' as const,
  },
  forest: {
    primary: '#3A5F41', // forest green
    secondary: '#6A8E7F', // sage green
    accent: '#F4B860', // muted yellow
    mode: 'light' as const,
  },
  night: {
    primary: '#274472', // navy blue
    secondary: '#5885AF', // lighter blue
    accent: '#C3E0E5', // pale blue
    mode: 'dark' as const,
  }
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  applyPresetTheme: (presetName: keyof typeof PRESET_THEMES) => void;
  currentThemeName: string;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(PRESET_THEMES.default);
  const [currentThemeName, setCurrentThemeName] = useState<string>('default');

  // Try to load user's theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // First check localStorage for theme
        const savedTheme = localStorage.getItem('userTheme');
        if (savedTheme) {
          const parsedTheme = JSON.parse(savedTheme);
          setThemeState(parsedTheme.theme);
          setCurrentThemeName(parsedTheme.name);
          applyThemeToDocument(parsedTheme.theme);
          return;
        }

        // If no theme in localStorage, check if it's stored with user preferences
        const user = await getCachedUser();
        if (user?.preferences?.theme) {
          setThemeState(user.preferences.theme);
          
          // Find which preset matches, if any
          const presetName = Object.entries(PRESET_THEMES).find(
            ([, presetTheme]) => JSON.stringify(presetTheme) === JSON.stringify(user.preferences.theme)
          )?.[0] || 'custom';
          
          setCurrentThemeName(presetName);
          applyThemeToDocument(user.preferences.theme);
        }
      } catch (error) {
        console.error('Failed to load theme preferences', error);
      }
    };

    loadTheme();
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyThemeToDocument(newTheme);
    
    // Save to localStorage for quick access
    localStorage.setItem('userTheme', JSON.stringify({ 
      theme: newTheme,
      name: 'custom'
    }));
    
    setCurrentThemeName('custom');
    
    // Here we would also save to user preferences in the database, 
    // but that would require an API endpoint which we haven't created yet
  };

  const applyPresetTheme = (presetName: keyof typeof PRESET_THEMES) => {
    const newTheme = PRESET_THEMES[presetName];
    setThemeState(newTheme);
    applyThemeToDocument(newTheme);
    
    // Save to localStorage for quick access
    localStorage.setItem('userTheme', JSON.stringify({ 
      theme: newTheme,
      name: presetName
    }));
    
    setCurrentThemeName(presetName);
    
    // Here we would also save to user preferences in the database
  };

  const applyThemeToDocument = (theme: Theme) => {
    // Apply CSS variables to the document root
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-secondary', theme.secondary);
    document.documentElement.style.setProperty('--color-accent', theme.accent);
    
    // Also handle dark/light mode
    if (theme.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, applyPresetTheme, currentThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}