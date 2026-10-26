import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Loader2, ShoppingBag } from 'lucide-react';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { Notification } from './components/Notification';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';

// Lazy Loading Cart / Checkout page per Requirement 4 (React.lazy & Suspense)
const LazyCheckoutPage = lazy(() => import('./pages/CheckoutPage'));

const SuspenseFallback: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    className="flex min-h-[55vh] flex-col items-center justify-center gap-3 text-center"
  >
    <Loader2 className="h-9 w-9 animate-spin text-indigo-600" aria-hidden="true" />
    <p className="text-sm font-bold text-slate-700">
      შეკვეთის გვერდი იტვირთება...
    </p>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
          <Header />
          <CartDrawer />
          <Notification />

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <Suspense fallback={<SuspenseFallback />}>
              <Routes>
                <Route path="/" element={<Navigate to="/products" replace />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/checkout" element={<LazyCheckoutPage />} />
                <Route path="/cart" element={<LazyCheckoutPage />} />
                <Route path="*" element={<Navigate to="/products" replace />} />
              </Routes>
            </Suspense>
          </main>

          <footer className="mt-16 border-t border-slate-200/80 bg-white py-8 text-xs text-slate-500">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="font-bold text-slate-900">ShopFlow</span>
                <span>— თანამედროვე E-Commerce ვებ-აპლიკაცია (React + TypeScript)</span>
              </div>

              <div className="flex items-center gap-5 font-medium">
                <Link to="/products" className="hover:text-indigo-600 transition-colors">
                  კატალოგი
                </Link>
                <Link to="/checkout" className="hover:text-indigo-600 transition-colors">
                  კალათა / Checkout
                </Link>
                <span className="text-slate-400">© 2026 ShopFlow</span>
              </div>
            </div>
          </footer>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
