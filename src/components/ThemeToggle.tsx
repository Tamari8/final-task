import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showLabel = false,
  className = '',
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'ნათელი რეჟიმის ჩართვა' : 'ბნელი რეჟიმის ჩართვა'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`inline-flex items-center gap-2 rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-all duration-200 cursor-pointer ${className}`}
    >
      <div className="relative h-5 w-5">
        <Sun
          className={`absolute inset-0 h-5 w-5 text-amber-500 transition-all duration-300 transform ${
            isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
          }`}
          aria-hidden="true"
        />
        <Moon
          className={`absolute inset-0 h-5 w-5 text-indigo-600 transition-all duration-300 transform ${
            isDark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
          aria-hidden="true"
        />
      </div>

      {showLabel && (
        <span className="text-xs font-semibold">
          {isDark ? 'ნათელი რეჟიმი' : 'ბნელი რეჟიმი'}
        </span>
      )}
    </button>
  );
};
