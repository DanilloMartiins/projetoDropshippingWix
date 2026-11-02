import React, { useState } from 'react';
import { X, FileText, Shield, Truck, RotateCcw } from 'lucide-react';

export default function PolicyModal({ isOpen, onClose, initialTab = 'shipping' }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl rounded-3xl bg-[#0F1626] border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-800 gap-2 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'shipping'
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Shipping Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('refund')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'refund'
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Refund & Returns</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'privacy'
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'terms'
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto pr-2 text-xs text-slate-300 space-y-4 leading-relaxed">
          {activeTab === 'shipping' && (
            <div className="space-y-3">
              <h4 className="text-base font-extrabold text-white">United States Shipping Policy</h4>
              <p>At <strong>Vektor Studio</strong>, we strive to deliver your smart home gadgets and electronics as quickly and reliably as possible.</p>
              
              <div className="p-3 bg-[#0A0F1D] rounded-xl border border-slate-800 space-y-1">
                <p className="font-bold text-white">Standard Delivery Timelines:</p>
                <p>• <strong>Order Processing:</strong> 24 to 48 hours (Monday through Friday).</p>
                <p>• <strong>U.S. Continental Delivery:</strong> 3 to 7 business days via USPS Priority or regional carriers.</p>
                <p>• <strong>Free Shipping Eligibility:</strong> Automatically applied to all orders with a subtotal of $50.00 or higher.</p>
              </div>

              <p><strong>Tracking:</strong> Once your package is dispatched, you will receive an automated shipping confirmation email with your direct tracking number. You can verify real-time status via our "Track Your Order" tool.</p>
              <p>For inquiries, please reach out to <strong>support@thevektorstudio.com</strong>.</p>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-3">
              <h4 className="text-base font-extrabold text-white">30-Day Money-Back Guarantee</h4>
              <p>We believe in the craftsmanship of our products. If you are not completely satisfied with your purchase, you have <strong>30 days</strong> from the date of delivery to request a full refund or exchange.</p>
              
              <div className="p-3 bg-[#0A0F1D] rounded-xl border border-slate-800 space-y-1">
                <p className="font-bold text-white">Return Eligibility Criteria:</p>
                <p>1. Item must be in original condition with all accessories, cables, and packaging.</p>
                <p>2. Proof of purchase (Order # or confirmation email).</p>
                <p>3. Contact our support team at <strong>support@thevektorstudio.com</strong> to receive your Return Merchandise Authorization (RMA) and return address.</p>
              </div>

              <p><strong>Refund Processing:</strong> Once your return is inspected at our warehouse, refunds are credited back to your original payment method (Visa, Mastercard, PayPal, Apple Pay) within 3 to 5 business days.</p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h4 className="text-base font-extrabold text-white">Privacy & Data Security Policy</h4>
              <p>Vektor Studio adheres to rigorous consumer data privacy standards, including CCPA and federal data regulations.</p>
              <p>• We never sell, rent, or trade your personal information to third parties.</p>
              <p>• Payment details are processed directly through PCI-DSS Level 1 certified gateways with 256-bit encryption. We never store credit card numbers on our servers.</p>
              <p>• Email addresses submitted for order updates or support are strictly used for relevant store communication.</p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h4 className="text-base font-extrabold text-white">Terms of Service</h4>
              <p>By accessing or purchasing from thevektorstudio.com, you agree to our standard terms and conditions.</p>
              <p>• All prices are quoted and processed in United States Dollars (USD).</p>
              <p>• We reserve the right to limit quantities or cancel orders with inaccurate billing data.</p>
              <p>• Product warranties cover manufacturing defects for 12 months from delivery date.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
