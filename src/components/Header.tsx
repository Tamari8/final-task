import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Sparkles, CreditCard, Store, Tag } from 'lucide-react';
import { useCart } from '../hooks/useCart';

export const Header: React.FC = () => {
  const { totalItemsCount, totalAmount, openDrawer, addNotification } = useCart();
  const [bump, setBump] = useState<boolean>(false);

  useEffect(() => {
    if (totalItemsCount === 0) return;
    setBump(true);
    const timer = window.setTimeout(() => setBump(false), 400);
    return () => window.clearTimeout(timer);
  }, [totalItemsCount]);

  const handleCopyPromo = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('SHOPFLOW20').catch(() => {});
    }
    addNotification(
      'პრომო-კოდი დაკოპირდა!',
      'გამოიყენეთ კოდი SHOPFLOW20 შეკვეთის გვერდზე 20%-იანი ფასდაკლებისთვის.',
      'info'
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 px-4 py-1.5 text-white text-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-amber-300 shrink-0" aria-hidden="true" />
            <span>უფასო მიწოდება $100-ზე მეტი ღირებულების შეკვეთაზე!</span>
          </div>
          <button
            type="button"
            onClick={handleCopyPromo}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-white hover:bg-white/25 transition-colors cursor-pointer"
          >
            <Tag className="h-3 w-3 text-amber-300" aria-hidden="true" />
            <span>პრომო-კოდი: SHOPFLOW20 (-20%)</span>
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/products"
          className="group flex items-center gap-2.5 focus:outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/25 group-hover:bg-indigo-500 transition-colors">
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Shop<span className="text-indigo-600">Flow</span>
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-widest text-slate-400">
              Modern Store
            </span>
          </div>
        </Link>

        <nav aria-label="მთავარი ნავიგაცია" className="hidden md:flex items-center gap-1">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <Store className="h-4 w-4" aria-hidden="true" />
            <span>კატალოგი</span>
          </NavLink>

          <NavLink
            to="/checkout"
            className={({ isActive }) =>
              `inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <CreditCard className="h-4 w-4" aria-hidden="true" />
            <span>შეკვეთის გაფორმება</span>
          </NavLink>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/checkout"
            className="md:hidden inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <CreditCard className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
            <span>Checkout</span>
          </Link>

          <button
            type="button"
            onClick={openDrawer}
            aria-label={`კალათის გახსნა, ${totalItemsCount} პროდუქტი`}
            className={`relative inline-flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 transition-all cursor-pointer ${
              bump ? 'animate-cart-bump' : ''
            }`}
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">კალათა</span>
            {totalItemsCount > 0 && (
              <span className="hidden lg:inline text-xs font-normal text-slate-300 border-l border-slate-700 pl-2">
                ${totalAmount.toFixed(2)}
              </span>
            )}
            <span
              className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1.5 text-xs font-bold text-white"
              aria-hidden="true"
            >
              {totalItemsCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
