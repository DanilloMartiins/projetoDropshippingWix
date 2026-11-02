import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Truck, RotateCcw, Check, Zap } from 'lucide-react';

export default function ProductModal({ product, isOpen, onClose, onAddToCart }) {
  if (!isOpen || !product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const discountPercent = Math.round(
    ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
  );

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl rounded-3xl bg-[#0F1626] border border-slate-700/80 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Images */}
        <div className="md:w-1/2 p-6 flex flex-col justify-center bg-slate-900/60 border-b md:border-b-0 md:border-r border-slate-800">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-[#00E5FF] text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails if multiple */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-[#00E5FF]' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto space-y-5">
          {/* Rating & Category */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-[#00E5FF] font-semibold uppercase tracking-wider">{product.categoryLabel}</span>
              <span>•</span>
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{product.rating}</span>
                <span className="text-slate-500">({product.reviewsCount} customer reviews)</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {product.name}
            </h2>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <>
                <span className="text-base text-slate-500 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-md">
                  SAVE {discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Urgency Stock Bar */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold">
              <Zap className="w-4 h-4 text-amber-400" />
              High Demand: Only {product.stockLeft} units remaining!
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {product.description}
          </p>

          {/* Feature Bullets */}
          <div className="space-y-1.5 pt-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Innovations:</p>
            <ul className="space-y-1 text-xs text-slate-300">
              {product.features?.map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400">Quantity:</span>
              <div className="flex items-center border border-slate-700 rounded-lg bg-slate-900 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-bold text-white min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAdd}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer shadow-lg ${
                addedAnimation
                  ? 'bg-emerald-500 text-black'
                  : 'bg-gradient-to-r from-[#00E5FF] to-[#2563EB] hover:opacity-95 text-black shadow-cyan-500/25'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart - ${(product.price * quantity).toFixed(2)}</span>
                </>
              )}
            </button>
          </div>

          {/* Trust points */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Tracked U.S. Shipping</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
              <span>30-Day Money Back</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
