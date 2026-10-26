import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import type { CartContextType } from '../types';

/**
 * Custom Hook: useCart
 * Provides strictly-typed access to global CartContext state and actions.
 */
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
