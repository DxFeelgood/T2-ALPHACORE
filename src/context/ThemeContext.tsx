import React, { createContext, useContext, useEffect, useState } from 'react';

export type AppTheme = 'academic' | 'space';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'mathero_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved === 'space' || saved === 'academic') {
      return saved;
    }
    return 'academic';
  });

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem(LOCAL_STORAGE_KEY, newTheme);
  };

  const toggleTheme = () => {
    const next = theme === 'academic' ? 'space' : 'academic';
    setTheme(next);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'space') {
      root.classList.add('dark', 'theme-space');
      root.classList.remove('theme-academic');
    } else {
      root.classList.remove('dark', 'theme-space');
      root.classList.add('theme-academic');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'academic',
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
};
