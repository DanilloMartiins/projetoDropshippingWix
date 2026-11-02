import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Check, ShieldCheck, Tag, Plus, Minus } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckout
}) {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  const FREE_SHIPPING_THRESHOLD = 50.0;
  
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = subtotal * appliedDiscount;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingAmount = isFreeShipping || subtotal === 0 ? 0 : 4.99;
  const total = Math.max(0, subtotal - discountAmount + shippingAmount);

  const progressPercent = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'WELCOME15') {
      setAppliedDiscount(0.15);
      setPromoMessage('15% OFF discount applied!');
    } else {
      setPromoMessage('Invalid coupon code. Try WELCOME15');
      setTimeout(() => setPromoMessage(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-[#0C121E] border-l border-slate-800 shadow-2xl flex flex-col h-full overflow-hidden">
          
          {/* Header (Mercado Livre Style) */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#080C14] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">Your Shopping Cart</h3>
                <p className="text-[11px] text-slate-400">
                  {totalItemsCount} {totalItemsCount === 1 ? 'product' : 'products'} selected
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar (Mercado Livre Free Shipping Banner) */}
          <div className="bg-[#0F172A]/80 px-4 py-2.5 border-b border-slate-800/80 shrink-0">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-slate-200">
                <Truck className="w-4 h-4 text-[#00E5FF]" />
                {isFreeShipping ? (
                  <strong className="text-emerald-400">🎉 FREE Shipping unlocked!</strong>
                ) : (
                  <span>
                    Add <strong className="text-[#00E5FF]">${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}</strong> for FREE Shipping
                  </span>
                )}
              </span>
              <span className="text-[11px] text-slate-400 font-bold">{progressPercent}%</span>
            </div>

            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#00E5FF] to-blue-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List (Clean Mercado Livre Compact Layout) */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-white">Your cart is empty</p>
                  <p className="text-xs text-slate-400">Discover top trending smart gadgets and add to cart.</p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-[#00E5FF] to-[#2563EB] text-black font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer hover:opacity-95"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex gap-3 p-3 rounded-xl bg-[#111827] border border-slate-800/90 hover:border-slate-700 transition-colors"
                >
                  {/* Fixed Compact Thumbnail (Mercado Livre Style) */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details & Actions */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1.5">
                        <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-slate-500 hover:text-red-400 p-1 -mr-1 -mt-1 cursor-pointer transition-colors shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-extrabold text-[#00E5FF]">
                          ${item.product.price.toFixed(2)}
                        </span>
                        {item.product.compareAtPrice && (
                          <span className="text-[10px] text-slate-500 line-through">
                            ${item.product.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom row: Mercado Livre quantity selector & subtotal */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-1">
                      {/* Compact Pill Quantity Selector */}
                      <div className="flex items-center border border-slate-700 rounded-lg bg-slate-900/90 overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-white min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total for this line */}
                      <span className="text-xs font-extrabold text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary Area */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#080C14] space-y-3.5 shrink-0">
              
              {/* Promo code input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Coupon code (try WELCOME15)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full bg-[#111827] border border-slate-700/80 rounded-lg py-1.5 pl-8 pr-2 text-xs text-white uppercase placeholder:normal-case placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                </div>
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-700 text-xs text-white font-semibold px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {promoMessage && (
                <p className={`text-[11px] font-semibold ${appliedDiscount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {promoMessage}
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal ({totalItemsCount} items)</span>
                  <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Coupon Discount (15% OFF)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-400">Shipping (U.S.)</span>
                  <span>
                    {isFreeShipping ? (
                      <span className="text-emerald-400 font-bold uppercase">FREE</span>
                    ) : (
                      <span className="text-slate-200">${shippingAmount.toFixed(2)}</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>Total</span>
                  <span className="text-xl text-[#00E5FF] font-black">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-[#00E5FF] to-[#2563EB] hover:opacity-95 text-black font-extrabold text-sm py-3 px-5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Security badges */}
              <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
