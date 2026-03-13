import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStore } from '../lib/store';
import { paymentsAPI, ordersAPI } from '../lib/api';
import { toast } from 'react-hot-toast';

const toINR = (price) => Math.round(parseFloat(price || 0));

const STEPS = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, getCartCount, clearCart, user } = useStore();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: user?.email || '', phone: '',
    address: '', city: '', state: '', pincode: '', country: 'India',
  });

  const cartCount = getCartCount();
  const subtotalINR = toINR(getCartTotal());
  const shippingINR = subtotalINR >= 999 ? 0 : 79;
  const totalINR = subtotalINR + shippingINR;

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validateShipping = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const k of required) {
      if (!form[k].trim()) { toast.error(`${k} is required`); return false; }
    }
    return true;
  };

  const handleRazorpay = async () => {
    if (!validateShipping()) return;
    setLoading(true);
    try {
      // Create order in backend
      const orderPayload = {
        items: cart.map(i => ({ productId: i.id, quantity: i.quantity || 1, price: i.price })),
        shippingAddress: { ...form, name: `${form.firstName} ${form.lastName}` },
        totalAmount: (getCartTotal()).toFixed(2),
      };
      const orderRes = await ordersAPI.create(orderPayload);
      const order = orderRes.data.order || orderRes.data;
      // Create Razorpay payment
      const payRes = await paymentsAPI.create(order.id);
      const payData = payRes.data;
      const options = {
        key: payData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: payData.amount,
        currency: payData.currency || 'INR',
        name: 'RUTHAN',
        description: `Order #${order.id}`,
        order_id: payData.razorpayOrderId || payData.id,
        handler: async (response) => {
          try {
            await paymentsAPI.verify({ ...response, orderId: order.id });
            clearCart();
            toast.success('Payment successful!');
            router.push(`/order-confirmation?orderId=${order.id}`);
          } catch { toast.error('Payment verification failed'); }
        },
        prefill: { name: `${form.firstName} ${form.lastName}`, email: form.email, contact: form.phone },
        theme: { color: '#4169e1' },
        modal: { ondismiss: () => setLoading(false) },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Payment failed. Try again.');
    } finally { setLoading(false); }
  };

  if (cart.length === 0) return (
    <div className="min-h-screen bg-background-light flex flex-col items-center justify-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 select-none">shopping_bag</span>
      <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
      <Link href="/products" className="px-8 py-3 bg-primary text-white rounded-xl font-bold no-underline hover:opacity-90">Shop Now</Link>
    </div>
  );

  return (
    <>
      <Head><title>Checkout | RUTHAN</title></Head>
      <div className="min-h-screen bg-background-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/cart" className="flex items-center gap-2 text-slate-600 hover:text-primary text-sm font-semibold no-underline">
              <span className="material-symbols-outlined text-sm select-none">arrow_back</span> Back to Cart
            </Link>
            <Link href="/" className="text-2xl font-extrabold tracking-tighter text-primary no-underline">RUTHAN</Link>
            <div className="flex items-center gap-1 text-xs text-slate-400 font-medium"><span className="material-symbols-outlined text-sm select-none">lock</span> Secure Checkout</div>
          </div>
        </header>

        {/* Step Indicator */}
        <div className="bg-white border-b border-slate-100 py-4">
          <div className="max-w-3xl mx-auto px-6 flex items-center justify-center gap-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${i <= step ? 'text-white shadow-sm' : 'bg-slate-100 text-slate-400'}`} style={i <= step ? { backgroundColor: '#4169e1' } : {}}>
                  {i < step ? <span className="material-symbols-outlined text-sm select-none">check</span> : i + 1}
                </div>
                <span className={`text-sm font-semibold ${i === step ? 'text-slate-900' : 'text-slate-400'}`}>{s}</span>
                {i < STEPS.length - 1 && <div className={`h-0.5 w-10 ml-2 rounded-full ${i < step ? '' : 'bg-slate-200'}`} style={i < step ? { backgroundColor: '#4169e1' } : {}} />}
              </div>
            ))}
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Form */}
            <div className="flex-1">
              {(step === 0 || step === 1) && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                  <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary select-none">local_shipping</span> Shipping Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[['firstName','First Name'],['lastName','Last Name'],['email','Email Address'],['phone','Phone Number'],['address','Street Address'],['city','City'],['state','State'],['pincode','PIN Code']].map(([name, label]) => (
                      <div key={name} className={name === 'address' ? 'sm:col-span-2' : ''}>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{label}</label>
                        <input name={name} value={form[name]} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all bg-white" placeholder={label} />
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { if (validateShipping()) setStep(1); }} className="mt-8 w-full py-4 rounded-xl font-bold text-white text-lg transition hover:opacity-90 shadow" style={{ backgroundColor: '#4169e1' }}>
                    Continue to Payment
                  </button>
                </div>
              )}

              {step === 1 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mt-6">
                  <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary select-none">payment</span> Payment
                  </h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    Click the button below to proceed with secure payment via Razorpay. You can pay with UPI, Net Banking, Cards, or Wallets.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['UPI', 'Visa', 'Mastercard', 'Net Banking', 'Wallets'].map(m => (
                      <span key={m} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wide">{m}</span>
                    ))}
                  </div>
                  <button onClick={handleRazorpay} disabled={loading} className="w-full py-4 rounded-xl font-bold text-white text-lg transition hover:opacity-90 shadow disabled:opacity-60 flex items-center justify-center gap-2" style={{ backgroundColor: '#4169e1' }}>
                    {loading ? <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"/> : <span className="material-symbols-outlined select-none">lock</span>}
                    {loading ? 'Processing...' : `Pay ₹${totalINR.toLocaleString('en-IN')}`}
                  </button>
                  <p className="text-center text-[11px] text-slate-400 mt-3 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-xs select-none">verified_user</span> Powered by Razorpay · 256-bit SSL
                  </p>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-28">
                <h2 className="text-lg font-extrabold mb-5">Order Summary</h2>
                <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                  {cart.map(item => {
                    const img = Array.isArray(item.images) ? item.images[0] : (item.imageUrl || item.image || '');
                    return (
                      <div key={item.cartItemId || item.id} className="flex items-center gap-3">
                        <div className="w-12 h-14 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={img || 'https://placehold.co/48x56?text=+'} alt={item.name} className="w-full h-full object-cover" onError={e => { e.target.src='https://placehold.co/48x56?text=+'; }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</p>
                          <p className="text-xs text-slate-400">Qty: {item.quantity || 1}</p>
                        </div>
                        <p className="text-xs font-extrabold text-slate-900">₹{toINR(item.price * (item.quantity || 1)).toLocaleString('en-IN')}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-bold">₹{subtotalINR.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span className={`font-bold ${shippingINR === 0 ? 'text-green-600' : ''}`}>{shippingINR === 0 ? 'FREE' : `₹${shippingINR}`}</span></div>
                  <div className="flex justify-between border-t border-slate-100 pt-2 font-extrabold"><span>Total</span><span className="text-primary text-lg">₹{totalINR.toLocaleString('en-IN')}</span></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
