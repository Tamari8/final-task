import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  Check,
  Plus,
  Minus,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import type { Product } from '../types';
import {
  fetchProductById,
  fetchAllProducts,
  FALLBACK_PRODUCTS,
  getCategoryLabel,
} from '../services/productService';
import { useCart } from '../hooks/useCart';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  const loadProductDetails = useCallback(async () => {
    const numericId = Number(id);
    if (!id || Number.isNaN(numericId) || numericId <= 0) {
      setError('პროდუქტის არასწორი მისამართი (ID).');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setQuantity(1);

    try {
      const [singleProduct, allProducts] = await Promise.all([
        fetchProductById(numericId),
        fetchAllProducts(false),
      ]);
      setProduct(singleProduct);
      setRelatedProducts(
        allProducts
          .filter(
            (item) =>
              item.category === singleProduct.category && item.id !== singleProduct.id
          )
          .slice(0, 4)
      );
    } catch {
      const fallbackMatch = FALLBACK_PRODUCTS.find((p) => p.id === numericId);
      if (fallbackMatch) {
        setProduct(fallbackMatch);
        setRelatedProducts(
          FALLBACK_PRODUCTS.filter(
            (item) =>
              item.category === fallbackMatch.category && item.id !== fallbackMatch.id
          ).slice(0, 4)
        );
      } else {
        setError('მოთხოვნილი პროდუქტი ვერ მოიძებნა.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadProductDetails();
  }, [loadProductDetails]);

  if (loading) {
    return (
      <div
        aria-busy="true"
        className="animate-pulse space-y-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-10"
      >
        <div className="h-5 w-40 rounded-lg bg-slate-200" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="h-96 rounded-2xl bg-slate-200/70" />
          <div className="space-y-4">
            <div className="h-6 w-32 rounded-full bg-slate-200" />
            <div className="h-8 w-full rounded-xl bg-slate-200" />
            <div className="h-8 w-2/3 rounded-xl bg-slate-200" />
            <div className="h-10 w-36 rounded-xl bg-slate-200 mt-4" />
            <div className="h-24 w-full rounded-xl bg-slate-200 mt-4" />
            <div className="h-12 w-full rounded-xl bg-slate-200 mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        role="alert"
        className="mx-auto my-12 max-w-xl rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-xs"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
          <AlertCircle className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="text-lg font-bold text-slate-900">
          {error ?? 'პროდუქტი ვერ მოიძებნა'}
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          შეამოწმეთ ბმული ან დაბრუნდით მთავარ კატალოგში.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>კატალოგში დაბრუნება</span>
          </Link>
          <button
            type="button"
            onClick={loadProductDetails}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            <span>ხელახლა ცდა</span>
          </button>
        </div>
      </div>
    );
  }

  const quantityInCart =
    items.find((item) => item.product.id === product.id)?.quantity ?? 0;

  const handleAdd = () => {
    addToCart(product, quantity);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="animate-page-enter space-y-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>კატალოგში დაბრუნება</span>
        </Link>
        <span>/</span>
        <span className="text-slate-400">{getCategoryLabel(product.category)}</span>
        <span>/</span>
        <span className="truncate max-w-xs font-medium text-slate-900">
          {product.title}
        </span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 gap-8 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xs lg:grid-cols-12">
        {/* LCP Hero Product Image */}
        <div className="flex items-center justify-center rounded-2xl bg-slate-50/70 p-8 lg:col-span-5">
          <img
            src={product.image}
            alt={product.title}
            width={420}
            height={420}
            fetchPriority="high"
            className="max-h-96 w-auto object-contain transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Product Details Column */}
        <div className="flex flex-col justify-between space-y-6 lg:col-span-7">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                {getCategoryLabel(product.category)}
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                მარაგშია
              </span>
              {quantityInCart > 0 && (
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                  კალათაშია: {quantityInCart} ც.
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-400" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`h-4 w-4 ${
                      idx < Math.round(product.rating.rate)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800">
                {product.rating.rate.toFixed(1)} / 5.0
              </span>
              <span className="text-xs text-slate-400">
                ({product.rating.count} დადასტურებული შეფასება)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 border-y border-slate-100 py-4">
              <span className="text-3xl font-extrabold text-indigo-600">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-slate-400 line-through">
                ${(product.price * 1.2).toFixed(2)}
              </span>
              <span className="rounded-lg bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                დაზოგეთ 20% კოდით SHOPFLOW20
              </span>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                პროდუქტის აღწერა
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-5 pt-2">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <span className="mb-1.5 block text-xs font-bold text-slate-700">
                  რაოდენობა
                </span>
                <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="რაოდენობის შემცირება"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-white transition-colors cursor-pointer"
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span className="min-w-10 text-center text-sm font-extrabold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    aria-label="რაოდენობის გაზრდა"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-white transition-colors cursor-pointer"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="flex flex-1 flex-wrap gap-3 pt-5">
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`flex-1 min-w-[180px] min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition-all cursor-pointer ${
                    addedFeedback
                      ? 'bg-emerald-600 shadow-emerald-600/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
                  }`}
                >
                  {addedFeedback ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      <span>დაემატა კალათაში!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                      <span>
                        კალათაში დამატება (${(product.price * quantity).toFixed(2)})
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Zap className="h-4 w-4 text-amber-400" aria-hidden="true" />
                  <span>სწრაფი ყიდვა</span>
                </button>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-indigo-600 shrink-0" aria-hidden="true" />
                <span>სწრაფი მიწოდება თბილისსა და რეგიონებში (1-3 სამუშაო დღე)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>ოფიციალური გარანტია და 30-დღიანი დაბრუნების პოლიტიკა</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section aria-labelledby="related-heading" className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 id="related-heading" className="text-xl font-extrabold text-slate-900">
              მსგავსი პროდუქტები კატეგორიაში
            </h2>
            <Link
              to="/products"
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              ყველას ნახვა →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
