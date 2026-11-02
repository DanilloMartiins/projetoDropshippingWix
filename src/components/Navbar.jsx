import React, { useState } from 'react';
import { ShoppingBag, Search, Heart, Menu, X, Flame } from 'lucide-react';
import { CATEGORIES } from '../data/products';

export default function Navbar({ 
  selectedCategory, 
  onSelectCategory, 
  cartCount, 
  onOpenCart, 
  searchQuery, 
  onSearchChange,
  wishlistCount
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleCategoryClick = (catId) => {
    onSelectCategory(catId);
    setMobileMenuOpen(false);
    // Smooth scroll to catalog section if on home
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080C14]/90 backdrop-blur-md border-b border-brand-border">
      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Mobile Hamburger */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-400 hover:text-white"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); handleCategoryClick('all'); }}
          className="flex items-center gap-3 group"
        >
          <img 
            src="/logo.png" 
            alt="Vektor Studio Logo" 
            className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </a>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <input
            type="text"
            placeholder="Search smart gadgets, kitchen tools, cables..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#0F1626] border border-slate-800 rounded-full py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] transition-all"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right Actions: Search (mobile), Wishlist, Cart */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile search toggle */}
          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Icon */}
          <div className="relative hidden sm:flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer p-2">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-purple-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>

          {/* Cart Drawer Trigger Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 bg-gradient-to-r from-[#00E5FF] to-[#2563EB] hover:opacity-95 text-black font-semibold text-xs px-4 py-2.5 rounded-full shadow-lg shadow-cyan-500/20 transition-all transform active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="font-bold">Cart</span>
            <span className="bg-black/90 text-[#00E5FF] text-[11px] font-extrabold px-1.5 py-0.5 rounded-full min-w-5 text-center">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile search expanded */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#0F1626] border border-slate-800 rounded-full py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
              autoFocus
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>
        </div>
      )}

      {/* Secondary Categories Bar (Desktop) */}
      <nav className="hidden lg:block border-t border-brand-border/60 bg-[#0A0F1D]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-center gap-1 xl:gap-3 py-2 text-xs font-semibold">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              const isSale = cat.id === 'sale';
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      active
                        ? 'bg-gradient-to-r from-[#00E5FF]/20 to-[#2563EB]/20 text-[#00E5FF] border border-[#00E5FF]/40 shadow-sm shadow-cyan-500/10'
                        : isSale
                        ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {isSale && <Flame className="w-3.5 h-3.5 text-red-400" />}
                    {cat.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-border bg-[#0B132B] px-4 py-4 space-y-2">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3">Categories</p>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#00E5FF]/10 text-[#00E5FF] font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
