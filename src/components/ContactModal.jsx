import React, { useState } from 'react';
import { X, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-[#0F1626] border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden max-h-[92vh] overflow-y-auto"
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
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-white">Contact Customer Support</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Have a question about an order, tracking, or products? Our dedicated team is ready to help 7 days a week.
          </p>
        </div>

        {/* Operating Hours Box (As requested) */}
        <div className="rounded-2xl bg-[#0A0F1D] p-4 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-white font-bold">
            <Clock className="w-4 h-4 text-[#00E5FF]" />
            <span>Support Hours: Monday – Sunday, 9:00 AM – 7:00 PM (EST)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Mail className="w-4 h-4 text-purple-400" />
            <span>Direct Email: <strong className="text-white">support@thevektorstudio.com</strong></span>
          </div>
          <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">
            ⚡ Response Guarantee: We review and answer all customer tickets within 24 hours.
          </p>
        </div>

        {/* Form */}
        {submitted ? (
          <div className="py-10 text-center space-y-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Message Sent Successfully!</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Thank you for reaching out. We will get back to you at <strong>{formData.email}</strong> shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0A0F1D] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#0A0F1D] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Order # (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. VK-10294"
                value={formData.orderNumber}
                onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                className="w-full bg-[#0A0F1D] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                How Can We Help? *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe your inquiry, order question, or issue..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[#0A0F1D] border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#00E5FF] to-[#2563EB] hover:opacity-95 text-black font-bold text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-cyan-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
