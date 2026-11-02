import React, { useState } from 'react';
import { X, Search, Package, CheckCircle2, Clock, Truck, MapPin } from 'lucide-react';

export default function TrackOrderModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [trackingCode, setTrackingCode] = useState('');
  const [result, setResult] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;

    // Simulated realistic U.S. tracking update
    setResult({
      code: trackingCode.toUpperCase(),
      carrier: 'USPS Priority Mail / Expedited',
      status: 'In Transit - On Schedule',
      origin: 'Fulfillment Center, Dayton, OH',
      destination: 'Austin, TX (United States)',
      estimatedDelivery: 'Thursday by 7:00 PM',
      steps: [
        { title: 'Order Confirmed & Payment Verified', time: 'Oct 29, 10:14 AM', done: true },
        { title: 'Package Processed at Logistics Hub', time: 'Oct 30, 02:40 PM', done: true },
        { title: 'In Transit to Regional Carrier Facility', time: 'Nov 01, 09:20 AM', current: true },
        { title: 'Out for Delivery via Local USPS Courier', time: 'Estimated Soon', done: false }
      ]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-[#0F1626] border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden"
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
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-white">Track Your Order</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Enter your tracking number or order number (found in your confirmation email).
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleTrack} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. VK-839201 or 940011189956..."
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            className="flex-1 bg-[#0A0F1D] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-[#00E5FF] to-[#2563EB] text-black font-bold text-xs px-6 py-3 rounded-xl hover:opacity-95 cursor-pointer flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Track</span>
          </button>
        </form>

        {/* Results display */}
        {result && (
          <div className="rounded-2xl bg-[#0A0F1D] p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Tracking #</p>
                <p className="text-sm font-extrabold text-white">{result.code}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                  {result.status}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">{result.carrier}</p>
              </div>
            </div>

            {/* Timeline steps */}
            <div className="space-y-3 pt-2">
              {result.steps.map((st, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <div className="mt-0.5">
                    {st.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : st.current ? (
                      <Truck className="w-4 h-4 text-[#00E5FF] animate-pulse" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${st.current ? 'text-[#00E5FF]' : st.done ? 'text-white' : 'text-slate-500'}`}>
                      {st.title}
                    </p>
                    <p className="text-[10px] text-slate-500">{st.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
