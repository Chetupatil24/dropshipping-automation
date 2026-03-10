import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStore } from '../../lib/store';
import { ordersAPI } from '../../lib/api';

const toINR = (usd) => Math.round(parseFloat(usd || 0) * 83 * 1.45);

const STATUS_STEPS = ['pending','confirmed','processing','shipped','delivered'];
const STATUS_CONFIG = {
  pending:    { color: 'text-amber-600 bg-amber-50',   icon: 'schedule',       label: 'Pending' },
  confirmed:  { color: 'text-blue-600 bg-blue-50',     icon: 'check_circle',   label: 'Confirmed' },
  processing: { color: 'text-purple-600 bg-purple-50', icon: 'sync',           label: 'Processing' },
  shipped:    { color: 'text-cyan-600 bg-cyan-50',     icon: 'local_shipping', label: 'Shipped' },
  delivered:  { color: 'text-emerald-600 bg-emerald-50', icon: 'package_2',    label: 'Delivered' },
  cancelled:  { color: 'text-red-600 bg-red-50',       icon: 'cancel',         label: 'Cancelled' },
};

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { token, getCartCount } = useStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const cartCount = getCartCount();

  useEffect(() => {
    if (!id) return;
    if (!token) { router.push('/login?redirect=/orders/' + id); return; }
    (async () => {
      setLoading(true);
      try {
        const res = await ordersAPI.getById(id);
        setOrder(res.data.order || res.data);
      } catch { router.push('/orders'); }
      finally { setLoading(false); }
    })();
  }, [id, token]);

  if (loading) return (
    <div className="min-h-screen bg-background-light flex items-center justify-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
    </div>
  );
  if (!order) return null;

  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const items = order.orderItems || order.items || [];
  const shipping = order.shippingAddress || {};
  const currentStep = STATUS_STEPS.indexOf(order.status);
  const total = toINR(order.totalAmount || order.total || 0);

  return (
    <>
      <Head><title>Order #{String(order.id).slice(0,8).toUpperCase()} | RUTHAN</title></Head>
      <div className="min-h-screen bg-background-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/orders" className="flex items-center gap-2 text-slate-600 hover:text-primary text-sm font-semibold no-underline transition-colors">
              <span className="material-symbols-outlined text-sm select-none">arrow_back</span> My Orders
            </Link>
            <Link href="/" className="text-2xl font-extrabold tracking-tighter no-underline" style={{ color: '#4169e1' }}>RUTHAN</Link>
            <Link href="/cart" className="relative no-underline">
              <span className="material-symbols-outlined text-slate-700 hover:text-primary transition-colors select-none">shopping_bag</span>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-10">
          {/* Order header card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Order</p>
                <h1 className="text-2xl font-extrabold text-slate-900">#{String(order.id).slice(0,8).toUpperCase()}</h1>
                <p className="text-sm text-slate-500 mt-1">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className={`px-4 py-2 rounded-xl text-sm font-extrabold flex items-center gap-2 ${cfg.color}`}>
                  <span className="material-symbols-outlined text-base fill-1 select-none">{cfg.icon}</span>
                  {cfg.label}
                </span>
                <Link href={`/track?orderId=${order.id}`} className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 no-underline hover:border-primary transition-all flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm select-none">location_on</span> Track Order
                </Link>
              </div>
            </div>

            {/* Progress bar (not shown for cancelled) */}
            {order.status !== 'cancelled' && currentStep >= 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between relative">
                  <div className="absolute left-0 right-0 top-4 h-1 bg-slate-100 rounded-full z-0" />
                  <div className="absolute left-0 top-4 h-1 rounded-full z-0 transition-all" style={{ backgroundColor: '#4169e1', width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }} />
                  {STATUS_STEPS.map((step, i) => {
                    const done = i <= currentStep;
                    return (
                      <div key={step} className="flex flex-col items-center z-10 gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${done ? 'text-white border-primary' : 'bg-white border-slate-200 text-slate-400'}`} style={done ? { backgroundColor: '#4169e1', borderColor: '#4169e1' } : {}}>
                          {done ? <span className="material-symbols-outlined text-sm fill-1 select-none">check</span> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                        </div>
                        <span className={`text-[10px] font-bold text-center capitalize ${done ? 'text-slate-900' : 'text-slate-400'}`}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-extrabold text-slate-900 mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary select-none">inventory_2</span>
                  Items ({items.length})
                </h2>
                {items.length > 0 ? (
                  <div className="space-y-4">
                    {items.map((item, i) => {
                      const img = item.product?.images?.[0] || item.product?.imageUrl || item.imageUrl || '';
                      const itemINR = toINR(item.price || item.product?.price || 0);
                      return (
                        <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
                          <div className="w-14 h-16 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={img || 'https://placehold.co/56x64?text=+'} alt={item.product?.name || 'Product'} className="w-full h-full object-cover" onError={e => { e.target.src='https://placehold.co/56x64?text=+'; }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-slate-900 line-clamp-1">{item.product?.name || 'Product'}</p>
                            <p className="text-xs text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-extrabold text-slate-900 text-sm flex-shrink-0">
                            ₹{(itemINR * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No item details available.</p>
                )}
              </div>
            </div>

            {/* Summary sidebar */}
            <div className="space-y-4">
              {/* Payment summary */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary select-none">receipt</span> Payment
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-bold">₹{total.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span className="font-bold text-emerald-600">Free</span></div>
                  <div className="flex justify-between border-t border-slate-100 pt-2 font-extrabold"><span>Total</span><span className="text-primary">₹{total.toLocaleString('en-IN')}</span></div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {order.paymentStatus === 'paid' ? '✓ Paid' : 'Payment Pending'}
                  </span>
                </div>
              </div>

              {/* Shipping address */}
              {(shipping.name || shipping.firstName || shipping.address) && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary select-none">location_on</span> Delivery Address
                  </h2>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p className="font-bold text-slate-900">{shipping.name || `${shipping.firstName || ''} ${shipping.lastName || ''}`.trim()}</p>
                    {shipping.phone && <p>{shipping.phone}</p>}
                    {shipping.address && <p>{shipping.address}</p>}
                    {(shipping.city || shipping.state) && <p>{[shipping.city, shipping.state, shipping.pincode].filter(Boolean).join(', ')}</p>}
                    {shipping.country && <p>{shipping.country}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
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
