import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStore } from '../lib/store';
import { ordersAPI } from '../lib/api';

const toINR = (usd) => Math.round(parseFloat(usd || 0) * 83 * 1.45);

const STATUS_CONFIG = {
  pending:    { color: 'bg-amber-100 text-amber-700',  icon: 'schedule',       label: 'Pending' },
  confirmed:  { color: 'bg-blue-100 text-blue-700',    icon: 'check_circle',   label: 'Confirmed' },
  processing: { color: 'bg-purple-100 text-purple-700',icon: 'sync',           label: 'Processing' },
  shipped:    { color: 'bg-cyan-100 text-cyan-700',    icon: 'local_shipping', label: 'Shipped' },
  delivered:  { color: 'bg-emerald-100 text-emerald-700', icon: 'package_2',   label: 'Delivered' },
  cancelled:  { color: 'bg-red-100 text-red-600',      icon: 'cancel',         label: 'Cancelled' },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, token, getCartCount } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const cartCount = getCartCount();

  useEffect(() => {
    if (!token) { router.push('/login?redirect=/orders'); return; }
    (async () => {
      setLoading(true);
      try {
        const res = await ordersAPI.getAll();
        setOrders(res.data.orders || res.data || []);
      } catch { setOrders([]); }
      finally { setLoading(false); }
    })();
  }, [token]);

  return (
    <>
      <Head><title>My Orders | RUTHAN</title></Head>
      <div className="min-h-screen bg-background-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/account" className="flex items-center gap-2 text-slate-600 hover:text-primary text-sm font-semibold no-underline transition-colors">
              <span className="material-symbols-outlined text-sm select-none">arrow_back</span> Account
            </Link>
            <Link href="/" className="text-2xl font-extrabold tracking-tighter no-underline" style={{ color: '#4169e1' }}>RUTHAN</Link>
            <div className="flex items-center gap-4">
              <Link href="/cart" className="relative no-underline">
                <span className="material-symbols-outlined text-slate-700 hover:text-primary transition-colors select-none">shopping_bag</span>
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl select-none" style={{ color: '#4169e1' }}>package_2</span>
            My Orders
            {!loading && <span className="text-slate-400 text-xl font-medium">({orders.length})</span>}
          </h1>

          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-28 animate-pulse border border-slate-100" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <span className="material-symbols-outlined text-7xl text-slate-300 mb-5 select-none">package_2</span>
              <h2 className="text-2xl font-bold text-slate-700 mb-3">No orders yet</h2>
              <p className="text-slate-500 mb-8">Your order history will appear here once you start shopping.</p>
              <Link href="/products" className="px-8 py-3 rounded-xl font-bold text-white no-underline hover:opacity-90 transition-all shadow" style={{ backgroundColor: '#4169e1' }}>Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                const total = toINR(order.totalAmount || order.total || 0);
                const itemCount = order.orderItems?.length || order.items?.length || 0;
                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-5 hover:border-blue-200 transition-all">
                    {/* Order icon */}
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(65,105,225,0.08)' }}>
                      <span className="material-symbols-outlined text-2xl select-none" style={{ color: '#4169e1' }}>package_2</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <p className="font-extrabold text-slate-900 text-sm">Order #{String(order.id).slice(0, 8).toUpperCase()}</p>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 ${cfg.color}`}>
                          <span className="material-symbols-outlined text-xs fill-1 select-none">{cfg.icon}</span>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {itemCount > 0 && ` · ${itemCount} item${itemCount > 1 ? 's' : ''}`}
                      </p>
                    </div>

                    {/* Total + actions */}
                    <div className="flex flex-col sm:items-end gap-3 flex-shrink-0">
                      <p className="font-extrabold text-slate-900 text-lg">₹{total.toLocaleString('en-IN')}</p>
                      <div className="flex gap-2">
                        <Link href={`/orders/${order.id}`} className="px-4 py-2 rounded-xl text-xs font-bold no-underline transition-all text-white hover:opacity-90" style={{ backgroundColor: '#4169e1' }}>
                          View Details
                        </Link>
                        <Link href={`/track?orderId=${order.id}`} className="px-4 py-2 rounded-xl text-xs font-bold no-underline border border-slate-200 text-slate-600 hover:border-primary transition-all">
                          Track
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 flex items-center justify-around px-4 py-3 z-50">
          <Link href="/" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">home</span><span className="text-[10px] font-bold">Home</span></Link>
          <Link href="/products" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">search</span><span className="text-[10px] font-bold">Shop</span></Link>
          <Link href="/wishlist" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">favorite</span><span className="text-[10px] font-bold">Wishlist</span></Link>
          <Link href="/orders" className="flex flex-col items-center gap-0.5 text-primary no-underline"><span className="material-symbols-outlined select-none fill-1">package_2</span><span className="text-[10px] font-bold">Orders</span></Link>
          <Link href="/account" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">person</span><span className="text-[10px] font-bold">Profile</span></Link>
        </nav>
      </div>
    </>
  );
}
