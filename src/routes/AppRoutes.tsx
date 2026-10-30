import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';

// Lazy loading Cart / Checkout page per project requirements
const LazyCheckoutPage = lazy(() => import('../pages/CheckoutPage'));

const SuspenseFallback: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    className="flex min-h-[55vh] flex-col items-center justify-center gap-3 text-center"
  >
    <Loader2 className="h-9 w-9 animate-spin text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
      გვერდი იტვირთება...
    </p>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<LazyCheckoutPage />} />
          <Route path="/cart" element={<LazyCheckoutPage />} />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
