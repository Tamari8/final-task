import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { FREE_SHIPPING_THRESHOLD } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItemsCount,
    subtotalAmount,
    discountAmount,
    shippingCost,
    totalAmount,
    appliedPromo,
  } = useCart();

  const navigate = useNavigate();

  // Close drawer on Escape key press
  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const netSubtotal = Math.max(0, subtotalAmount - discountAmount);
  const amountRemainingForFreeShipping = Math.max(
    0,
    Number((FREE_SHIPPING_THRESHOLD - netSubtotal).toFixed(2))
  );
  const freeShippingProgress = Math.min(
    100,
    Math.round((netSubtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const handleProceedToCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        aria-hidden="true"
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="animate-drawer-enter flex w-screen max-w-md flex-col bg-white dark:bg-slate-900 border-l border-transparent dark:border-slate-800 shadow-2xl transition-colors duration-200">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 id="cart-drawer-title" className="text-base font-bold text-slate-900 dark:text-white">
                  თქვენი კალათა
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {totalItemsCount} ერთეული კალათაში
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeDrawer}
              aria-label="კალათის დახურვა"
              className="rounded-xl p-2 text-slate-400 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          {items.length > 0 && (
            <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 px-6 py-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
                {amountRemainingForFreeShipping === 0 ? (
                  <>
                    <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                      გილოცავთ! თქვენ გეკუთვნით უფასო მიწოდება!
                    </span>
                  </>
                ) : (
                  <>
                    <Truck className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
                    <span>
                      დაამატეთ კიდევ{' '}
                      <strong className="text-indigo-600 dark:text-indigo-400">
                        ${amountRemainingForFreeShipping.toFixed(2)}
                      </strong>{' '}
                      უფასო მიწოდებისთვის
                    </span>
                  </>
                )}
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-12">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                  <ShoppingBag className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  კალათა ცარიელია
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                  დაათვალიერეთ კატალოგი და დაამატეთ სასურველი პროდუქტები კალათაში.
                </p>
                <Link
                  to="/products"
                  onClick={closeDrawer}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                >
                  <span>კატალოგში გადასვლა</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="flex gap-4 py-4">
                    <Link
                      to={`/products/${product.id}`}
                      onClick={closeDrawer}
                      className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                        className="max-h-16 w-auto object-contain"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/products/${product.id}`}
                            onClick={closeDrawer}
                            className="text-xs font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-2 leading-snug"
                          >
                            {product.title}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            aria-label={`${product.title} წაშლა კალათიდან`}
                            className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                        <p className="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                          ${product.price.toFixed(2)} / ც.
                        </p>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            aria-label="რაოდენობის შემცირება"
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                          >
                            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                          <span className="min-w-8 text-center text-xs font-bold text-slate-900 dark:text-white">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            aria-label="რაოდენობის გაზრდა"
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>

                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                          ${(product.price * quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/90 px-6 py-5 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>ქვეჯამი ({totalItemsCount} პროდუქტი)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    ${subtotalAmount.toFixed(2)}
                  </span>
                </div>
                {appliedPromo && discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>ფასდაკლება ({appliedPromo.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>მიწოდება</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {shippingCost === 0 ? 'უფასო' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2.5 text-sm font-extrabold text-slate-900 dark:text-white">
                  <span>სულ გადასახდელი</span>
                  <span className="text-indigo-600 dark:text-indigo-400">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-all cursor-pointer"
                >
                  <span>შეკვეთის გაფორმება</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full rounded-xl py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                >
                  კალათის გასუფთავება
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
