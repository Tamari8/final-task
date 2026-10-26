import React, { useState, useMemo, useCallback } from 'react';
import {
  Search,
  SlidersHorizontal,
  AlertCircle,
  RefreshCw,
  PackageSearch,
  X,
  Bug,
} from 'lucide-react';
import type { Product, SortOption } from '../types';
import { ProductCard } from './ProductCard';
import { getCategoryLabel } from '../services/productService';
import { useDebounce } from '../hooks/useDebounce';

export interface ProductListProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  isUsingFallback?: boolean;
  onRetry: (simulateError?: boolean) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  loading,
  error,
  isUsingFallback = false,
  onRetry,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  const debouncedSearch = useDebounce(searchQuery, 200);

  // Extract unique categories dynamically with useMemo
  const categories = useMemo<string[]>(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return ['all', ...unique];
  }, [products]);

  // Calculate maximum price in catalog for range slider
  const catalogCeilingPrice = useMemo<number>(() => {
    if (products.length === 0) return 1000;
    return Math.ceil(Math.max(...products.map((p) => p.price)));
  }, [products]);

  // Filter and sort products with useMemo for performance optimization
  const filteredProducts = useMemo<Product[]>(() => {
    const normalizedQuery = debouncedSearch.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price <= maxPrice;
      const matchesQuery =
        normalizedQuery === '' ||
        product.title.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesPrice && matchesQuery;
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case 'title-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'featured':
      default:
        break;
    }

    return sorted;
  }, [products, debouncedSearch, selectedCategory, maxPrice, sortBy]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('featured');
    setMaxPrice(catalogCeilingPrice);
  }, [catalogCeilingPrice]);

  // Visual Error State
  if (error) {
    return (
      <div
        role="alert"
        className="mx-auto my-8 max-w-2xl rounded-2xl border border-rose-200 bg-rose-50/80 p-8 text-center shadow-xs"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
          <AlertCircle className="h-7 w-7" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">
          მონაცემების ჩატვირთვა ვერ მოხერხდა
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{error}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onRetry(false)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            <span>ხელახლა ცდა</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <section aria-label="პროდუქტების კატალოგი" className="space-y-6">
      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 items-end">
          {/* Search Input */}
          <div className="md:col-span-5">
            <label
              htmlFor="catalog-search"
              className="mb-1.5 block text-xs font-semibold text-slate-700"
            >
              პროდუქტის ძიება
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="catalog-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="მაგ: Backpack, SSD, Gold, Jacket..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-9 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="ძიების გასუფთავება"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* Sort Select */}
          <div className="md:col-span-4">
            <label
              htmlFor="catalog-sort"
              className="mb-1.5 block text-xs font-semibold text-slate-700"
            >
              დალაგება
            </label>
            <div className="relative">
              <SlidersHorizontal
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <select
                id="catalog-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 py-2 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:bg-white transition-colors cursor-pointer"
              >
                <option value="featured">რჩეული (Default)</option>
                <option value="price-asc">ფასი: ზრდადობით</option>
                <option value="price-desc">ფასი: კლებადობით</option>
                <option value="rating-desc">რეიტინგი: მაღლიდან დაბლა</option>
                <option value="title-asc">დასახელება: A - Z</option>
              </select>
            </div>
          </div>

          {/* Max Price Range Filter */}
          <div className="md:col-span-3">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <label htmlFor="catalog-price-range" className="font-semibold text-slate-700">
                მაქს. ფასი:
              </label>
              <span className="font-bold text-indigo-600">${maxPrice}</span>
            </div>
            <input
              id="catalog-price-range"
              type="range"
              min={10}
              max={catalogCeilingPrice}
              step={5}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 rounded-lg bg-slate-200"
            />
          </div>
        </div>

        {/* Category Pills & Diagnostic Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3.5">
          <div
            role="group"
            aria-label="კატეგორიის ფილტრი"
            className="flex flex-wrap items-center gap-2"
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/25'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>
              ნაჩვენებია <strong className="text-slate-900">{filteredProducts.length}</strong>{' '}
              პროდუქტი
            </span>
            {isUsingFallback && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                Offline კატალოგი
              </span>
            )}
            <button
              type="button"
              onClick={() => onRetry(true)}
              title="შეცდომის (Error State) ვიზუალური ტესტირება"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <Bug className="h-3 w-3" aria-hidden="true" />
              <span>Error ტესტი</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Loading Skeleton State */}
      {loading ? (
        <div
          aria-busy="true"
          aria-label="პროდუქტები იტვირთება"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={`skeleton-${idx}`}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-xs animate-pulse"
            >
              <div className="h-52 w-full rounded-xl bg-slate-200/70" />
              <div className="mt-4 h-3 w-24 rounded-full bg-slate-200" />
              <div className="mt-3 h-4 w-full rounded-full bg-slate-200" />
              <div className="mt-2 h-4 w-2/3 rounded-full bg-slate-200" />
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="h-6 w-16 rounded-lg bg-slate-200" />
                <div className="h-9 w-28 rounded-xl bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Empty Filter State */
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <PackageSearch className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            პროდუქტები ვერ მოიძებნა
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
            თქვენს მიერ არჩეული ფილტრის ან საძიებო სიტყვის შესაბამისი პროდუქტი არ მოიძებნა.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            ფილტრების გასუფთავება
          </button>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              isPriority={index < 2}
            />
          ))}
        </div>
      )}
    </section>
  );
};
