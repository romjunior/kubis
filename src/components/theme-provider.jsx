import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeProviderContext = createContext(undefined);

function getStoredTheme(storageKey, defaultTheme) {
  if (typeof window === 'undefined') return defaultTheme;
  return window.localStorage.getItem(storageKey) || defaultTheme;
}

function ThemeProvider({ children, defaultTheme = 'system', storageKey = 'kubis-ui-theme' }) {
  const [theme, setThemeState] = useState(() => getStoredTheme(storageKey, defaultTheme));

  useEffect(() => {
    const root = window.document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const resolvedTheme = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme;
      root.classList.remove('light', 'dark');
      root.classList.add(resolvedTheme);
      root.style.colorScheme = resolvedTheme;
    };

    applyTheme();
    if (theme === 'system') media.addEventListener('change', applyTheme);

    return () => media.removeEventListener('change', applyTheme);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    setTheme(nextTheme) {
      window.localStorage.setItem(storageKey, nextTheme);
      setThemeState(nextTheme);
    },
  }), [storageKey, theme]);

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}

function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  return context;
}

export { ThemeProvider, useTheme };
