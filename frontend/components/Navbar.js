import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStore } from '../lib/store';

export default function Navbar() {
  const router = useRouter();
  const { getCartCount, isWishlisted, wishlist, user } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  const cartCount = getCartCount();
  const wishlistCount = wishlist?.length || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
    setMenuOpen(false);
  };

  const navLinks = [
    { href: '/products?category=Lady', label: 'Women' },
    { href: '/products?category=Men', label: 'Men' },
    { href: '/products?category=Accessories', label: 'Accessories' },
    { href: '/products', label: 'All Products' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Left: hamburger + desktop nav */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="material-symbols-outlined text-slate-700 md:hidden cursor-pointer select-none"
            aria-label="Menu"
          >
            {menuOpen ? 'close' : 'menu'}
          </button>
          <nav className="hidden md:flex gap-6 text-sm font-semibold">
            {navLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`transition-colors no-underline ${router.asPath.startsWith(l.href.split('?')[0]) ? 'text-primary font-extrabold' : 'text-slate-700 hover:text-primary'}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-tighter no-underline absolute left-1/2 -translate-x-1/2" style={{ color: '#4169e1' }}>
          RUTHAN
        </Link>

        {/* Right: search + icons */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-slate-100 rounded-full px-4 py-2 w-48">
            <span className="material-symbols-outlined text-slate-400 text-[18px] mr-1 select-none">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-slate-400"
              placeholder="Search..."
            />
          </form>
          <Link href="/search" className="no-underline lg:hidden">
            <span className="material-symbols-outlined text-slate-700 hover:text-primary transition-colors select-none">search</span>
          </Link>
          <Link href="/wishlist" className="no-underline relative hidden sm:block">
            <span className="material-symbols-outlined text-slate-700 hover:text-primary transition-colors select-none">favorite</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">{wishlistCount}</span>
            )}
          </Link>
          <Link href={user ? '/account' : '/login'} className="no-underline">
            <span className="material-symbols-outlined text-slate-700 hover:text-primary transition-colors select-none">person</span>
          </Link>
          <Link href="/cart" className="relative no-underline">
            <span className="material-symbols-outlined text-slate-700 hover:text-primary transition-colors select-none">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-3 shadow-lg">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-primary no-underline transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <Link href="/about" onClick={() => setMenuOpen(false)} className="block text-sm text-slate-500 hover:text-primary no-underline">About</Link>
            <Link href="/faq" onClick={() => setMenuOpen(false)} className="block text-sm text-slate-500 hover:text-primary no-underline">FAQ</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="block text-sm text-slate-500 hover:text-primary no-underline">Contact</Link>
          </div>
          <form onSubmit={handleSearch} className="flex items-center bg-slate-100 rounded-full px-4 py-2 mt-2">
            <span className="material-symbols-outlined text-slate-400 text-[18px] mr-1 select-none">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-slate-400"
              placeholder="Search products..."
            />
          </form>
        </div>
      )}
    </header>
  );
}
