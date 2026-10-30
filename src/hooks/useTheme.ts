import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import type { ThemeContextType } from '../types';

/**
 * Custom Hook: useTheme
 * Provides typed access to global ThemeContext (light / dark mode).
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
