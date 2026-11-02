import React, { useState } from 'react';
import { Mail, Clock, ShieldCheck, ArrowRight, Check } from 'lucide-react';

export default function Footer({ 
  onOpenTrack, 
  onOpenContact, 
  onOpenFaq, 
  onOpenPolicy 
}) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSuccess(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#05080F] border-t border-brand-border text-slate-400 text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <img 
              src="/logo.png" 
              alt="Vektor Studio" 
              className="h-10 w-auto object-contain"
            />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Vektor Studio curates premium smart home gadgets, laboratory-grade culinary tools, and cutting-edge personal electronics designed for the modern lifestyle.
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Mon – Sun, 9:00 AM – 7:00 PM (EST)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>support@thevektorstudio.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenTrack} className="hover:text-[#00E5FF] transition-colors cursor-pointer">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-[#00E5FF] transition-colors cursor-pointer">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={onOpenFaq} className="hover:text-[#00E5FF] transition-colors cursor-pointer">
                  FAQ & Help
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('refund')} className="hover:text-[#00E5FF] transition-colors cursor-pointer">
                  30-Day Guarantee
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Policies (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Legal & Policies</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onOpenPolicy('shipping')} className="hover:text-[#00E5FF] transition-colors cursor-pointer">
                  U.S. Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('refund')} className="hover:text-[#00E5FF] transition-colors cursor-pointer">
                  Refund & Return Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('privacy')} className="hover:text-[#00E5FF] transition-colors cursor-pointer">
                  Privacy Policy (CCPA Compliant)
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('terms')} className="hover:text-[#00E5FF] transition-colors cursor-pointer">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Box (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Unlock 15% OFF</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Subscribe to receive VIP access to limited smart drops and secret discount codes.
            </p>

            {newsletterSuccess ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>You're in! Use code <strong>WELCOME15</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-[#0F1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                />
                <button
                  type="submit"
                  className="bg-[#00E5FF] hover:bg-cyan-400 text-black font-bold p-2.5 rounded-xl cursor-pointer transition-colors"
                  title="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Icons */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Vektor Studio. All rights reserved.</p>

          {/* Payment Badges */}
          <div className="flex items-center gap-2 text-slate-500 font-bold tracking-wider">
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px]">VISA</span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px]">MASTERCARD</span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px]">AMEX</span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px]">APPLE PAY</span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px]">GOOGLE PAY</span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px]">PAYPAL</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
