import Head from 'next/head';
import Link from 'next/link';

export default function PolicyPage() {
  return (
    <>
      <Head><title>Privacy Policy | RUTHAN</title></Head>
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
              <span className="material-symbols-outlined text-xl select-none" style={{ color: '#4169e1' }}>privacy_tip</span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
              <p className="text-xs text-slate-400 mt-0.5">Last updated: March 1, 2026</p>
            </div>
          </div>

          <div className="mt-10 space-y-8">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Information We Collect
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support. This includes your name, email address, phone number, shipping address, and payment information (processed securely via Razorpay — we never store card details).</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                How We Use Your Information
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">We use your information to process and fulfill your orders, send order confirmations and shipping updates, respond to your inquiries, improve our services, and send promotional communications (you can opt out at any time).</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Information Sharing
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">We do not sell your personal information. We may share your information with shipping partners to fulfill your orders, payment processors to complete transactions, and as required by law. All third parties are bound by confidentiality agreements.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Data Security
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">We implement industry-standard security measures including SSL encryption, secure payment processing via Razorpay, and regular security audits to protect your personal information.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Cookies
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">We use cookies to improve your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser. Disabling cookies may affect some site functionality.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Your Rights
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">You have the right to access, update, or delete your personal information. You can do this through your account settings or by contacting us. You may also request a copy of all data we hold about you.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Contact Us
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">If you have any questions about this Privacy Policy, please contact us at privacy@ruthan.in or through our Contact page.</p>
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
