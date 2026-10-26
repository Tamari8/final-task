import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Truck, Sparkles, RotateCcw } from 'lucide-react';
import type { Product } from '../types';
import { fetchAllProducts, FALLBACK_PRODUCTS } from '../services/productService';
import { ProductList } from '../components/ProductList';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);

  const loadProducts = useCallback(async (simulateError = false) => {
    setLoading(true);
    setError(null);
    setIsUsingFallback(false);

    try {
      const data = await fetchAllProducts(simulateError);
      setProducts(data);
    } catch (err) {
      if (simulateError) {
        const message =
          err instanceof Error
            ? err.message
            : 'პროდუქტების ჩატვირთვისას დაფიქსირდა შეცდომა.';
        setError(message);
      } else {
        // If FakeStoreAPI is unreachable due to offline network, gracefully load fallback catalog
        setProducts(FALLBACK_PRODUCTS);
        setIsUsingFallback(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(false);
  }, [loadProducts]);

  return (
    <div className="animate-page-enter space-y-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-6 py-10 sm:px-10 sm:py-12 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3.5 py-1 text-xs font-semibold text-indigo-200">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
            <span>ახალი კოლექცია 2026 • ShopFlow E-Commerce</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            აღმოაჩინეთ პრემიუმ ხარისხის პროდუქცია საუკეთესო ფასად
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            გაფილტრეთ კატეგორიებისა და ფასის მიხედვით, დაამატეთ კალათაში და ისარგებლეთ{' '}
            <strong className="text-amber-300">SHOPFLOW20</strong> პრომო-კოდით 20%-იანი
            ფასდაკლებისთვის.
          </p>
        </div>

        {/* Value Proposition Strip */}
        <div className="relative z-10 mt-8 grid grid-cols-1 gap-3 border-t border-white/10 pt-6 sm:grid-cols-3 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <Truck className="h-4 w-4 text-indigo-400 shrink-0" aria-hidden="true" />
            <span>უფასო მიწოდება $100+ შეკვეთაზე</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>100% დაცული ონლაინ გადახდა</span>
          </div>
          <div className="flex items-center gap-2.5">
            <RotateCcw className="h-4 w-4 text-amber-400 shrink-0" aria-hidden="true" />
            <span>30-დღიანი მარტივი დაბრუნება</span>
          </div>
        </div>
      </section>

      {/* Product Catalog & Filters */}
      <ProductList
        products={products}
        loading={loading}
        error={error}
        isUsingFallback={isUsingFallback}
        onRetry={loadProducts}
      />
    </div>
  );
};
