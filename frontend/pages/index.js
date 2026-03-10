import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { productsAPI } from '../lib/api';
import { useStore } from '../lib/store';
import { toast } from 'react-hot-toast';

const toINR = (usd) => Math.round(parseFloat(usd || 0) * 83 * 1.45);
const toMRP = (usd) => Math.round(parseFloat(usd || 0) * 83 * 1.9);

const CATEGORIES = [
  { name: 'Dresses', icon: 'apparel', link: '/products?category=Lady' },
  { name: 'Accessories', icon: 'watch', link: '/products?category=Accessories' },
  { name: 'Footwear', icon: 'ice_skating', link: '/products?category=Shoes' },
  { name: 'Bags', icon: 'shopping_bag', link: '/products?category=Bag' },
  { name: 'Beauty', icon: 'styler', link: '/products?category=Beauty' },
  { name: 'Jewelry', icon: 'diamond', link: '/products?category=Jewelry' },
  { name: 'Home', icon: 'weekend', link: '/products?category=Home' },
  { name: 'Sports', icon: 'sports_soccer', link: '/products?category=Sports' },
];

const TRENDING = [
  { title: 'Summer Streetscape', desc: 'Discover urban essentials for the warmer months.', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80', link: '/products?category=Lady' },
  { title: 'Artisan Jewels', desc: 'Hand-crafted pieces for your curated wardrobe.', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80', link: '/products?category=Jewelry' },
  { title: 'The Accessory Edit', desc: 'Redefining style with comfort and elegance.', img: 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=600&q=80', link: '/products?category=Accessories' },
];

export default function Home() {
  const router = useRouter();
  const { addToCart, getCartCount } = useStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await productsAPI.getAll({ limit: 12 });
        setProducts(data.products || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) router.push(\`/products?search=\${encodeURIComponent(search)}\`);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(\`\${product.name} added to cart!\`);
  };

  const cartCount = getCartCount();

  return (
    <>
      <Head>
        <title>RUTHAN | Premium Fashion & Lifestyle</title>
        <meta name="description" content="Discover curated fashion, jewelry, accessories and more. India's premium online fashion destination." />
      </Head>

      <div className="bg-background-light text-slate-900 antialiased min-h-screen">

        {/* HEADER */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="material-symbols-outlined text-slate-700 md:hidden cursor-pointer select-none">menu</button>
              <nav className="hidden md:flex gap-6 text-sm font-semibold">
                <Link href="/products?category=Lady" className="hover:text-primary transition-colors text-slate-700">Women</Link>
                <Link href="/products?category=Men" className="hover:text-primary transition-colors text-slate-700">Men</Link>
                <Link href="/products?category=Accessories" className="hover:text-primary transition-colors text-slate-700">Accessories</Link>
                <Link href="/products" className="hover:text-primary transition-colors text-slate-700">All Products</Link>
              </nav>
            </div>
            <Link href="/" className="text-2xl font-extrabold tracking-tighter text-primary no-underline">RUTHAN</Link>
            <div className="flex items-center gap-4">
              <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-slate-100 rounded-full px-4 py-2 w-52">
                <span className="material-symbols-outlined text-slate-400 text-[20px] mr-1 select-none">search</span>
                <input value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-slate-400" placeholder="Search..." />
              </form>
              <Link href="/wishlist" className="no-underline hidden sm:block">
                <span className="material-symbols-outlined text-slate-700 hover:text-primary transition-colors select-none">favorite</span>
              </Link>
              <Link href="/account" className="no-underline">
                <span className="material-symbols-outlined text-slate-700 hover:text-primary transition-colors select-none">person</span>
              </Link>
              <Link href="/cart" className="relative no-underline">
                <span className="material-symbols-outlined text-slate-700 hover:text-primary transition-colors select-none">shopping_bag</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
                )}
              </Link>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-3">
              <Link href="/products?category=Lady" className="block text-sm font-semibold text-slate-700 hover:text-primary">Women</Link>
              <Link href="/products?category=Men" className="block text-sm font-semibold text-slate-700 hover:text-primary">Men</Link>
              <Link href="/products?category=Accessories" className="block text-sm font-semibold text-slate-700 hover:text-primary">Accessories</Link>
              <Link href="/products" className="block text-sm font-semibold text-slate-700 hover:text-primary">All Products</Link>
              <form onSubmit={handleSearch} className="flex items-center bg-slate-100 rounded-full px-4 py-2">
                <span className="material-symbols-outlined text-slate-400 text-[20px] mr-1 select-none">search</span>
                <input value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-slate-400" placeholder="Search..." />
              </form>
            </div>
          )}
        </header>

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
            <div className="px-6 mb-8">
              <h3 className="text-2xl font-bold">Recommended for You</h3>
              <p className="text-slate-500 text-sm">Curated from our latest collection</p>
            </div>
            <div className="flex overflow-x-auto gap-5 px-6 no-scrollbar pb-6">
              {loading ? Array(5).fill(0).map((_, i) => (
                <div key={i} className="min-w-[240px] bg-white rounded-xl border border-slate-100 overflow-hidden">
                  <div className="h-64 bg-slate-100 animate-pulse" />
                  <div className="p-4 space-y-2"><div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" /><div className="h-4 bg-slate-100 rounded animate-pulse" /></div>
                </div>
              )) : products.map((p) => {
                const price = toINR(p.price);
                const mrp = toMRP(p.price);
                const disc = Math.round((1 - price / mrp) * 100);
                const img = Array.isArray(p.images) ? p.images[0] : (p.imageUrl || p.image || '');
                return (
                  <div key={p.id} className="min-w-[240px] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-slate-100 cursor-pointer">
                    <div className="relative h-64">
                      <img src={img || 'https://placehold.co/400x400?text=No+Image'} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={e => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }} />
                      {disc > 5 && <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">-{disc}%</span>}
                      <button onClick={() => handleAddToCart(p)} className="absolute bottom-2 left-2 right-2 bg-primary text-white text-xs font-bold py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all">Add to Cart</button>
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{p.category || 'Fashion'}</p>
                      <Link href={\`/products/\${p.slug || p.id}\`} className="no-underline">
                        <h4 className="font-bold text-slate-800 mb-1 truncate text-sm hover:text-primary">{p.name}</h4>
                      </Link>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-primary font-bold text-sm">&#8377;{price.toLocaleString('en-IN')}</span>
                          <span className="text-slate-400 line-through text-xs ml-1">&#8377;{mrp.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center text-yellow-500">
                          <span className="material-symbols-outlined text-[12px] fill-1 select-none">star</span>
                          <span className="text-xs text-slate-400 ml-0.5">4.5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* TRENDING */}
          <section className="py-20 px-6">
            <h3 className="text-3xl font-bold mb-12 text-center">Trending Now</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TRENDING.map((item) => (
                <div key={item.title} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
                  <div className="h-72 overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
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
        <footer className="bg-white border-t pt-16 pb-20 md:pb-12 px-6" style={{ borderColor: 'rgba(65,105,225,0.1)' }}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h2 className="text-2xl font-extrabold text-primary mb-4">RUTHAN</h2>
              <p className="text-slate-500 mb-5 leading-relaxed text-sm">India's premium fashion destination. Quality, trusted sellers, fast delivery.</p>
              <div className="flex gap-3">
                {['public', 'share', 'mail'].map(icon => (
                  <a key={icon} className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all text-slate-600 no-underline" style={{ borderColor: 'rgba(65,105,225,0.2)' }} href="#">
                    <span className="material-symbols-outlined text-sm select-none">{icon}</span>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-5 uppercase tracking-wider text-sm">Collections</h4>
              <ul className="space-y-3 text-slate-500 text-sm">
                <li><Link href="/products?category=Lady" className="hover:text-primary transition-colors">Women's Fashion</Link></li>
                <li><Link href="/products?category=Jewelry" className="hover:text-primary transition-colors">Fine Jewelry</Link></li>
                <li><Link href="/products?category=Shoes" className="hover:text-primary transition-colors">Footwear</Link></li>
                <li><Link href="/products?category=Accessories" className="hover:text-primary transition-colors">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-5 uppercase tracking-wider text-sm">Client Services</h4>
              <ul className="space-y-3 text-slate-500 text-sm">
                <li><Link href="/track" className="hover:text-primary transition-colors">Track Your Order</Link></li>
                <li><Link href="/orders" className="hover:text-primary transition-colors">My Orders</Link></li>
                <li><Link href="/account" className="hover:text-primary transition-colors">My Account</Link></li>
                <li><Link href="/login" className="hover:text-primary transition-colors">Login / Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-5 uppercase tracking-wider text-sm">Newsletter</h4>
              <p className="text-slate-500 text-sm mb-4">Subscribe for first access to new arrivals and exclusive deals.</p>
              <form className="space-y-3" onSubmit={e => e.preventDefault()}>
                <input className="w-full bg-slate-100 border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:outline-none" style={{ outlineColor: '#4169e1' }} placeholder="Email Address" type="email" />
                <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg text-sm hover:bg-black transition-all">Join RUTHAN Insider</button>
              </form>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 pt-6 border-t text-center text-slate-400 text-xs" style={{ borderColor: 'rgba(65,105,225,0.1)' }}>
            <div className="flex items-center justify-center gap-4 flex-wrap mb-3">
              <Link href="/about" className="hover:text-primary transition-colors no-underline">About Us</Link>
              <Link href="/contact" className="hover:text-primary transition-colors no-underline">Contact</Link>
              <Link href="/shipping-policy" className="hover:text-primary transition-colors no-underline">Shipping Policy</Link>
              <Link href="/privacy" className="hover:text-primary transition-colors no-underline">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors no-underline">Terms of Service</Link>
            </div>
            © 2025 RUTHAN. All rights reserved.
          </div>
        </footer>

        {/* BOTTOM MOBILE NAV */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t flex items-center justify-around px-4 py-3 z-50" style={{ borderColor: 'rgba(65,105,225,0.1)' }}>
          <Link href="/" className="flex flex-col items-center gap-0.5 text-primary no-underline">
            <span className="material-symbols-outlined fill-1 select-none">home</span>
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <Link href="/products" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline">
            <span className="material-symbols-outlined select-none">search</span>
            <span className="text-[10px] font-bold">Shop</span>
          </Link>
          <Link href="/wishlist" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline">
            <span className="material-symbols-outlined select-none">favorite</span>
            <span className="text-[10px] font-bold">Wishlist</span>
          </Link>
          <Link href="/orders" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline">
            <span className="material-symbols-outlined select-none">package</span>
            <span className="text-[10px] font-bold">Orders</span>
          </Link>
          <Link href="/account" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline">
            <span className="material-symbols-outlined select-none">person</span>
            <span className="text-[10px] font-bold">Profile</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
