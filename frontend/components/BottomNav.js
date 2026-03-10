import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStore } from '../lib/store';

export default function BottomNav() {
  const router = useRouter();
  const { getCartCount } = useStore();
  const cartCount = getCartCount();

  const items = [
    { href: '/', icon: 'home', label: 'Home' },
    { href: '/products', icon: 'grid_view', label: 'Shop' },
    { href: '/wishlist', icon: 'favorite', label: 'Wishlist' },
    { href: '/orders', icon: 'package_2', label: 'Orders' },
    { href: '/account', icon: 'person', label: 'Profile' },
  ];

  const isActive = (href) => {
    if (href === '/') return router.pathname === '/';
    return router.pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 flex items-center justify-around px-2 py-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors no-underline"
          style={{ color: isActive(item.href) ? '#4169e1' : '#94a3b8' }}
        >
          <span className={`material-symbols-outlined select-none text-[22px] ${isActive(item.href) ? 'fill-1' : ''}`}>
            {item.href === '/cart' ? 'shopping_bag' : item.icon}
          </span>
          <span className="text-[10px] font-bold">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
