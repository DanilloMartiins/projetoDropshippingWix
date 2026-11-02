import React, { useState, useEffect, useMemo } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBadges from './components/TrustBadges';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import TrackOrderModal from './components/TrackOrderModal';
import ContactModal from './components/ContactModal';
import FAQModal from './components/FAQModal';
import PolicyModal from './components/PolicyModal';
import AuthModal from './components/AuthModal';
import AccountModal from './components/AccountModal';
import Footer from './components/Footer';
import { PRODUCTS, CATEGORIES } from './data/products';
import { createCheckout, fetchWixProducts } from './services/wixClient';
import { Sparkles, SlidersHorizontal, ArrowUpDown, Star, CheckCircle2, ShieldCheck, Flame, RefreshCw } from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [policyState, setPolicyState] = useState({ isOpen: false, tab: 'shipping' });
  const [checkoutNotification, setCheckoutNotification] = useState(false);

  // Products from Wix Dynamic Catalog
  const [productsList, setProductsList] = useState(PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // User Authentication State
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('vektor_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Fetch Wix Catalog on Mount
  useEffect(() => {
    let isMounted = true;
    setIsLoadingProducts(true);

    fetchWixProducts()
      .then((items) => {
        if (isMounted && Array.isArray(items) && items.length > 0) {
          setProductsList(items);
        }
      })
      .catch((err) => {
        console.warn('Erro ao carregar catálogo Wix:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingProducts(false);
      });

    return () => { isMounted = false; };
  }, []);

  // Save User to LocalStorage
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem('vektor_user', JSON.stringify(userData));
    } catch (e) {
      console.error('Failed to save user in storage:', e);
    }
  };

  const handleUpdateUser = (updatedData) => {
    setUser(updatedData);
    try {
      localStorage.setItem('vektor_user', JSON.stringify(updatedData));
    } catch (e) {
      console.error('Failed to update user in storage:', e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('vektor_user');
    } catch (e) {
      console.error('Failed to remove user from storage:', e);
    }
    setIsAccountOpen(false);
  };

  // Cart state with localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('vektor_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vektor_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Cart operations
  const handleAddToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = async () => {
    setCheckoutNotification(true);
    const result = await createCheckout(cartItems);
    setTimeout(() => {
      setCheckoutNotification(false);
      if (result && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    }, 1800);
  };

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      // Category filter
      if (selectedCategory === 'sale' && !p.isSale) return false;
      if (selectedCategory !== 'all' && selectedCategory !== 'sale' && p.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = (p.name || '').toLowerCase().includes(query);
        const matchDesc = (p.description || '').toLowerCase().includes(query);
        const matchCat = (p.categoryLabel || '').toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [productsList, selectedCategory, searchQuery, sortBy]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col selection:bg-[#00E5FF] selection:text-black">
      
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar
        onOpenTrack={() => setIsTrackOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
      />

      {/* 2. Main Navigation Bar */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        wishlistCount={2}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* 3. Hero Banner */}
      <Hero
        onExploreCategory={(catId) => {
          setSelectedCategory(catId);
          document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 4. Trust Badges */}
      <TrustBadges />

      {/* 5. Main Catalog Section */}
      <main id="catalog-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 w-full space-y-8">
        
        {/* Section Heading & Category Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00E5FF] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Engineered For High Performance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {selectedCategory === 'all' && 'Trending Gadgets & Innovations'}
              {selectedCategory === 'smart-kitchen' && 'Smart Kitchen Appliances'}
              {selectedCategory === 'tech-gadgets' && 'Personal Electronics & Tech'}
              {selectedCategory === 'phone-accessories' && 'Fast Charging & Phone Accessories'}
              {selectedCategory === 'home-essentials' && 'Smart Home Essentials'}
              {selectedCategory === 'sale' && 'Limited Time Clearance Deals'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Showing {filteredProducts.length} verified items available with 3-7 day U.S. delivery.
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Sort By:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#0F1626] border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#00E5FF] cursor-pointer"
            >
              <option value="featured">Featured / Best Sellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar (Interactive) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#00E5FF] to-[#2563EB] text-black shadow-md shadow-cyan-500/20'
                  : cat.id === 'sale'
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                  : 'bg-[#0F1626] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.id === 'sale' && <Flame className="w-3.5 h-3.5 text-red-400" />}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-[#0F1626]/50 border border-slate-800 space-y-3">
            <p className="text-lg font-bold text-white">No products found</p>
            <p className="text-xs text-slate-400">Try adjusting your category filter or search keywords.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="bg-slate-800 hover:bg-slate-700 text-xs text-white px-5 py-2 rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onQuickView={setActiveProductModal}
              />
            ))}
          </div>
        )}

        {/* High Conversion Banner: Smart Kitchen Focus */}
        <section className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#0F1626] via-[#101935] to-[#0A0F1D] border border-cyan-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00E5FF] bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full inline-block">
              Culinary Tech Collection
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              Cook Faster. Eat Fresh. <br />
              Zero Prep Fatigue.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              From titanium 6-blade portable blenders to automatic gravity salt grinders, discover smart culinary tools built to shave 30 minutes off your daily routine.
            </p>
            <div className="pt-2 flex gap-4">
              <button
                onClick={() => {
                  setSelectedCategory('smart-kitchen');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-[#00E5FF] to-[#2563EB] text-black font-bold text-xs px-6 py-3 rounded-full hover:opacity-95 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                Shop Smart Kitchen
              </button>
            </div>
          </div>
        </section>

        {/* Customer Verified Reviews Grid */}
        <section className="space-y-6 pt-10">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <h3 className="text-2xl font-extrabold text-white">Loved by 2,400+ Tech Enthusiasts</h3>
            <p className="text-xs text-slate-400">Real verified purchases delivered across the United States.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">✓ Verified Buyer</span>
              </div>
              <p className="text-xs text-slate-300 italic">
                "The UltraBlend Pro exceeded all expectations. Crushes ice effortlessly and battery lasts all week. Delivery to Miami was 4 days!"
              </p>
              <div>
                <p className="text-xs font-bold text-white">Marcus T.</p>
                <p className="text-[10px] text-slate-500">Florida, United States</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">✓ Verified Buyer</span>
              </div>
              <p className="text-xs text-slate-300 italic">
                "Bought the MagCharge 3-in-1 for my nightstand. Cleaned up all cables and charges my Apple Watch + iPhone at top speed."
              </p>
              <div>
                <p className="text-xs font-bold text-white">Sarah K.</p>
                <p className="text-[10px] text-slate-500">California, United States</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">✓ Verified Buyer</span>
              </div>
              <p className="text-xs text-slate-300 italic">
                "Customer service at support@thevektorstudio.com answered my shipping question on a Sunday night in less than 2 hours. Top notch store!"
              </p>
              <div>
                <p className="text-xs font-bold text-white">David L.</p>
                <p className="text-[10px] text-slate-500">Illinois, United States</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 6. Footer */}
      <Footer
        onOpenTrack={() => setIsTrackOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
        onOpenPolicy={(tab) => setPolicyState({ isOpen: true, tab })}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Product Quick View / Detail Modal */}
      <ProductModal
        product={activeProductModal}
        isOpen={Boolean(activeProductModal)}
        onClose={() => setActiveProductModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Track Your Order Modal */}
      <TrackOrderModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
      />

      {/* Contact Us Modal (With Sunday-to-Sunday 9AM-7PM EST hours) */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* FAQ Modal */}
      <FAQModal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
      />

      {/* Policy Modal */}
      <PolicyModal
        isOpen={policyState.isOpen}
        initialTab={policyState.tab}
        onClose={() => setPolicyState({ isOpen: false, tab: 'shipping' })}
      />

      {/* Auth Modal (Sign In / Create Account personalizado) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Account & Profile Modal (Foto, Nome, Endereço de Entrega, Meus Pedidos) */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
        onLogout={handleLogout}
        onOpenTrack={() => setIsTrackOpen(true)}
      />

      {/* Checkout Success Simulated Notification */}
      {checkoutNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0F1626] border border-cyan-500/50 p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl">
            <CheckCircle2 className="w-16 h-16 text-[#00E5FF] mx-auto animate-bounce" />
            <h3 className="text-2xl font-black text-white">Redirecting to Secure Checkout...</h3>
            <p className="text-xs text-slate-300">
              Connecting your cart to the official Vektor Studio payment gateway (256-bit SSL encrypted).
            </p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#00E5FF] h-full w-full animate-pulse" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
