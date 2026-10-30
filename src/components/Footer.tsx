import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, Heart } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
      {/* Upper features strip */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Truck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-xs">უფასო მიწოდება</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">$100-ზე მეტი ღირებულების შეკვეთაზე</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-xs">100% დაცული გადახდა</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">256-bit SSL დაშიფრული ტრანზაქციები</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-xs">30-დღიანი დაბრუნება</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">მარტივი და გარანტირებული დაბრუნება</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                Shop<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
              </span>
              <span className="block text-[10px] text-slate-400 dark:text-slate-500">
                Modern E-Commerce Store • React 19 & TypeScript
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium text-xs">
            <Link
              to="/products"
              className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              კატალოგი
            </Link>
            <Link
              to="/checkout"
              className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              შეკვეთის გაფორმება
            </Link>
            <div className="flex items-center border-l border-slate-200 dark:border-slate-700 pl-4">
              <ThemeToggle showLabel={true} />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-6 text-[11px] text-slate-400 dark:text-slate-500 sm:flex-row">
          <p>© 2026 ShopFlow. ყველა უფლება დაცულია.</p>
          <p className="flex items-center gap-1">
            შექმნილია <Heart className="h-3 w-3 fill-rose-500 text-rose-500 inline" aria-hidden="true" /> სიყვარულით ფინალური პროექტისთვის
          </p>
        </div>
      </div>
    </footer>
  );
};
