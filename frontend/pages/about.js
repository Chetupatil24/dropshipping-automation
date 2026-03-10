import Head from 'next/head';
import Link from 'next/link';

export default function AboutPage() {
  const VALUES = [
    { icon: 'stars', title: 'Premium Quality', desc: 'Every product is carefully curated and quality-checked before listing.' },
    { icon: 'local_shipping', title: 'Fast Delivery', desc: 'We partner with top logistics providers for swift, reliable delivery across India.' },
    { icon: 'verified_user', title: 'Secure & Trusted', desc: '100% secure payments with Razorpay. Your data is always protected.' },
    { icon: 'support_agent', title: 'Customer First', desc: 'Our support team is always available to help you with any issue.' },
    { icon: 'replay', title: 'Easy Returns', desc: 'Hassle-free 7-day return policy on all eligible products.' },
    { icon: 'volunteer_activism', title: 'Ethical Sourcing', desc: 'We work with suppliers who follow fair trade and ethical practices.' },
  ];

  return (
    <>
      <Head><title>About Us | RUTHAN</title></Head>
      <div className="min-h-screen bg-background-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-extrabold tracking-tighter no-underline" style={{ color: '#4169e1' }}>RUTHAN</Link>
            <div className="flex items-center gap-4">
              <Link href="/contact" className="text-sm font-semibold text-slate-600 hover:text-primary no-underline transition-colors hidden sm:block">Contact</Link>
              <Link href="/cart" className="no-underline"><span className="material-symbols-outlined text-slate-600 hover:text-primary transition-colors select-none">shopping_bag</span></Link>
            </div>
          </div>
        </header>

        <main>
          {/* Hero */}
          <section className="py-20 px-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(65,105,225,0.06) 0%, rgba(65,105,225,0.02) 100%)' }}>
            <div className="max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-6 text-white" style={{ backgroundColor: '#4169e1' }}>Our Story</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                Fashion That Moves <span style={{ color: '#4169e1' }}>With You</span>
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed">
                RUTHAN was born from a simple belief — that everyone deserves access to beautiful, quality fashion without compromise. We bring the world's finest styles directly to your doorstep across India.
              </p>
            </div>
          </section>

          {/* Mission */}
          <section className="max-w-5xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest mb-3" style={{ color: '#4169e1' }}>Our Mission</p>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-5 leading-tight">Democratizing Premium Fashion in India</h2>
                <p className="text-slate-500 leading-relaxed mb-4">
                  We curate thousands of premium products from trusted global suppliers and bring them to Indian customers at fair prices. From elegant jewelry to contemporary clothing — RUTHAN is your one-stop fashion destination.
                </p>
                <p className="text-slate-500 leading-relaxed">
                  Founded in 2024, we've grown from a small boutique concept to a full-scale e-commerce platform serving customers across every state in India. Our commitment to quality and customer satisfaction remains our north star.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[['10K+','Happy Customers'],['500+','Premium Products'],['48hrs','Average Delivery'],['4.8★','Customer Rating']].map(([val, lab]) => (
                  <div key={lab} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
                    <p className="text-3xl font-extrabold mb-1" style={{ color: '#4169e1' }}>{val}</p>
                    <p className="text-xs font-bold text-slate-500">{lab}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="bg-white py-16 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: '#4169e1' }}>Our Values</p>
                <h2 className="text-3xl font-extrabold text-slate-900">Why Choose RUTHAN</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {VALUES.map(v => (
                  <div key={v.title} className="p-6 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(65,105,225,0.08)' }}>
                      <span className="material-symbols-outlined text-xl select-none" style={{ color: '#4169e1' }}>{v.icon}</span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 mb-2">{v.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 px-6 text-center">
            <div className="max-w-xl mx-auto">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Ready to Explore?</h2>
              <p className="text-slate-500 mb-8">Browse our curated collection and find your perfect style.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products" className="px-10 py-4 rounded-xl font-bold text-white no-underline hover:opacity-90 transition-all shadow-lg" style={{ backgroundColor: '#4169e1' }}>Shop Now</Link>
                <Link href="/contact" className="px-10 py-4 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 no-underline hover:border-primary transition-all">Contact Us</Link>
              </div>
            </div>
          </section>
        </main>

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
