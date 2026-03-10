import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ordersAPI } from '../lib/api';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';
import BottomNav from '../components/BottomNav';

const STATUS_STEPS = [
  { key: 'pending',    icon: 'receipt_long',    label: 'Order Placed',      desc: 'Your order has been received.' },
  { key: 'confirmed',  icon: 'check_circle',    label: 'Order Confirmed',   desc: 'Your order has been confirmed.' },
  { key: 'processing', icon: 'inventory_2',     label: 'Processing',        desc: 'Your order is being prepared.' },
  { key: 'shipped',    icon: 'local_shipping',  label: 'Shipped',           desc: 'Your order is on the way.' },
  { key: 'delivered',  icon: 'package_2',       label: 'Delivered',         desc: 'Your order has been delivered.' },
];

export default function TrackPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Auto-search if orderId is in query params
  useEffect(() => {
    if (router.isReady && router.query.orderId) {
      setInput(router.query.orderId);
      doSearch(router.query.orderId);
    }
  }, [router.isReady, router.query.orderId]);

  const doSearch = async (id) => {
    const searchId = id || input.trim();
    if (!searchId) { toast.error('Enter an Order ID'); return; }
    setLoading(true);
    setSearched(true);
    try {
      const res = await ordersAPI.getById(searchId);
      setOrder(res.data.order || res.data);
    } catch {
      setOrder(null);
      toast.error('Order not found. Check the Order ID and try again.');
    } finally { setLoading(false); }
  };

  const currentStep = order ? STATUS_STEPS.findIndex(s => s.key === order.status) : -1;
  const history = order?.orderTrackingHistory || order?.trackingHistory || [];

  return (
    <>
      <Head><title>Track Order | RUTHAN</title></Head>
      <div className="min-h-screen bg-background-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {/* Header */}

        <Navbar />

        <main className="max-w-2xl mx-auto px-6 py-14">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(65,105,225,0.08)' }}>
              <span className="material-symbols-outlined text-3xl select-none" style={{ color: '#4169e1' }}>location_on</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Track Your Order</h1>
            <p className="text-slate-500 text-sm">Enter your Order ID to get real-time status updates.</p>
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Order ID</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm select-none">search</span>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doSearch()}
                  placeholder="e.g. A1B2C3D4"
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all bg-white"
                />
              </div>
              <button
                onClick={() => doSearch()}
                disabled={loading}
                className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center gap-2 flex-shrink-0"
                style={{ backgroundColor: '#4169e1' }}
              >
                {loading ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <span className="material-symbols-outlined text-sm select-none">search</span>}
                {loading ? 'Searching...' : 'Track'}
              </button>
            </div>
          </div>

          {/* Results */}
          {searched && !loading && !order && (
            <div className="bg-white rounded-2xl border border-red-100 p-8 text-center">
              <span className="material-symbols-outlined text-5xl text-red-300 select-none mb-3 block">search_off</span>
              <p className="font-bold text-slate-700">Order not found</p>
              <p className="text-sm text-slate-400 mt-1">Double-check your Order ID and try again.</p>
            </div>
          )}

          {order && (
            <div className="space-y-6">
              {/* Order card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <h2 className="font-extrabold text-slate-900">Order #{String(order.id).slice(0,8).toUpperCase()}</h2>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-extrabold capitalize" style={{ backgroundColor: 'rgba(65,105,225,0.1)', color: '#4169e1' }}>
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                {order.trackingNumber && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tracking Number</p>
                    <p className="font-extrabold text-slate-900">{order.trackingNumber}</p>
                    {order.courier && <p className="text-xs text-slate-400 mt-0.5">{order.courier}</p>}
                  </div>
                )}
              </div>

              {/* Progress tracker */}
              {order.status !== 'cancelled' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h3 className="font-extrabold text-slate-900 mb-6">Order Progress</h3>
                  <div className="space-y-0">
                    {STATUS_STEPS.map((step, i) => {
                      const done = i <= currentStep;
                      const active = i === currentStep;
                      return (
                        <div key={step.key} className="flex gap-4">
                          {/* Timeline */}
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${done ? 'text-white shadow-sm' : 'bg-slate-100 text-slate-400'}`} style={done ? { backgroundColor: '#4169e1' } : {}}>
                              <span className={`material-symbols-outlined text-lg select-none ${done ? 'fill-1' : ''}`}>{step.icon}</span>
                            </div>
                            {i < STATUS_STEPS.length - 1 && (
                              <div className={`w-0.5 h-8 rounded-full my-1 ${done && i < currentStep ? '' : 'bg-slate-100'}`} style={done && i < currentStep ? { backgroundColor: '#4169e1' } : {}} />
                            )}
                          </div>
                          {/* Content */}
                          <div className="flex-1 pb-4">
                            <p className={`font-bold text-sm ${done ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                            <p className={`text-xs mt-0.5 ${active ? 'text-primary font-semibold' : done ? 'text-slate-500' : 'text-slate-300'}`}>{step.desc}</p>
                          </div>
                          {active && <div className="flex-shrink-0"><span className="px-2 py-1 rounded-full text-[10px] font-extrabold text-white" style={{ backgroundColor: '#4169e1' }}>Current</span></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {order.status === 'cancelled' && (
                <div className="bg-red-50 rounded-2xl border border-red-100 p-6 text-center">
                  <span className="material-symbols-outlined text-4xl text-red-400 select-none mb-2 block">cancel</span>
                  <p className="font-extrabold text-red-600">Order Cancelled</p>
                  {order.cancellationReason && <p className="text-sm text-red-400 mt-1">{order.cancellationReason}</p>}
                </div>
              )}

              {/* Timeline history */}
              {history.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h3 className="font-extrabold text-slate-900 mb-5">Activity Log</h3>
                  <div className="space-y-4">
                    {history.map((h, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#4169e1' }} />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{h.status || h.event}</p>
                          {h.description && <p className="text-xs text-slate-500 mt-0.5">{h.description}</p>}
                          {h.createdAt && <p className="text-xs text-slate-400 mt-0.5">{new Date(h.createdAt).toLocaleString('en-IN')}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Link href={`/orders/${order.id}`} className="flex-1 py-3 rounded-xl font-bold text-center text-white no-underline hover:opacity-90 transition-all" style={{ backgroundColor: '#4169e1' }}>
                  View Full Order
                </Link>
                <Link href="/products" className="flex-1 py-3 rounded-xl font-bold text-center text-slate-700 bg-white border border-slate-200 no-underline hover:border-primary transition-all">
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </main>


        <SiteFooter />
        <BottomNav />
      </div>
    </>
  );
}
