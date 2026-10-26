export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'title-asc';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  description: string;
}

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  postalCode: string;
  promoCode: string;
  paymentMethod: 'card' | 'cash_on_delivery';
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  notes: string;
}

export type CheckoutFormErrors = Partial<Record<keyof CheckoutFormData, string>>;

export type CheckoutTouchedFields = Partial<Record<keyof CheckoutFormData, boolean>>;

export interface CompletedOrder {
  orderId: string;
  createdAt: string;
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  totalAmount: number;
  appliedPromo: PromoCode | null;
}

export interface CartContextType {
  items: CartItem[];
  isDrawerOpen: boolean;
  appliedPromo: PromoCode | null;
  notifications: NotificationItem[];
  totalItemsCount: number;
  subtotalAmount: number;
  discountAmount: number;
  shippingCost: number;
  totalAmount: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  applyPromoCode: (rawCode: string) => { valid: boolean; message: string; promo?: PromoCode };
  removePromoCode: () => void;
  addNotification: (title: string, message: string, type?: NotificationType) => void;
  dismissNotification: (id: string) => void;
}
