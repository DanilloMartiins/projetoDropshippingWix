import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Star } from 'lucide-react';

export default function Hero({ onExploreCategory }) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-brand-border">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#00E5FF]/20 via-[#2563EB]/20 to-[#7C3AED]/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#00E5FF]/10 blur-[90px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text / Value Proposition */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 bg-[#0F1626] border border-cyan-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#00E5FF] shadow-inner shadow-cyan-500/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE FUTURE OF HOME & TECH • 2026 COLLECTION</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Smart Gadgets That <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#00E5FF] via-[#38BDF8] to-[#818CF8] bg-clip-text text-transparent">
                Upgrade Your Routine.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Engineered for modern living. Explore laboratory-grade smart kitchen essentials, titanium charging cables, and high-performance electronics designed to make daily life seamless.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onExploreCategory('smart-kitchen')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#00E5FF] to-[#2563EB] hover:opacity-95 text-black font-bold text-sm px-7 py-3.5 rounded-full shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95 cursor-pointer"
              >
                <span>Shop Smart Kitchen</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onExploreCategory('tech-gadgets')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F1626] hover:bg-slate-800 text-white font-semibold text-sm px-6 py-3.5 rounded-full border border-slate-700 hover:border-[#00E5FF]/50 transition-all cursor-pointer"
              >
                <span>Explore Tech Gadgets</span>
              </button>
            </div>

            {/* Social Proof / Guarantee Strip */}
            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-slate-200">4.9/5</span>
                <span>(2,400+ U.S. Reviews)</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                <span>30-Day Money-Back Guarantee</span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main featured product card */}
              <div className="rounded-3xl p-1 bg-gradient-to-b from-[#00E5FF]/40 via-slate-800 to-transparent shadow-2xl shadow-cyan-950/50">
                <div className="rounded-[22px] bg-[#0A0F1D] p-5 border border-slate-800 space-y-4">
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-slate-900 group">
                    <img 
                      src="https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80" 
                      alt="UltraBlend Pro Portable Blender" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      38% OFF
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 bg-[#080C14]/85 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-[#00E5FF] font-bold uppercase tracking-wider">Kitchen Hero</p>
                        <p className="text-xs font-semibold text-white">UltraBlend Pro 6-Blade</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 line-through mr-1">$69.99</span>
                        <span className="text-sm font-extrabold text-[#00E5FF]">$42.99</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights checklist */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5 bg-[#0F1626] p-2 rounded-lg border border-slate-800">
                      <Zap className="w-3.5 h-3.5 text-[#00E5FF]" />
                      <span>22,000 RPM Motor</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#0F1626] p-2 rounded-lg border border-slate-800">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>USB-C Fast Charge</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating review card */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-[#0F1626]/95 backdrop-blur-md p-3.5 rounded-2xl border border-cyan-500/30 shadow-xl items-center gap-3 max-w-xs">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00E5FF] to-blue-600 flex items-center justify-center font-bold text-black text-sm">
                  JD
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white flex items-center gap-1">
                    Jason D. <span className="text-[10px] text-emerald-400 font-normal">✓ Verified Buyer</span>
                  </p>
                  <p className="text-slate-400 text-[11px] italic">"Game changer for morning smoothies. Shipping took only 4 days to Texas!"</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
