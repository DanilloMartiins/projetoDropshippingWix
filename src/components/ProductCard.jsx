import React from 'react';
import { Star, ShoppingBag, Eye, Zap } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onQuickView }) {
  const discountPercent = Math.round(
    ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
  );

  return (
    <div className="group relative rounded-2xl bg-[#0F1626]/80 border border-slate-800 hover:border-[#00E5FF]/40 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30 flex flex-col overflow-hidden">
      
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-900 cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="bg-[#00E5FF] text-black text-[10px] font-black px-2 py-0.5 rounded-full tracking-wider uppercase shadow-md">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Quick View Button overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#080C14]/90 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-full border border-slate-700 flex items-center gap-1.5 shadow-lg backdrop-blur-sm cursor-pointer whitespace-nowrap"
        >
          <Eye className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1.5">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              {product.categoryLabel}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating}</span>
              <span className="text-slate-500">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="text-sm font-bold text-white group-hover:text-[#00E5FF] transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Add to Cart button */}
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-slate-500 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            {product.stockLeft <= 8 && (
              <span className="text-[10px] text-amber-400/90 font-semibold flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5" />
                Only {product.stockLeft} left
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-[#162036] hover:bg-gradient-to-r hover:from-[#00E5FF] hover:to-[#2563EB] hover:text-black text-slate-200 border border-slate-700/80 hover:border-transparent text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>

      </div>

    </div>
  );
}
