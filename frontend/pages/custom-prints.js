import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { productsAPI } from '../lib/api';
import { useStore } from '../lib/store';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';
import BottomNav from '../components/BottomNav';

const CATEGORIES = [
  { name: 'T-Shirts', icon: 'checkroom', color: 'from-violet-500 to-purple-600' },
  { name: 'Hoodies', icon: 'dry_cleaning', color: 'from-blue-500 to-indigo-600' },
  { name: 'Shirts', icon: 'style', color: 'from-pink-500 to-rose-600' },
  { name: 'Jackets', icon: 'kayaking', color: 'from-orange-500 to-amber-600' },
  { name: 'Activewear', icon: 'sports', color: 'from-green-500 to-emerald-600' },
  { name: 'Mugs', icon: 'coffee', color: 'from-yellow-500 to-amber-600' },
  { name: 'Bags', icon: 'shopping_bag', color: 'from-teal-500 to-cyan-600' },
  { name: 'Home Decor', icon: 'home', color: 'from-rose-500 to-pink-600' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Browse & Choose', desc: 'Pick any product from our Printrove catalog — tees, hoodies, mugs, bags and more.', icon: 'search' },
  { step: '02', title: 'Add to Cart', desc: 'Select your size, quantity, and add to cart. Each item is freshly printed on demand.', icon: 'add_shopping_cart' },
  { step: '03', title: 'We Print & Ship', desc: 'Printrove prints your order with premium DTG or sublimation and ships directly to you.', icon: 'local_shipping' },
  { step: '04', title: 'You Receive', desc: 'In 5–7 days, your custom-quality product arrives at your doorstep.', icon: 'celebration' },
];

export default function CustomPrints() {
  const { addToCart } = useStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState('');

  const fetchProducts = async (category = '') => {
    setLoading(true);
    try {
      const params = { vendor: 'printrove', limit: 24 };
      if (category) params.category = category;
      const { data } = await productsAPI.getAll(params);
      setProducts(data.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleCategoryClick = (cat) => {
    const newCat = selected === cat ? '' : cat;
    setSelected(newCat);
    fetchProducts(newCat);
  };

  return (
    <>
      <Head>
        <title>Custom Prints by Printrove | RUTHAN</title>
        <meta name="description" content="Premium custom print-on-demand products — T-shirts, hoodies, mugs, bags and more. Printed fresh by Printrove and delivered across India." />
      </Head>

      <div className="bg-background-light min-h-screen text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />

        <main className="pb-32">
          {/* HERO */}
          <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)' }}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white" style={{ transform: 'translate(30%, -30%)' }} />
              <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white" style={{ transform: 'translate(-30%, 30%)' }} />
            </div>
            <div className="relative max-w-7xl mx-auto px-6 py-20 text-white">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                    <span className="material-symbols-outlined text-lg select-none">palette</span>
                    <span className="text-sm font-bold tracking-wide">Powered by Printrove</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                    Custom Prints,<br />
                    <span className="text-yellow-300">Premium Quality</span>
                  </h1>
                  <p className="text-white/80 text-lg mb-8 max-w-xl leading-relaxed">
                    Every product in our Custom Prints collection is made-to-order using premium DTG and sublimation printing by Printrove — India&apos;s leading Print-on-Demand partner.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a href="#products" className="bg-white text-purple-700 px-8 py-4 rounded-full font-bold hover:bg-yellow-300 hover:text-slate-900 transition-all shadow-xl no-underline">
                      Browse Products
                    </a>
                    <Link href="/products" className="border-2 border-white/60 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all no-underline">
                      All Products
                    </Link>
                  </div>
                </div>
                <div className="hidden md:flex gap-4 shrink-0">
                  <div className="flex flex-col gap-4">
                    <div className="w-40 h-48 rounded-2xl overflow-hidden shadow-2xl">
                      <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80" alt="T-shirt" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-40 h-36 rounded-2xl overflow-hidden shadow-2xl">
                      <img src="https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=300&q=80" alt="Mug" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 mt-8">
                    <div className="w-40 h-36 rounded-2xl overflow-hidden shadow-2xl">
                      <img src="https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&q=80" alt="Hoodie" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-40 h-48 rounded-2xl overflow-hidden shadow-2xl">
                      <img src="https://images.unsplash.com/photo-1547949003-9792a18a2601?w=300&q=80" alt="Tote bag" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TRUST BADGES */}
          <div className="bg-white border-b border-slate-100 py-5">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-wrap justify-around items-center gap-4 text-slate-500 text-xs font-bold tracking-widest uppercase">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600 text-lg select-none">verified</span>
                  Printrove Certified
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600 text-lg select-none">print</span>
                  DTG Printing
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600 text-lg select-none">local_shipping</span>
                  Ships in 5–7 Days
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600 text-lg select-none">inventory_2</span>
                  Made to Order
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600 text-lg select-none">workspace_premium</span>
                  Premium Fabric
                </div>
              </div>
            </div>
          </div>

          {/* CATEGORIES */}
          <section className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold mb-3">Browse by Category</h2>
              <p className="text-slate-500">Find exactly what you&apos;re looking for</p>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`group flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                    selected === cat.name
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-transparent bg-slate-50 hover:border-purple-300 hover:bg-purple-50/50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 bg-gradient-to-br ${cat.color}`}>
                    <span className="material-symbols-outlined text-white text-xl select-none">{cat.icon}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">{cat.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* PRODUCTS */}
          <section id="products" className="max-w-7xl mx-auto px-6 pb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-extrabold mb-1">
                  {selected ? `${selected} — Custom Prints` : 'All Custom Print Products'}
                </h2>
                <p className="text-slate-500 text-sm">{products.length} products · Freshly printed on demand</p>
              </div>
              {selected && (
                <button
                  onClick={() => { setSelected(''); fetchProducts(); }}
                  className="text-sm text-purple-600 font-bold hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-base select-none">close</span>
                  Clear filter
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="aspect-[3/4] bg-slate-100 animate-pulse" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
                      <div className="h-4 bg-slate-100 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                <span className="material-symbols-outlined text-6xl text-slate-300 select-none">search_off</span>
                <p className="text-slate-500 mt-4 font-semibold">No products in this category yet</p>
                <button onClick={() => { setSelected(''); fetchProducts(); }} className="mt-4 text-purple-600 font-bold hover:underline">View all products</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(p => {
                  const price = parseFloat(p.price || 0);
                  const img = Array.isArray(p.images) ? p.images[0] : (p.imageUrl || p.image || '');
                  return (
                    <div key={p.id} className="printrove-card group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-purple-200 hover:shadow-xl transition-all cursor-pointer">
                      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
                        <img
                          src={img || 'https://placehold.co/400x500?text=No+Image'}
                          alt={p.name}
                          className="w-full h-full object-cover prod-img transition-transform duration-500"
                          onError={e => { e.target.src = 'https://placehold.co/400x500?text=No+Image'; }}
                        />
                        <div className="absolute top-3 left-3">
                          <span className="text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                            Printrove
                          </span>
                        </div>
                        {p.isFeatured && (
                          <div className="absolute top-3 right-3">
                            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">★ Popular</span>
                          </div>
                        )}
                        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <button
                            onClick={() => { addToCart(p); toast.success(`${p.name} added!`); }}
                            className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl font-bold text-xs hover:bg-purple-700 transition-colors shadow-lg"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-purple-500 mb-1">{p.category || 'Custom Print'}</p>
                        <Link href={`/products/${p.slug || p.id}`} className="no-underline">
                          <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-purple-700 transition-colors mb-2">
                            {p.name}
                          </h3>
                        </Link>
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900">₹{price.toLocaleString('en-IN')}</span>
                          <Link href={`/products/${p.slug || p.id}`} className="no-underline">
                            <span className="text-xs text-purple-600 font-bold hover:underline">View →</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* HOW IT WORKS */}
          <section className="py-20" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)' }}>
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-14">
                <h2 className="text-3xl font-extrabold mb-3">How It Works</h2>
                <p className="text-slate-500 max-w-xl mx-auto">Every order is freshly printed — no dead stock, no waste. Premium quality guaranteed.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {HOW_IT_WORKS.map((step, idx) => (
                  <div key={step.step} className="text-center">
                    <div className="relative inline-flex mb-6">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                        <span className="material-symbols-outlined text-white text-2xl select-none">{step.icon}</span>
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-400 text-slate-900 text-[10px] font-extrabold flex items-center justify-center">
                        {idx + 1}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-800 mb-2">{step.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ABOUT PRINTROVE */}
          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 rounded-full px-4 py-2 mb-6 text-sm font-bold">
                  <span className="material-symbols-outlined text-base select-none">verified_user</span>
                  Our Print Partner
                </div>
                <h2 className="text-3xl font-extrabold mb-5">Why Printrove?</h2>
                <div className="space-y-4 text-slate-600">
                  <div className="flex gap-3">
                    <span className="material-symbols-outlined text-purple-600 mt-0.5 select-none">check_circle</span>
                    <div>
                      <p className="font-semibold text-slate-800">Premium DTG & Sublimation Printing</p>
                      <p className="text-sm">State-of-the-art printing technology for vibrant, long-lasting colors.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="material-symbols-outlined text-purple-600 mt-0.5 select-none">check_circle</span>
                    <div>
                      <p className="font-semibold text-slate-800">200+ Premium Blank Products</p>
                      <p className="text-sm">Curated selection of high-quality fabrics and materials.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="material-symbols-outlined text-purple-600 mt-0.5 select-none">check_circle</span>
                    <div>
                      <p className="font-semibold text-slate-800">Same-Day Production</p>
                      <p className="text-sm">Orders received before 2 PM are dispatched the same day.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="material-symbols-outlined text-purple-600 mt-0.5 select-none">check_circle</span>
                    <div>
                      <p className="font-semibold text-slate-800">Pan-India Delivery</p>
                      <p className="text-sm">Ships to every pincode across India via trusted couriers.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden aspect-[4/5]">
                  <img src="https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80" alt="Premium hoodie" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[4/5] mt-6">
                  <img src="https://images.unsplash.com/photo-1544816565-aa8c1166648f?w=400&q=80" alt="Canvas tote bag" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="mx-6 mb-8 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}>
            <div className="px-10 py-14 text-center text-white">
              <span className="material-symbols-outlined text-5xl mb-4 block select-none text-yellow-300">palette</span>
              <h2 className="text-3xl font-extrabold mb-4">Ready to Create Something Amazing?</h2>
              <p className="text-white/80 mb-8 max-w-md mx-auto">Browse our full Printrove catalog and order premium custom-print products today.</p>
              <a href="#products" className="inline-block bg-white text-purple-700 px-10 py-4 rounded-full font-extrabold hover:bg-yellow-300 hover:text-slate-900 transition-all shadow-xl no-underline">
                Shop Custom Prints
              </a>
            </div>
          </section>
        </main>

        <SiteFooter />
        <BottomNav />
      </div>

      <style jsx>{`
        .printrove-card:hover .prod-img { transform: scale(1.06); }
      `}</style>
    </>
  );
}
