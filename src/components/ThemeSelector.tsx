import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '../lib/utils';

const DARK_CLASS = 'dark';
const STORAGE_KEY = 'theme-preference';
const THEMES = ['auto', 'light', 'dark'] as const;
type Theme = (typeof THEMES)[number];
const iconMap = {
  [THEMES[0]]: ComputerDesktopIcon, // auto
  [THEMES[1]]: SunIcon, // light
  [THEMES[2]]: MoonIcon, // dark
};

function isValidTheme(value: string | null): value is Theme {
  return THEMES.includes(value as Theme);
}

export default function ThemeSelector() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isValidTheme(saved) ? saved : THEMES[0];
  });

  const applyTheme = useCallback(() => {
    const root = document.documentElement;

    const isDark =
      theme === THEMES[2] ||
      (theme === THEMES[0] &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.toggle(DARK_CLASS, isDark);
  }, [theme]);

  useEffect(() => {
    applyTheme();

    if (theme === THEMES[0] /* "auto" */) {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      media.addEventListener('change', applyTheme);
      return () => media.removeEventListener('change', applyTheme);
    }
  }, [theme, applyTheme]);

  function switchTheme(newTheme: Theme) {
    if (theme === newTheme) return;
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  }

  return (
    <div className="p-1 bg-gray-100 mx-2 rounded-xs dark:bg-white/5">
      {THEMES.map((t) => {
        const Icon = iconMap[t];
        const isActive = theme === t;

        return (
          <button
            key={t}
            onClick={() => switchTheme(t)}
            className={cn(
              'p-2 rounded-xs focus:outline-none focus:ring-2 focus:ring-teal-300/10 cursor-pointer transition-all duration-200',
              isActive
                ? 'bg-gray-200 dark:bg-teal-950 dark:hover:bg-teal-950 shadow-inner'
                : 'dark:hover:bg-teal-900/50 hover:bg-gray-200',
            )}
            title={`${t.charAt(0).toLocaleUpperCase() + t.slice(1)} theme`}
            aria-pressed={isActive}
          >
            {Icon ? (
              <Icon
                className="h-4 w-4 text-gray-600 dark:text-teal-500/60"
                aria-hidden="true"
              />
            ) : null}
            <span className="sr-only">{t} theme</span>
          </button>
        );
      })}
    </div>
  );
}
