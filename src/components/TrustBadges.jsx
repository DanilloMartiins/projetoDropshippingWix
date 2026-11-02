import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

export default function TrustBadges() {
  const BADGES = [
    {
      icon: Truck,
      title: 'Fast Tracked U.S. Shipping',
      description: 'Delivered in 3-7 business days with tracking via USPS/FedEx.',
      color: 'text-[#00E5FF]'
    },
    {
      icon: RotateCcw,
      title: '30-Day Risk-Free Trial',
      description: 'Love your item or return it for a 100% refund. Zero hassle.',
      color: 'text-purple-400'
    },
    {
      icon: ShieldCheck,
      title: '256-Bit Secure Checkout',
      description: 'End-to-end encrypted payments with Stripe, Apple Pay & PayPal.',
      color: 'text-emerald-400'
    },
    {
      icon: Headphones,
      title: '7-Day Dedicated Support',
      description: 'Mon - Sun, 9am - 7pm EST at support@thevektorstudio.com',
      color: 'text-blue-400'
    }
  ];

  return (
    <section className="border-b border-brand-border bg-[#0A0F1D]/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BADGES.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="flex items-start gap-4 p-4 rounded-2xl bg-[#0F1626]/50 border border-slate-800/80 hover:border-slate-700 transition-all"
              >
                <div className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
