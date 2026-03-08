import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ordersAPI } from '../lib/api';

export default function OrderConfirmation() {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) return;
    ordersAPI.getById(orderId).then(r => setOrder(r.data.order || r.data)).catch(() => {});
  }, [orderId]);

  return (
    <>
      <Head><title>Order Confirmed | RUTHAN</title></Head>
      <div className="min-h-screen bg-background-light flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <header className="bg-white border-b border-slate-200 py-4 px-6 flex justify-center">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter text-primary no-underline">RUTHAN</Link>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
              <span className="material-symbols-outlined text-5xl text-emerald-600 fill-1 select-none">check_circle</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Order Confirmed!</h1>
            <p className="text-slate-500 mb-6">
              Thank you for your purchase. Your order has been placed successfully and will be processed shortly.
            </p>
            {orderId && (
              <div className="bg-slate-50 rounded-xl px-5 py-3 mb-6 inline-block">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Order ID</p>
                <p className="text-lg font-extrabold text-slate-900">#{String(orderId).slice(0,8).toUpperCase()}</p>
              </div>
            )}
            {order?.createdAt && (
              <p className="text-sm text-slate-500 mb-6">
                Estimated delivery: <span className="font-bold text-slate-900">{new Date(new Date(order.createdAt).getTime() + 7*24*60*60*1000).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </p>
            )}
            <div className="space-y-3 mt-6">
              {orderId && (
                <Link href={`/orders/${orderId}`} className="block w-full py-4 rounded-xl font-bold text-white no-underline hover:opacity-90 transition-all" style={{ backgroundColor: '#4169e1' }}>
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined select-none">local_shipping</span> Track Order
                  </span>
                </Link>
              )}
              <Link href="/products" className="block w-full py-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 no-underline transition-all">
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 flex items-center justify-around px-4 py-3 z-50">
          <Link href="/" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">home</span><span className="text-[10px] font-bold">Home</span></Link>
          <Link href="/products" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">search</span><span className="text-[10px] font-bold">Shop</span></Link>
          <Link href="/orders" className="flex flex-col items-center gap-0.5 text-primary no-underline"><span className="material-symbols-outlined select-none fill-1">package</span><span className="text-[10px] font-bold">Orders</span></Link>
          <Link href="/account" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">person</span><span className="text-[10px] font-bold">Profile</span></Link>
        </nav>
      </div>
    </>
  );
}
