import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Check, Eye } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { getCategoryLabel } from '../services/productService';

export interface ProductCardProps {
  product: Product;
  /**
   * Whether this card is an LCP candidate (first 1-2 items in catalog).
   * Applies `fetchpriority="high"` without `loading="lazy"` per modern-web-guidance.
   */
  isPriority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(
  ({ product, isPriority = false }) => {
    const { addToCart, items } = useCart();
    const [justAdded, setJustAdded] = useState<boolean>(false);

    const quantityInCart =
      items.find((item) => item.product.id === product.id)?.quantity ?? 0;

    const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      addToCart(product, 1);
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 900);
    };

    return (
      <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/5">
        {/* Category & Cart Status Badges */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
          <span className="inline-flex items-center rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
            {getCategoryLabel(product.category)}
          </span>
          {quantityInCart > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
              კალათაში: {quantityInCart}
            </span>
          )}
        </div>

        {/* Product Image Container */}
        <Link
          to={`/products/${product.id}`}
          className="relative flex h-60 w-full items-center justify-center bg-gradient-to-b from-slate-50/70 to-white p-6 overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.title}
            width={240}
            height={240}
            {...(isPriority
              ? { fetchPriority: 'high' as const }
              : { loading: 'lazy' as const })}
            className="max-h-44 w-auto object-contain transition-transform duration-500 group-hover:scale-108"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 opacity-0 transition-all duration-300 group-hover:bg-slate-900/10 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-slate-900 shadow-md">
              <Eye className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
              <span>დეტალურად</span>
            </span>
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex flex-1 flex-col justify-between p-5 pt-3">
          <div>
            {/* Rating */}
            <div className="mb-2 flex items-center gap-1.5">
              <div className="flex items-center text-amber-400" aria-hidden="true">
                <Star className="h-4 w-4 fill-amber-400" />
              </div>
              <span className="text-xs font-bold text-slate-800">
                {product.rating.rate.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">
                ({product.rating.count} შეფასება)
              </span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
              <Link to={`/products/${product.id}`}>{product.title}</Link>
            </h3>

            {/* Short Description */}
            <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price and Add to Cart Button */}
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3.5">
            <div>
              <span className="block text-[11px] font-medium text-slate-400">ფასი</span>
              <span className="text-lg font-extrabold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                justAdded
                  ? 'bg-emerald-600 text-white scale-95 shadow-sm'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 shadow-sm shadow-indigo-600/20'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  <span>დაემატა!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                  <span>დამატება</span>
                </>
              )}
            </button>
          </div>
        </div>
      </article>
    );
  }
);

ProductCard.displayName = 'ProductCard';
