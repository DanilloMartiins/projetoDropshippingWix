import React from 'react';
import { Truck, Sparkles } from 'lucide-react';

export default function AnnouncementBar({ onOpenTrack, onOpenContact, onOpenFaq }) {
  return (
    <div className="bg-gradient-to-r from-[#0B132B] via-[#080C14] to-[#0B132B] border-b border-brand-border/60 text-xs py-2 px-4 text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left / Center Promo message */}
        <div className="flex items-center gap-2 font-medium">
          <span className="flex h-2 w-2 rounded-full bg-[#00E5FF] animate-pulse" />
          <span className="flex items-center gap-1.5 text-white">
            <Truck className="w-3.5 h-3.5 text-[#00E5FF]" />
            <strong className="text-[#00E5FF]">FREE U.S. SHIPPING</strong> on orders over $50
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">
            Use code <strong className="text-white bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">WELCOME15</strong> for 15% OFF
          </span>
        </div>

        {/* Right Links */}
        <div className="flex items-center gap-4 text-slate-400 font-medium text-[11px]">
          <button 
            onClick={onOpenTrack}
            className="hover:text-[#00E5FF] transition-colors cursor-pointer"
          >
            Track Your Order
          </button>
          <span className="text-slate-700">•</span>
          <button 
            onClick={onOpenContact}
            className="hover:text-[#00E5FF] transition-colors cursor-pointer"
          >
            Contact Us
          </button>
          <span className="text-slate-700">•</span>
          <button 
            onClick={onOpenFaq}
            className="hover:text-[#00E5FF] transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </div>
      </div>
    </div>
  );
}
