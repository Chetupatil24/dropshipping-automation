import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { productsAPI } from '../lib/api';
import { useStore } from '../lib/store';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';
import BottomNav from '../components/BottomNav';

const CATEGORIES = [
  { name: 'T-Shirts', icon: 'checkroom', link: '/products?category=T-Shirts' },
  { name: 'Hoodies', icon: 'dry_cleaning', link: '/products?category=Hoodies' },
  { name: 'Mugs', icon: 'coffee', link: '/products?category=Mugs' },
  { name: 'Bags', icon: 'shopping_bag', link: '/products?category=Bags' },
  { name: 'Activewear', icon: 'sports', link: '/products?category=Activewear' },
  { name: 'Jackets', icon: 'kayaking', link: '/products?category=Jackets' },
  { name: 'Home Decor', icon: 'home', link: '/products?category=Home+Decor' },
  { name: 'Accessories', icon: 'watch', link: '/products?category=Accessories' },
];

const TRENDING = [
  { title: 'Qikink Print-on-Demand', desc: 'Premium 180 GSM cotton tees, hoodies, mugs and more — freshly printed on every order.', img: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80', link: '/products?vendor=qikink', tag: 'Qikink POD' },
  { title: 'Printrove Custom Prints', desc: 'Satin shirts, bomber jackets, kurtis and more. All-over premium sublimation printing.', img: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80', link: '/custom-prints', tag: 'Custom Prints' },
  { title: 'Premium Drinkware', desc: 'Magic mugs, water bottles and custom ceramic cups. Perfect for gifting.', img: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=600&q=80', link: '/products?category=Mugs', tag: 'Gifts' },
];

export default function Home() {
  const router = useRouter();
  const { addToCart } = useStore();
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [allRes, featRes] = await Promise.all([
          productsAPI.getAll({ limit: 12, sort: 'createdAt:desc' }),
          productsAPI.getAll({ limit: 6, sort: 'featured' }),
        ]);
        setProducts(allRes.data?.products || []);
        setFeatured(featRes.data?.products || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };


  return (
    <>
      <Head>
        <title>RUTHAN | Premium Fashion & Lifestyle</title>
        <meta name="description" content="Discover curated fashion, jewelry, accessories and more. India's premium online fashion destination." />
      </Head>

      <div className="bg-background-light text-slate-900 antialiased min-h-screen">

        {/* HEADER */}

        <Navbar />

        <main className="max-w-7xl mx-auto pb-24">
          {/* HERO */}
          <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-slate-900">
            <div className="absolute inset-0 bg-cover bg-center opacity-75" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=85')" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
            <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
              <span className="text-white/80 uppercase tracking-[0.3em] text-sm mb-4 font-light">New Collection 2025</span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 max-w-2xl leading-tight">The Art of Modern Elegance</h2>
              <Link href="/products" className="bg-primary hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl no-underline">
                Shop New Arrivals
              </Link>
            </div>
          </section>

          {/* TRUST BADGES */}
          <div className="bg-white py-6 border-b border-slate-100">
            <div className="flex flex-wrap justify-around items-center gap-6 px-6 text-slate-500 text-xs font-semibold tracking-widest uppercase">
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-xl select-none">verified</span> Trusted Sellers</div>
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-xl select-none">local_shipping</span> Express Delivery</div>
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-xl select-none">workspace_premium</span> Premium Quality</div>
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-xl select-none">lock</span> Secure Payments</div>
            </div>
          </div>

          {/* CATEGORIES */}
          <section className="py-16 px-6">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h3 className="text-2xl font-bold mb-2">Shop by Category</h3>
                <div className="h-1 w-12 rounded-full" style={{ backgroundColor: '#4169e1' }} />
              </div>
              <Link href="/products" className="text-primary text-sm font-semibold hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {CATEGORIES.map((cat) => (
                <Link href={cat.link} key={cat.name} className="group cursor-pointer no-underline">
                  <div className="aspect-square rounded-2xl flex flex-col items-center justify-center transition-all group-hover:-translate-y-1" style={{ backgroundColor: 'rgba(65,105,225,0.06)' }}>
                    <span className="material-symbols-outlined text-3xl text-primary mb-1.5 select-none">{cat.icon}</span>
                    <p className="font-semibold text-[11px] text-slate-700 text-center leading-tight px-1">{cat.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* RECOMMENDED */}
          <section className="py-12 bg-white/60">
            <div className="px-6 mb-8 flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-bold">New Arrivals</h3>
                <p className="text-slate-500 text-sm">Latest from our print-on-demand catalog</p>
              </div>
              <Link href="/products" className="text-primary text-sm font-bold hover:underline no-underline">View All →</Link>
            </div>
            <div className="flex overflow-x-auto gap-5 px-6 no-scrollbar pb-6">
              {loading ? Array(5).fill(0).map((_, i) => (
                <div key={i} className="min-w-[220px] bg-white rounded-xl border border-slate-100 overflow-hidden">
                  <div className="h-60 bg-slate-100 animate-pulse" />
                  <div className="p-4 space-y-2"><div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" /><div className="h-4 bg-slate-100 rounded animate-pulse" /></div>
                </div>
              )) : products.map((p) => {
                const price = parseFloat(p.price || 0);
                const img = Array.isArray(p.images) ? p.images[0] : (p.imageUrl || p.image || '');
                const isQikink = p.vendor_id === 'qikink';
                const isPrintrove = p.vendor_id === 'printrove';
                return (
                  <div key={p.id} className="min-w-[220px] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-slate-100 cursor-pointer">
                    <div className="relative h-60">
                      <img src={img || 'https://placehold.co/400x400?text=No+Image'} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={e => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }} />
                      {isQikink && <span className="absolute top-2 left-2 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Qikink</span>}
                      {isPrintrove && <span className="absolute top-2 left-2 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Printrove</span>}
                      <button onClick={() => handleAddToCart(p)} className="absolute bottom-2 left-2 right-2 bg-primary text-white text-xs font-bold py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all">Add to Cart</button>
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{p.category || 'Print-on-Demand'}</p>
                      <Link href={`/products/${p.slug || p.id}`} className="no-underline">
                        <h4 className="font-bold text-slate-800 mb-2 truncate text-sm hover:text-primary">{p.name}</h4>
                      </Link>
                      <span className="text-primary font-bold text-sm">₹{price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* TRENDING */}
          <section className="py-20 px-6">
            <h3 className="text-3xl font-bold mb-12 text-center">Explore Collections</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TRENDING.map((item) => (
                <div key={item.title} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
                  <div className="h-72 overflow-hidden relative">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full text-slate-800">
                      {item.tag}
                    </span>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                    <p className="text-slate-500 text-sm mb-4">{item.desc}</p>
                    <Link href={item.link} className="text-primary font-bold flex items-center gap-2 no-underline">
                      Explore <span className="material-symbols-outlined select-none">arrow_right_alt</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PRINTROVE PROMO BANNER */}
          <section className="mx-6 mb-12 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}>
            <div className="flex flex-col md:flex-row items-center gap-6 px-8 py-10 text-white">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-4">
                  <span className="material-symbols-outlined text-sm select-none">palette</span>
                  <span className="text-xs font-bold tracking-wider">Exclusive Custom Prints</span>
                </div>
                <h3 className="text-2xl font-extrabold mb-3">Printrove Print-on-Demand</h3>
                <p className="text-white/80 text-sm max-w-md mb-5">
                  Satin shirts, bomber jackets, kurtis, hoodies and 50+ more premium products — freshly printed via DTG & sublimation. Ships in 5-7 days.
                </p>
                <Link href="/custom-prints" className="inline-block bg-white text-purple-700 font-bold px-8 py-3 rounded-full hover:bg-yellow-300 hover:text-slate-900 transition-all shadow-lg no-underline">
                  Shop Custom Prints
                </Link>
              </div>
              <div className="hidden md:flex gap-3 shrink-0">
                {featured.slice(0, 3).map((p, i) => {
                  const img = Array.isArray(p.images) ? p.images[0] : (p.imageUrl || p.image || '');
                  return (
                    <div key={p.id} className="w-28 h-36 rounded-xl overflow-hidden border-2 border-white/40 shadow-xl">
                      <img src={img || 'https://placehold.co/200x250?text=P'} alt={p.name} className="w-full h-full object-cover" onError={e => { e.target.src = 'https://placehold.co/200x250?text=P'; }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CTA BANNER */}
          <section className="mx-6 py-12 px-8 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8" style={{ backgroundColor: '#4169e1' }}>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-3">Shop With Confidence</h3>
              <p className="text-white/80 max-w-lg">Every transaction is encrypted and protected. COD available across India.</p>
            </div>
            <div className="flex gap-6 items-center shrink-0">
              <span className="material-symbols-outlined text-5xl select-none">verified_user</span>
              <span className="material-symbols-outlined text-5xl select-none">credit_card</span>
              <span className="material-symbols-outlined text-5xl select-none">workspace_premium</span>
            </div>
          </section>
        </main>

        {/* FOOTER */}

        <SiteFooter />

        {/* BOTTOM MOBILE NAV */}

        <BottomNav />
      </div>
    </>
  );
}
