import Head from 'next/head';
import Link from 'next/link';

const STEPS = [
  { icon: 'package_2', title: 'Initiate Return', desc: 'Go to My Orders, select the item, and click "Request Return" within 7 days of delivery.' },
  { icon: 'inventory_2', title: 'Pack Your Item', desc: 'Pack the item securely in its original packaging with all tags and accessories included.' },
  { icon: 'local_shipping', title: 'Pickup Arranged', desc: 'Our courier partner will pick up the item from your address within 2-3 business days.' },
  { icon: 'currency_rupee', title: 'Refund Processed', desc: 'Once we inspect the item, your refund is credited within 5-7 business days.' },
];

const ELIGIBLE = [
  { icon: 'check_circle', label: 'Damaged or defective items', ok: true },
  { icon: 'check_circle', label: 'Wrong item delivered', ok: true },
  { icon: 'check_circle', label: 'Item not as described', ok: true },
  { icon: 'check_circle', label: 'Unused with original tags (size issues)', ok: true },
  { icon: 'cancel', label: 'Used or washed items', ok: false },
  { icon: 'cancel', label: 'Innerwear & socks (hygiene)', ok: false },
  { icon: 'cancel', label: 'Items marked "Final Sale"', ok: false },
  { icon: 'cancel', label: 'Returns after 7 days of delivery', ok: false },
];

export default function Returns() {
  return (
    <>
      <Head><title>Returns & Refunds | RUTHAN</title></Head>
      <div className="min-h-screen bg-background-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-extrabold tracking-tighter no-underline" style={{ color: '#4169e1' }}>RUTHAN</Link>
            <Link href="/orders" className="text-sm font-semibold text-slate-600 hover:text-primary no-underline transition-colors">My Orders</Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-14">
          {/* Hero */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(65,105,225,0.08)' }}>
              <span className="material-symbols-outlined text-xl select-none" style={{ color: '#4169e1' }}>assignment_return</span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Returns & Refunds</h1>
              <p className="text-sm text-slate-400 mt-0.5">7-day hassle-free returns. No questions asked.</p>
            </div>
          </div>

          {/* How it works */}
          <h2 className="text-lg font-extrabold text-slate-900 mb-5">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {STEPS.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center relative">
                <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold text-white" style={{ backgroundColor: '#4169e1' }}>{i + 1}</div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(65,105,225,0.08)' }}>
                  <span className="material-symbols-outlined text-xl select-none" style={{ color: '#4169e1' }}>{s.icon}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm mb-2">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Eligibility */}
          <h2 className="text-lg font-extrabold text-slate-900 mb-5">Return Eligibility</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
            {ELIGIBLE.map((e, i) => (
              <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-semibold ${e.ok ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-700'}`}>
                <span className="material-symbols-outlined text-lg select-none fill-1" style={{ color: e.ok ? '#22c55e' : '#ef4444' }}>{e.icon}</span>
                {e.label}
              </div>
            ))}
          </div>

          {/* Policy details */}
          <div className="space-y-4 mb-12">
            {[
              ['Return Window', '7 days from the date of delivery. Returns requested after this window will not be accepted.'],
              ['Refund Timeline', 'Refunds are processed within 5-7 business days after we receive and verify the returned item. The amount is credited to your original payment method.'],
              ['Exchange Policy', 'We currently support returns with full refunds. For a different size/color, please place a new order after receiving your refund.'],
              ['Damaged Items', 'If you receive a damaged or wrong item, please contact us within 48 hours with photos. We will arrange a free pickup and issue a full refund or replacement.'],
            ].map(([title, body]) => (
              <div key={title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-4 rounded-full inline-block" style={{ backgroundColor: '#4169e1' }}></span>
                  {title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div>
              <p className="font-extrabold text-slate-900">Ready to return an item?</p>
              <p className="text-sm text-slate-500 mt-0.5">Visit your Orders page to initiate a return.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link href="/orders" className="px-5 py-3 rounded-xl font-bold text-white no-underline hover:opacity-90 transition text-sm flex items-center gap-2" style={{ backgroundColor: '#4169e1' }}>
                <span className="material-symbols-outlined text-sm select-none">package_2</span>
                My Orders
              </Link>
              <Link href="/contact" className="px-5 py-3 rounded-xl font-bold no-underline hover:bg-slate-50 transition text-sm flex items-center gap-2 border border-slate-200 text-slate-700">
                <span className="material-symbols-outlined text-sm select-none">support_agent</span>
                Help
              </Link>
            </div>
          </div>
        </main>

        <footer className="border-t border-slate-100 py-8 px-6 text-center text-xs text-slate-400 mt-10">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <Link href="/privacy" className="hover:text-primary no-underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary no-underline">Terms of Service</Link>
            <Link href="/shipping-policy" className="hover:text-primary no-underline">Shipping Policy</Link>
            <Link href="/faq" className="hover:text-primary no-underline">FAQ</Link>
            <Link href="/about" className="hover:text-primary no-underline">About Us</Link>
            <Link href="/contact" className="hover:text-primary no-underline">Contact</Link>
          </div>
          <p className="mt-4">© 2026 RUTHAN. All rights reserved.</p>
        </footer>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 flex items-center justify-around px-4 py-3 z-50">
          <Link href="/" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">home</span><span className="text-[10px] font-bold">Home</span></Link>
          <Link href="/products" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">search</span><span className="text-[10px] font-bold">Shop</span></Link>
          <Link href="/wishlist" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">favorite</span><span className="text-[10px] font-bold">Wishlist</span></Link>
          <Link href="/orders" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">package_2</span><span className="text-[10px] font-bold">Orders</span></Link>
          <Link href="/account" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">person</span><span className="text-[10px] font-bold">Profile</span></Link>
        </nav>
      </div>
    </>
  );
}
