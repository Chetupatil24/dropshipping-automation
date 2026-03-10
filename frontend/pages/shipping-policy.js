import Head from 'next/head';
import Link from 'next/link';

export default function PolicyPage() {
  return (
    <>
      <Head><title>Shipping Policy | RUTHAN</title></Head>
      <div className="min-h-screen bg-background-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-extrabold tracking-tighter no-underline" style={{ color: '#4169e1' }}>RUTHAN</Link>
            <Link href="/contact" className="text-sm font-semibold text-slate-600 hover:text-primary no-underline transition-colors">Contact</Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-14">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(65,105,225,0.08)' }}>
              <span className="material-symbols-outlined text-xl select-none" style={{ color: '#4169e1' }}>local_shipping</span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Shipping Policy</h1>
              <p className="text-xs text-slate-400 mt-0.5">Last updated: March 1, 2026</p>
            </div>
          </div>

          <div className="mt-10 space-y-8">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Order Processing Time
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">Most orders are processed and dispatched within 24-48 hours of payment confirmation (excluding Sundays and public holidays). You will receive an email with tracking details once your order is shipped.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Shipping Charges
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">Orders above ₹999 qualify for FREE shipping across India. For orders below ₹999, a flat shipping fee of ₹79 is applied. Shipping fees are displayed at checkout before payment.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Estimated Delivery Times
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">Metro cities (Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, Kolkata): 2-4 business days. Tier 2 & Tier 3 cities: 4-6 business days. Remote areas: 6-10 business days. These are estimates; actual delivery may vary.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Tracking Your Order
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">Once your order is shipped, you will receive a tracking number via email and SMS. You can track your order on our Track Order page or directly on the courier partner website.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Courier Partners
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">We ship through trusted partners including Shiprocket, Delhivery, Blue Dart, and India Post. The courier is selected based on your location and order weight for optimal delivery speed.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Shipping Restrictions
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">We currently ship only within India. We do not ship to PO Boxes or APO/FPO addresses. Certain products may have shipping restrictions to specific states due to local regulations.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Damaged or Lost Shipments
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">If your order arrives damaged or is lost in transit, please contact us within 48 hours of the expected delivery date. We will investigate and arrange a replacement or refund as appropriate.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Multiple Items
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">Orders containing multiple items may be shipped in separate packages and may arrive on different dates. You will receive separate tracking numbers for each package.</p>
            </div>
          </div>

          <div className="mt-14 p-6 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div>
              <p className="font-extrabold text-slate-900">Have questions about this policy?</p>
              <p className="text-sm text-slate-500 mt-0.5">Our support team is happy to help.</p>
            </div>
            <Link href="/contact" className="px-6 py-3 rounded-xl font-bold text-white no-underline hover:opacity-90 transition flex-shrink-0" style={{ backgroundColor: '#4169e1' }}>
              Contact Us
            </Link>
          </div>
        </main>

        <footer className="border-t border-slate-100 py-8 px-6 text-center text-xs text-slate-400 mt-10">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <Link href="/privacy" className="hover:text-primary no-underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary no-underline">Terms of Service</Link>
            <Link href="/shipping-policy" className="hover:text-primary no-underline">Shipping Policy</Link>
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
