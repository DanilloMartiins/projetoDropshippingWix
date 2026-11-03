import React from 'react';
import { CheckCircle2, Package, Truck, ArrowRight, ShieldCheck, Mail, X } from 'lucide-react';

export default function OrderSuccessModal({ isOpen, onClose, onTrackOrder }) {
  if (!isOpen) return null;

  const orderNumber = `VS-${Math.floor(100000 + Math.random() * 900000)}-US`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-[#0D1424] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 text-slate-100 overflow-hidden text-center space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon Animation */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-inner shadow-emerald-500/20 animate-bounce">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-block">
            Payment Verified & Approved
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Thank You for Your Order!</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your payment was securely processed. We've sent a full receipt and shipping details to your email.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-left space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-slate-400">Order Number:</span>
            <span className="font-mono font-bold text-cyan-400 text-sm">{orderNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Shipping Method:</span>
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-cyan-400" />
              USPS Priority Mail (3-7 Days)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Guarantee:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              30-Day Money-Back Active
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              if (onTrackOrder) onTrackOrder(orderNumber);
            }}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Package className="w-4 h-4" />
            <span>Track Delivery</span>
          </button>

          <button
            onClick={onClose}
            className="sm:w-36 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>

        <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-2 border-t border-slate-800/60">
          <Mail className="w-3.5 h-3.5 text-slate-400" />
          <span>Questions? Contact us anytime at support@thevektorstudio.com</span>
        </p>
      </div>
    </div>
  );
}
