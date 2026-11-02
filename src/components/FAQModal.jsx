import React, { useState } from 'react';
import { X, HelpCircle, ChevronDown } from 'lucide-react';

export default function FAQModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [openIndex, setOpenIndex] = useState(0);

  const FAQS = [
    {
      q: 'How long does shipping take within the United States?',
      a: 'Orders are processed within 24-48 hours. Delivery typically takes 3 to 7 business days depending on your state. All orders include full end-to-end tracking updates delivered directly to your email.'
    },
    {
      q: 'What is your 30-Day Money-Back Guarantee policy?',
      a: 'We stand behind the quality of our gadgets. If you are not 100% satisfied with your item within 30 days of receiving it, simply email our team at support@thevektorstudio.com to initiate a quick, hassle-free return and full refund.'
    },
    {
      q: 'How do I track my order status?',
      a: 'As soon as your package leaves our fulfillment center, you will receive an email with your official tracking number. You can also click "Track Your Order" on our top bar at any time to check real-time updates.'
    },
    {
      q: 'Which payment methods do you accept?',
      a: 'We accept all major credit and debit cards (Visa, MasterCard, American Express, Discover), as well as Apple Pay, Google Pay, and PayPal. All transactions are protected by bank-grade 256-bit SSL encryption.'
    },
    {
      q: 'What are your customer support hours?',
      a: 'Our support team is online Monday through Sunday from 9:00 AM to 7:00 PM (EST). We answer all emails and tickets at support@thevektorstudio.com within 24 hours.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-[#0F1626] border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/10 border border-cyan-500/30 text-[#00E5FF] flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-white">Frequently Asked Questions</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Everything you need to know about our products, shipping, and guarantees.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="rounded-2xl bg-[#0A0F1D] border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4 text-xs font-bold text-white hover:text-[#00E5FF] transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#00E5FF]' : 'text-slate-500'}`} />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 animate-fadeIn">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
