import React, { createContext, useState, useMemo, useCallback } from 'react';
import type {
  CartContextType,
  CartItem,
  NotificationItem,
  NotificationType,
  Product,
  PromoCode,
} from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const AVAILABLE_PROMO_CODES: Record<string, PromoCode> = {
  SHOPFLOW20: {
    code: 'SHOPFLOW20',
    discountPercent: 20,
    description: '20%-იანი ფასდაკლება სრულ კალათაზე',
  },
  SALE10: {
    code: 'SALE10',
    discountPercent: 10,
    description: '10%-იანი სეზონური ფასდაკლება',
  },
  STUDENT15: {
    code: 'STUDENT15',
    discountPercent: 15,
    description: '15%-იანი სტუდენტური ფასდაკლება',
  },
};

export const FREE_SHIPPING_THRESHOLD = 100;
export const STANDARD_SHIPPING_COST = 9.99;

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems, clearStoredItems] = useLocalStorage<CartItem[]>(
    'shopflow_cart_items_v1',
    []
  );
  const [appliedPromo, setAppliedPromo, clearStoredPromo] = useLocalStorage<PromoCode | null>(
    'shopflow_promo_code_v1',
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addNotification = useCallback(
    (title: string, message: string, type: NotificationType = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newNotification: NotificationItem = { id, title, message, type };

      setNotifications((prev) => [...prev.slice(-3), newNotification]);

      window.setTimeout(() => {
        dismissNotification(id);
      }, 3600);
    },
    [dismissNotification]
  );

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      if (quantity <= 0) return;

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
        if (existingIndex > -1) {
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }
        return [...prevItems, { product, quantity }];
      });

      addNotification(
        'დაემატა კალათაში',
        `"${product.title.slice(0, 38)}..." (${quantity} ც.) წარმატებით დაემატა.`,
        'success'
      );
    },
    [setItems, addNotification]
  );

  const removeFromCart = useCallback(
    (productId: number) => {
      const target = items.find((item) => item.product.id === productId);
      setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));

      if (target) {
        addNotification(
          'წაიშალა კალათიდან',
          `"${target.product.title.slice(0, 35)}..." ამოღებულია კალათიდან.`,
          'info'
        );
      }
    },
    [items, setItems, addNotification]
  );

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.min(99, Math.max(1, quantity)) }
            : item
        )
      );
    },
    [setItems, removeFromCart]
  );

  const clearCart = useCallback(() => {
    clearStoredItems();
    clearStoredPromo();
  }, [clearStoredItems, clearStoredPromo]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);

  const applyPromoCode = useCallback(
    (rawCode: string): { valid: boolean; message: string; promo?: PromoCode } => {
      const normalized = rawCode.trim().toUpperCase();
      if (!normalized) {
        return { valid: false, message: 'გთხოვთ შეიყვანოთ პრომო-კოდი.' };
      }

      // Custom validation rule: Promo code must be alphanumeric 4-15 chars and exist in active promo dictionary
      const formatRegex = /^[A-Z0-9]{4,15}$/;
      if (!formatRegex.test(normalized)) {
        return {
          valid: false,
          message: 'პრომო-კოდი უნდა შეიცავდეს მხოლოდ ლათინურ ასოებსა და ციფრებს (4-15 სიმბოლო).',
        };
      }

      const matchedPromo = AVAILABLE_PROMO_CODES[normalized];
      if (!matchedPromo) {
        return {
          valid: false,
          message: `პრომო-კოდი "${normalized}" არასწორია. სცადეთ: SHOPFLOW20, SALE10 ან STUDENT15`,
        };
      }

      setAppliedPromo(matchedPromo);
      addNotification(
        'პრომო-კოდი გააქტიურდა!',
        `${matchedPromo.code} — ${matchedPromo.description}`,
        'success'
      );

      return {
        valid: true,
        message: `გააქტიურდა ${matchedPromo.discountPercent}%-იანი ფასდაკლება!`,
        promo: matchedPromo,
      };
    },
    [setAppliedPromo, addNotification]
  );

  const removePromoCode = useCallback(() => {
    clearStoredPromo();
    addNotification('პრომო-კოდი გაუქმდა', 'ფასდაკლება მოიხსნა შეკვეთიდან.', 'info');
  }, [clearStoredPromo, addNotification]);

  const totalItemsCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotalAmount = useMemo(
    () =>
      Number(
        items
          .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
          .toFixed(2)
      ),
    [items]
  );

  const discountAmount = useMemo(() => {
    if (!appliedPromo || subtotalAmount === 0) return 0;
    return Number(((subtotalAmount * appliedPromo.discountPercent) / 100).toFixed(2));
  }, [subtotalAmount, appliedPromo]);

  const shippingCost = useMemo(() => {
    if (subtotalAmount === 0) return 0;
    const afterDiscount = subtotalAmount - discountAmount;
    return afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  }, [subtotalAmount, discountAmount]);

  const totalAmount = useMemo(
    () => Number(Math.max(0, subtotalAmount - discountAmount + shippingCost).toFixed(2)),
    [subtotalAmount, discountAmount, shippingCost]
  );

  const contextValue = useMemo<CartContextType>(
    () => ({
      items,
      isDrawerOpen,
      appliedPromo,
      notifications,
      totalItemsCount,
      subtotalAmount,
      discountAmount,
      shippingCost,
      totalAmount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      applyPromoCode,
      removePromoCode,
      addNotification,
      dismissNotification,
    }),
    [
      items,
      isDrawerOpen,
      appliedPromo,
      notifications,
      totalItemsCount,
      subtotalAmount,
      discountAmount,
      shippingCost,
      totalAmount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      applyPromoCode,
      removePromoCode,
      addNotification,
      dismissNotification,
    ]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};
