import { useState } from 'react';
import Link from 'next/link';

export default function SiteFooter() {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-white border-t pt-16 pb-4 px-6" style={{ borderColor: 'rgba(65,105,225,0.12)' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand */}
        <div>
          <Link href="/" className="text-2xl font-extrabold tracking-tighter no-underline" style={{ color: '#4169e1' }}>RUTHAN</Link>
          <p className="text-slate-500 mt-3 mb-5 leading-relaxed text-sm">India's premium fashion destination. Curated quality, trusted sellers, fast delivery.</p>
          <div className="flex gap-3">
            {[
              { icon: 'public', href: '#' },
              { icon: 'share', href: '#' },
              { icon: 'mail', href: '/contact' },
            ].map(({ icon, href }) => (
              <a key={icon} href={href}
                className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all text-slate-600 no-underline"
                style={{ borderColor: 'rgba(65,105,225,0.2)' }}>
                <span className="material-symbols-outlined text-sm select-none">{icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Collections */}
        <div>
          <h4 className="font-extrabold mb-5 uppercase tracking-wider text-xs text-slate-900">Shop</h4>
          <ul className="space-y-3 text-slate-500 text-sm">
            <li><Link href="/products?category=Lady" className="hover:text-primary transition-colors no-underline">Women's Fashion</Link></li>
            <li><Link href="/products?category=Men" className="hover:text-primary transition-colors no-underline">Men</Link></li>
            <li><Link href="/products?category=Jewelry" className="hover:text-primary transition-colors no-underline">Fine Jewelry</Link></li>
            <li><Link href="/products?category=Shoes" className="hover:text-primary transition-colors no-underline">Footwear</Link></li>
            <li><Link href="/products?category=Accessories" className="hover:text-primary transition-colors no-underline">Accessories</Link></li>
            <li><Link href="/products" className="hover:text-primary transition-colors no-underline">All Products</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="font-extrabold mb-5 uppercase tracking-wider text-xs text-slate-900">Help</h4>
          <ul className="space-y-3 text-slate-500 text-sm">
            <li><Link href="/track" className="hover:text-primary transition-colors no-underline">Track Your Order</Link></li>
            <li><Link href="/returns" className="hover:text-primary transition-colors no-underline">Returns & Refunds</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-primary transition-colors no-underline">Shipping Policy</Link></li>
            <li><Link href="/faq" className="hover:text-primary transition-colors no-underline">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors no-underline">Contact Us</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors no-underline">About RUTHAN</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-extrabold mb-5 uppercase tracking-wider text-xs text-slate-900">Newsletter</h4>
          <p className="text-slate-500 text-sm mb-4 leading-relaxed">Subscribe for first access to new arrivals and exclusive deals.</p>
          <form className="space-y-3" onSubmit={e => { e.preventDefault(); setEmail(''); }}>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all"
              style={{ outlineColor: '#4169e1' }}
              placeholder="your@email.com"
              type="email"
            />
            <button
              type="submit"
              className="w-full font-bold py-3 rounded-xl text-sm hover:opacity-90 transition-all text-white"
              style={{ backgroundColor: '#4169e1' }}
            >
              Join RUTHAN Insider
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t" style={{ borderColor: 'rgba(65,105,225,0.1)' }}>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 text-center">
          <Link href="/privacy" className="hover:text-primary transition-colors no-underline">Privacy Policy</Link>
          <span className="hidden sm:inline">·</span>
          <Link href="/terms" className="hover:text-primary transition-colors no-underline">Terms of Service</Link>
          <span className="hidden sm:inline">·</span>
          <Link href="/shipping-policy" className="hover:text-primary transition-colors no-underline">Shipping Policy</Link>
          <span className="hidden sm:inline">·</span>
          <Link href="/returns" className="hover:text-primary transition-colors no-underline">Returns</Link>
          <span className="hidden sm:inline">·</span>
          <Link href="/faq" className="hover:text-primary transition-colors no-underline">FAQ</Link>
        </div>
        <p className="text-center text-xs text-slate-400 mt-3">© 2026 RUTHAN. All rights reserved. Made with ♥ in India.</p>
      </div>

      {/* Spacer for mobile bottom nav */}
      <div className="h-16 md:hidden" />
    </footer>
  );
}
