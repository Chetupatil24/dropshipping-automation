import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';
import BottomNav from '../components/BottomNav';

export default function PolicyPage() {
  return (
    <>
      <Head><title>Terms of Service | RUTHAN</title></Head>
      <div className="min-h-screen bg-background-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        <Navbar />

        <main className="max-w-4xl mx-auto px-6 py-14">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(65,105,225,0.08)' }}>
              <span className="material-symbols-outlined text-xl select-none" style={{ color: '#4169e1' }}>gavel</span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service</h1>
              <p className="text-xs text-slate-400 mt-0.5">Last updated: March 1, 2026</p>
            </div>
          </div>

          <div className="mt-10 space-y-8">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Acceptance of Terms
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">By accessing and using RUTHAN, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Account Registration
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">You must provide accurate information when creating an account. You are responsible for maintaining the security of your account and password. Notify us immediately of any unauthorized use.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Product Listings
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">We strive to accurately represent all products. Colors may vary slightly due to display settings. Product availability is subject to change. We reserve the right to limit quantities or cancel orders in case of pricing errors.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Ordering & Payment
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">By placing an order, you agree to provide valid payment information. Orders are confirmed upon successful payment. We accept UPI, credit/debit cards, net banking, and digital wallets via Razorpay.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Shipping & Delivery
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">We aim to dispatch orders within 24-48 hours. Delivery times vary by location (typically 3-7 business days). Shipping charges and free shipping thresholds are displayed at checkout.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Returns & Refunds
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">We offer a 7-day return policy on eligible items. Products must be unused and in original packaging. Refunds are processed within 5-7 business days after we receive the returned item.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Prohibited Uses
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">You may not use our platform for any unlawful purpose, to transmit spam, to infringe intellectual property rights, or to engage in fraudulent transactions. Violations may result in account termination.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Limitation of Liability
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">RUTHAN shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount paid for the specific order in question.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: '#4169e1' }}></span>
                Changes to Terms
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">We may update these terms periodically. Continued use of our services after changes constitutes acceptance of the new terms. We will notify users of significant changes via email.</p>
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


        <SiteFooter />


        <BottomNav />
      </div>
    </>
  );
}
