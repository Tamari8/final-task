import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CheckCircle2,
  PackageCheck,
  MapPin,
  Phone,
  Mail,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { CheckoutForm } from '../components/CheckoutForm';
import type { CompletedOrder } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    items,
    totalItemsCount,
    subtotalAmount,
    discountAmount,
    shippingCost,
    totalAmount,
    appliedPromo,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);

  // Order Success Receipt View
  if (completedOrder) {
    return (
      <div className="animate-page-enter mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-white p-6 sm:p-10 shadow-lg">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>შეკვეთა მიღებულია</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            მადლობა შეკვეთისთვის, {completedOrder.customer.fullName}!
          </h1>
          <p className="text-sm text-slate-600">
            თქვენი შეკვეთა <strong className="text-slate-900">#{completedOrder.orderId}</strong>{' '}
            წარმატებით გაფორმდა ({completedOrder.createdAt}).
          </p>
        </div>

        {/* Customer & Delivery Details */}
        <div className="mt-8 grid grid-cols-1 gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-2 text-xs text-slate-600">
          <div className="space-y-1.5">
            <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              მიმღების მონაცემები
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
              <span>{completedOrder.customer.email}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
              <span>{completedOrder.customer.phone}</span>
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              მიწოდების მისამართი
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                {completedOrder.customer.city}, {completedOrder.customer.address}
                {completedOrder.customer.postalCode
                  ? ` (${completedOrder.customer.postalCode})`
                  : ''}
              </span>
            </p>
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="mt-6 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            შეკვეთილი პროდუქცია
          </h2>
          <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200/80 px-4">
            {completedOrder.items.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center justify-between gap-4 py-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-10 w-10 object-contain shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{product.title}</p>
                    <p className="text-slate-500">
                      {quantity} ც. × ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <span className="font-extrabold text-slate-900 shrink-0">
                  ${(product.price * quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Totals Breakdown */}
        <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>ქვეჯამი</span>
            <span className="font-semibold text-slate-900">
              ${completedOrder.subtotal.toFixed(2)}
            </span>
          </div>
          {completedOrder.appliedPromo && completedOrder.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>ფასდაკლება ({completedOrder.appliedPromo.code})</span>
              <span>-${completedOrder.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>მიწოდება</span>
            <span className="font-semibold text-slate-900">
              {completedOrder.shippingCost === 0
                ? 'უფასო'
                : `$${completedOrder.shippingCost.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-extrabold text-slate-900">
            <span>სულ გადახდილი</span>
            <span className="text-indigo-600">
              ${completedOrder.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-500 transition-colors"
          >
            <PackageCheck className="h-4 w-4" aria-hidden="true" />
            <span>კატალოგში დაბრუნება</span>
          </Link>
        </div>
      </div>
    );
  }

  // Empty Cart View
  if (items.length === 0) {
    return (
      <div className="animate-page-enter mx-auto my-12 max-w-xl rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <ShoppingBag className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900">
          თქვენი კალათა ცარიელია
        </h1>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          შეკვეთის გასაფორმებლად გთხოვთ აირჩიოთ პროდუქტები ჩვენი კატალოგიდან.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>პროდუქტების კატალოგი</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-page-enter space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>შოპინგის გაგრძელება</span>
          </Link>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
            კალათა და შეკვეთის გაფორმება
          </h1>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>კალათის გასუფთავება</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Checkout Form with Built-in & Custom Validations */}
        <div className="lg:col-span-7">
          <CheckoutForm onOrderSuccess={(order) => setCompletedOrder(order)} />
        </div>

        {/* Right Column: Sticky Cart Items & Order Summary */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">
              შეკვეთის შეჯამება
            </h2>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
              {totalItemsCount} ერთეული
            </span>
          </div>

          <ul className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex gap-3.5 py-3.5">
                <Link
                  to={`/products/${product.id}`}
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-200/70 bg-white p-1.5"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    className="max-h-12 w-auto object-contain"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/products/${product.id}`}
                      className="text-xs font-bold text-slate-900 hover:text-indigo-600 line-clamp-1"
                    >
                      {product.title}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      aria-label={`${product.title} წაშლა`}
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        aria-label="რაოდენობის შემცირება"
                        className="flex h-6 w-6 items-center justify-center rounded-md text-slate-600 hover:bg-white cursor-pointer"
                      >
                        <Minus className="h-3 w-3" aria-hidden="true" />
                      </button>
                      <span className="min-w-7 text-center text-xs font-bold text-slate-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        aria-label="რაოდენობის გაზრდა"
                        className="flex h-6 w-6 items-center justify-center rounded-md text-slate-600 hover:bg-white cursor-pointer"
                      >
                        <Plus className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Cost Breakdown */}
          <div className="space-y-2.5 border-t border-slate-200 pt-4 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>პროდუქციის ღირებულება</span>
              <span className="font-semibold text-slate-900">
                ${subtotalAmount.toFixed(2)}
              </span>
            </div>

            {appliedPromo && discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>
                  პრომო-ფასდაკლება ({appliedPromo.code} - {appliedPromo.discountPercent}%)
                </span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>საკურიერო მომსახურება</span>
              <span className="font-semibold text-slate-900">
                {shippingCost === 0 ? (
                  <span className="text-emerald-600 font-bold">უფასო</span>
                ) : (
                  `$${shippingCost.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-extrabold text-slate-900">
              <span>სულ გადასახდელი</span>
              <span className="text-xl text-indigo-600">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
