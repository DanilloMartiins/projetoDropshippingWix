import React, { useState } from 'react';
import { 
  X, User, MapPin, Package, Camera, Check, 
  LogOut, Phone, Mail, Sparkles, ExternalLink, ShieldCheck, Truck
} from 'lucide-react';

export default function AccountModal({ 
  isOpen, 
  onClose, 
  user, 
  onUpdateUser, 
  onLogout,
  onOpenTrack
}) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'address' | 'orders'
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile fields
  const [name, setName] = useState(user?.name || 'Danillo Martins');
  const [email] = useState(user?.email || 'customer@thevektorstudio.com');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-8901');
  const [avatar, setAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');

  // Address fields (padrão americano)
  const [address, setAddress] = useState(user?.shippingAddress || {
    street: '742 Evergreen Terrace',
    suite: 'Apt 4B',
    city: 'Springfield',
    state: 'OR',
    zip: '97477',
    country: 'United States'
  });

  // Pedidos simulados vinculados à conta do cliente
  const [orders] = useState([
    {
      id: 'VS-849201-US',
      date: 'Oct 30, 2026',
      total: 106.00,
      status: 'In Transit',
      trackingNumber: '9400111899562537638421',
      carrier: 'USPS Priority Mail',
      estimatedDelivery: 'Nov 04, 2026',
      items: [
        {
          name: 'Portable Desktop Range Hood Smoke Remover',
          quantity: 1,
          price: 106.00,
          image: 'https://static.wixstatic.com/media/eca2ba_5d7d789adc3a42aabbdac3c1672b6705~mv2.png'
        }
      ]
    },
    {
      id: 'VS-712034-US',
      date: 'Oct 15, 2026',
      total: 47.07,
      status: 'Delivered',
      trackingNumber: '9400111899561029384712',
      carrier: 'USPS Ground Advantage',
      estimatedDelivery: 'Oct 19, 2026',
      items: [
        {
          name: 'Infrared Non-Contact Forehead Thermometer For Kids',
          quantity: 1,
          price: 47.07,
          image: 'https://static.wixstatic.com/media/eca2ba_6178fc2d62a748d29a6cdb0437f8491b~mv2.jpeg'
        }
      ]
    }
  ]);

  if (!isOpen) return null;

  const handleAvatarChange = () => {
    // Alterna fotos pré-selecionadas ou simula upload
    const photos = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    ];
    const currentIndex = photos.indexOf(avatar);
    const nextPhoto = photos[(currentIndex + 1) % photos.length];
    setAvatar(nextPhoto);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      if (onUpdateUser) {
        onUpdateUser({
          ...user,
          name,
          phone,
          avatar,
          shippingAddress: address
        });
      }
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#0D1424] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/60 text-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glows */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header com Avatar e Nome */}
        <div className="p-6 border-b border-slate-800 relative bg-slate-900/40">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Avatar com botão de troca */}
            <div className="relative group cursor-pointer" onClick={handleAvatarChange}>
              <img
                src={avatar}
                alt={name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/20 group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-2 -right-1 bg-cyan-500 text-black p-1 rounded-full text-[10px] shadow">
                <Sparkles className="w-3 h-3" />
              </span>
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  VERIFIED MEMBER
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-1">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                {email}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Member of Vektor Studio USA • Synced with Wix Members
              </p>
            </div>

            <button
              onClick={onLogout}
              className="sm:self-center px-3 py-1.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Abas de Navegação do Perfil */}
          <div className="flex items-center gap-2 mt-6 pt-2 border-t border-slate-800/60 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                activeTab === 'profile'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Personal Info</span>
            </button>
            <button
              onClick={() => setActiveTab('address')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                activeTab === 'address'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Shipping Address</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                activeTab === 'orders'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>My Orders ({orders.length})</span>
            </button>
          </div>
        </div>

        {/* Conteúdo das Abas (Scrollável) */}
        <div className="p-6 overflow-y-auto space-y-5">
          {saveSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Changes saved successfully to your Vektor Studio account!</span>
            </div>
          )}

          {/* TAB 1: PERSONAL INFO */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email (Registered with Wix)</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-800/80 rounded-xl text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number (For USPS SMS alerts)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="py-2.5 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSaving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SHIPPING ADDRESS */}
          {activeTab === 'address' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Street Address</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="Street name & house number"
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Apartment, Suite, Unit (Optional)</label>
                <input
                  type="text"
                  value={address.suite}
                  onChange={(e) => setAddress({ ...address, suite: e.target.value })}
                  placeholder="Apt 4B"
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Zip Code</label>
                  <input
                    type="text"
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Country</label>
                <input
                  type="text"
                  disabled
                  value="United States (USPS Priority Network)"
                  className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800/80 rounded-xl text-sm text-slate-400 cursor-not-allowed"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="py-2.5 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSaving ? 'Saving...' : 'Save Shipping Address'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: ORDERS & TRACKING */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/60 text-xs">
                    <div>
                      <span className="text-slate-400">Order ID: </span>
                      <span className="font-mono font-bold text-cyan-400">{order.id}</span>
                      <span className="text-slate-500 ml-2">• {order.date}</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 animate-pulse'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Itens do pedido */}
                  <div className="py-3 space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-400">Qty: {item.quantity} • ${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Informações de Rastreio */}
                  <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{order.carrier} • Tracking: <span className="font-mono text-slate-300">{order.trackingNumber.slice(0, 10)}...</span></span>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        if (onOpenTrack) onOpenTrack();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Track Package</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 text-center flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Vektor Studio Customer Protection • Synced with Wix eCommerce</span>
        </div>
      </div>
    </div>
  );
}
