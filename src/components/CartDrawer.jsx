import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Check, ShieldCheck, Tag } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0F1626] border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#00E5FF]" />
              <h3 className="text-base font-extrabold text-white">Your Shopping Cart</h3>
              <span className="text-xs bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-full">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#0A0F1D] px-5 py-3 border-b border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Truck className="w-4 h-4 text-[#00E5FF]" />
                {isFreeShipping ? (
                  <strong className="text-emerald-400">🎉 You unlocked FREE U.S. Shipping!</strong>
                ) : (
                  <span>
                    Add <strong className="text-[#00E5FF]">${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}</strong> for FREE Shipping
                  </span>
                )}
              </span>
              <span className="text-slate-400 text-[11px]">{progressPercent}%</span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#00E5FF] to-blue-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-white">Your cart is empty</p>
                  <p className="text-xs text-slate-400">Looks like you haven't added any tech items yet.</p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-[#00E5FF] to-[#2563EB] text-black font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer hover:opacity-95"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex gap-4 p-3 rounded-2xl bg-[#131C31] border border-slate-800"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-18 h-18 object-cover rounded-xl bg-slate-900 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-white line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-slate-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#00E5FF] font-semibold mt-0.5">
                        ${item.product.price.toFixed(2)} each
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity buttons */}
                      <div className="flex items-center border border-slate-700 rounded-md bg-slate-900">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-slate-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-white min-w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-slate-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-extrabold text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Area */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-[#0A0F1D] space-y-4">
              
              {/* Promo code input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Coupon code (try WELCOME15)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full bg-[#131C31] border border-slate-700 rounded-lg py-2 pl-8 pr-3 text-xs text-white uppercase placeholder:normal-case placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-700 text-xs text-white font-semibold px-4 rounded-lg border border-slate-700 cursor-pointer"
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
                  <span className="text-slate-400">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount (15% OFF)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-400">Shipping (U.S.)</span>
                  <span>
                    {isFreeShipping ? (
                      <span className="text-emerald-400 font-bold uppercase">FREE</span>
                    ) : (
                      `$${shippingAmount.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>Total</span>
                  <span className="text-xl text-[#00E5FF]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA Button */}
              <button
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-[#00E5FF] to-[#2563EB] hover:opacity-95 text-black font-extrabold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust & Payment badges */}
              <div className="pt-2 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-Bit SSL Encrypted Checkout</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold tracking-wider">
                  <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">VISA</span>
                  <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">MASTERCARD</span>
                  <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">AMEX</span>
                  <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">APPLE PAY</span>
                  <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">PAYPAL</span>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
