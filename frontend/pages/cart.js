import Head from 'next/head';
import Link from 'next/link';
import { useStore } from '../lib/store';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';
import BottomNav from '../components/BottomNav';

const toINR = (price) => Math.round(parseFloat(price || 0));

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount, clearCart } = useStore();
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const cartCount = getCartCount();
  const subtotalUSD = getCartTotal();
  const subtotalINR = toINR(subtotalUSD);
  const shippingINR = subtotalINR >= 999 ? 0 : 79;
  const discount = promoApplied ? Math.round(subtotalINR * 0.1) : 0;
  const totalINR = subtotalINR + shippingINR - discount;

  const applyPromo = () => {
    if (promo.toUpperCase() === 'RUTHAN10') { setPromoApplied(true); toast.success('10% discount applied!'); }
    else toast.error('Invalid promo code');
  };

  return (
    <>
      <Head><title>Cart | RUTHAN</title></Head>
      <div className="min-h-screen bg-background-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {/* Header */}

        <Navbar />

        <main className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-extrabold mb-8">Your Cart <span className="text-slate-400 font-medium text-xl">({cartCount} items)</span></h1>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <span className="material-symbols-outlined text-7xl text-slate-300 mb-6 select-none">shopping_bag</span>
              <h2 className="text-2xl font-bold text-slate-700 mb-3">Your cart is empty</h2>
              <p className="text-slate-500 mb-8">Looks like you haven't added anything yet.</p>
              <Link href="/products" className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition no-underline">Start Shopping</Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Cart Items */}
              <div className="flex-1 space-y-4">
                {cart.map((item) => {
                  const img = Array.isArray(item.images) ? item.images[0] : (item.imageUrl || item.image || '');
                  const price = toINR(item.price);
                  return (
                    <div key={item.cartItemId || item.id} className="bg-white rounded-2xl p-5 flex gap-5 shadow-sm border border-slate-100">
                      <div className="w-24 h-28 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={img || 'https://placehold.co/100x120?text=+'}  alt={item.name} className="w-full h-full object-cover" onError={e => { e.target.src='https://placehold.co/100x120?text=+'; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2">{item.name}</h3>
                          <button onClick={() => { removeFromCart(item.cartItemId || item.id); toast.success('Removed'); }} className="flex-shrink-0 text-slate-400 hover:text-red-500 transition-colors ml-2">
                            <span className="material-symbols-outlined text-lg select-none">delete</span>
                          </button>
                        </div>
                        {item.category && <p className="text-xs text-slate-400 mt-1 mb-3">{item.category}</p>}
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-2 border border-slate-200 rounded-lg overflow-hidden">
                            <button onClick={() => updateQuantity ? updateQuantity(item.cartItemId || item.id, Math.max(1, item.quantity - 1)) : null} className="px-3 py-1 text-lg font-bold hover:bg-slate-100 transition-colors">-</button>
                            <span className="px-3 font-bold text-sm">{item.quantity || 1}</span>
                            <button onClick={() => updateQuantity ? updateQuantity(item.cartItemId || item.id, (item.quantity || 1) + 1) : null} className="px-3 py-1 text-lg font-bold hover:bg-slate-100 transition-colors">+</button>
                          </div>
                          <p className="font-extrabold text-slate-900">₹{(price * (item.quantity || 1)).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button onClick={() => { clearCart(); toast.success('Cart cleared'); }} className="text-sm text-slate-400 hover:text-red-500 transition-colors font-medium flex items-center gap-1 mt-2">
                  <span className="material-symbols-outlined text-sm select-none">delete_sweep</span> Clear Cart
                </button>
              </div>

              {/* Order Summary */}
              <div className="w-full lg:w-96 shrink-0">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-28">
                  <h2 className="text-xl font-extrabold mb-6">Order Summary</h2>
                  <div className="space-y-3 text-sm mb-5">
                    <div className="flex justify-between"><span className="text-slate-600">Subtotal ({cartCount} items)</span><span className="font-bold">₹{subtotalINR.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Shipping</span><span className={`font-bold ${shippingINR === 0 ? 'text-green-600' : ''}`}>{shippingINR === 0 ? 'FREE' : `₹${shippingINR}`}</span></div>
                    {promoApplied && <div className="flex justify-between text-green-600"><span>Promo (RUTHAN10)</span><span className="font-bold">-₹{discount.toLocaleString('en-IN')}</span></div>}
                    <div className="border-t border-slate-200 pt-3 flex justify-between text-base"><span className="font-bold">Total</span><span className="font-extrabold text-xl text-primary">₹{totalINR.toLocaleString('en-IN')}</span></div>
                  </div>

                  {/* Promo */}
                  {!promoApplied && (
                    <div className="flex gap-2 mb-5">
                      <input value={promo} onChange={e => setPromo(e.target.value)} onKeyDown={e => e.key === 'Enter' && applyPromo()} placeholder="Promo code" className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-primary transition-all" />
                      <button onClick={applyPromo} className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition">Apply</button>
                    </div>
                  )}

                  <Link href="/checkout" className="block w-full py-4 text-center rounded-xl font-bold text-white no-underline transition-all hover:opacity-90 shadow-lg" style={{ backgroundColor: '#4169e1' }}>
                    <span className="flex items-center justify-center gap-2"><span className="material-symbols-outlined select-none">lock</span> Secure Checkout</span>
                  </Link>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    {['visa', 'mastercard', 'upi', 'netbanking'].map(m => (
                      <span key={m} className="px-2 py-1 bg-slate-100 text-[10px] font-extrabold text-slate-500 rounded uppercase tracking-wider">{m}</span>
                    ))}
                  </div>
                  <p className="text-center text-[11px] text-slate-400 mt-3 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-xs select-none">verified_user</span> 256-bit SSL Secured Checkout
                  </p>
                </div>
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
