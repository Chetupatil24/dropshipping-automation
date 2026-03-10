import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const FAQS = [
  {
    cat: 'Orders & Payments',
    icon: 'shopping_bag',
    items: [
      { q: 'How do I place an order?', a: 'Browse our products, add items to your cart, and proceed to checkout. We accept UPI, credit/debit cards, net banking, and digital wallets via Razorpay.' },
      { q: 'Can I modify or cancel my order?', a: 'Orders can be cancelled within 1 hour of placement from your Orders page. Once dispatched, cancellation is not possible but you can initiate a return after delivery.' },
      { q: 'Is my payment information secure?', a: 'Yes. All payments are processed by Razorpay using 256-bit SSL encryption. We never store your card details on our servers.' },
      { q: 'What payment methods do you accept?', a: 'We accept UPI (GPay, PhonePe, Paytm), all major credit and debit cards, net banking from 50+ banks, and popular digital wallets.' },
    ]
  },
  {
    cat: 'Shipping & Delivery',
    icon: 'local_shipping',
    items: [
      { q: 'How long does delivery take?', a: 'Metro cities: 2-4 business days. Tier 2/3 cities: 4-6 business days. Remote areas: 6-10 business days. Orders are dispatched within 24-48 hours.' },
      { q: 'Is shipping free?', a: 'Yes! Orders above ₹999 qualify for FREE shipping. For orders below ₹999, a flat fee of ₹79 applies.' },
      { q: 'How can I track my order?', a: 'Once shipped, you\'ll receive an SMS and email with your tracking number. Visit our Track Order page or the courier\'s website to track in real time.' },
      { q: 'Do you ship outside India?', a: 'Currently we only ship within India. International shipping will be available soon — subscribe to our newsletter to be notified.' },
    ]
  },
  {
    cat: 'Returns & Refunds',
    icon: 'package_2',
    items: [
      { q: 'What is your return policy?', a: 'We offer a 7-day return window from the date of delivery. Items must be unused, unwashed, and in original packaging with all tags attached.' },
      { q: 'How do I initiate a return?', a: 'Go to My Orders, select the order, and click "Request Return". Our team will pick up the item within 2-3 business days.' },
      { q: 'When will I get my refund?', a: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item. Amount is credited to your original payment method.' },
      { q: 'What items cannot be returned?', a: 'Innerwear, socks, customised items, and items marked as "Final Sale" are non-returnable for hygiene reasons.' },
    ]
  },
  {
    cat: 'Account & Profile',
    icon: 'person',
    items: [
      { q: 'How do I create an account?', a: 'Click "Register" on the login page and fill in your name, email, and password. You\'ll receive a confirmation email to verify your account.' },
      { q: 'I forgot my password. What do I do?', a: 'Click "Forgot Password?" on the login page, enter your email, and we\'ll send you a reset link valid for 24 hours.' },
      { q: 'Can I have multiple delivery addresses?', a: 'Yes, you can manage multiple addresses from your Account page under the Profile section.' },
      { q: 'How do I update my email or phone number?', a: 'Go to My Account → Profile tab to update your personal information. Email changes require re-verification.' },
    ]
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="text-sm font-bold text-slate-900">{q}</span>
        <span className="material-symbols-outlined text-slate-400 flex-shrink-0 transition-transform select-none" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
      </button>
      {open && <p className="text-sm text-slate-500 leading-relaxed pb-4">{a}</p>}
    </div>
  );
}

export default function FAQ() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <>
      <Head><title>FAQ | RUTHAN</title></Head>
      <div className="min-h-screen bg-background-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-extrabold tracking-tighter no-underline" style={{ color: '#4169e1' }}>RUTHAN</Link>
            <Link href="/contact" className="text-sm font-semibold text-slate-600 hover:text-primary no-underline transition-colors">Still need help?</Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-14">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(65,105,225,0.08)' }}>
              <span className="material-symbols-outlined text-xl select-none" style={{ color: '#4169e1' }}>help</span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h1>
              <p className="text-sm text-slate-400 mt-0.5">Find answers to common questions below</p>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
            {FAQS.map((cat, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm flex-shrink-0 transition-all"
                style={{ backgroundColor: activeTab === i ? '#4169e1' : 'white', color: activeTab === i ? 'white' : '#64748b', border: '1px solid', borderColor: activeTab === i ? '#4169e1' : '#e2e8f0' }}>
                <span className="material-symbols-outlined text-sm select-none">{cat.icon}</span>
                {cat.cat}
              </button>
            ))}
          </div>

          {/* FAQ items */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-7 py-2">
            {FAQS[activeTab].items.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>

          {/* Still need help CTA */}
          <div className="mt-10 p-7 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div>
              <p className="font-extrabold text-slate-900">Couldn't find your answer?</p>
              <p className="text-sm text-slate-500 mt-0.5">Our support team responds within 24 hours.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link href="/contact" className="px-5 py-3 rounded-xl font-bold text-white no-underline hover:opacity-90 transition text-sm flex items-center gap-2" style={{ backgroundColor: '#4169e1' }}>
                <span className="material-symbols-outlined text-sm select-none">mail</span>
                Contact Us
              </Link>
              <a href="tel:+918000000000" className="px-5 py-3 rounded-xl font-bold no-underline hover:bg-slate-50 transition text-sm flex items-center gap-2 border border-slate-200 text-slate-700">
                <span className="material-symbols-outlined text-sm select-none">call</span>
                Call Us
              </a>
            </div>
          </div>
        </main>

        <footer className="border-t border-slate-100 py-8 px-6 text-center text-xs text-slate-400 mt-10">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <Link href="/privacy" className="hover:text-primary no-underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary no-underline">Terms of Service</Link>
            <Link href="/shipping-policy" className="hover:text-primary no-underline">Shipping Policy</Link>
            <Link href="/returns" className="hover:text-primary no-underline">Returns</Link>
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
