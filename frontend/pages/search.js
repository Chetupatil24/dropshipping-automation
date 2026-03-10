import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { productsAPI } from '../lib/api';
import { useStore } from '../lib/store';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';
import BottomNav from '../components/BottomNav';

const toINR = (usd) => Math.round(parseFloat(usd || 0) * 83 * 1.45);
const toMRP  = (usd) => Math.round(parseFloat(usd || 0) * 83 * 1.9);

export default function SearchPage() {
  const router = useRouter();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState('');

  const fetchResults = useCallback(async (q, s) => {
    if (!q) return;
    setLoading(true);
    try {
      const res = await productsAPI.getAll({ search: q, sort: s, limit: 24 });
      const data = res.data;
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch { setProducts([]); setTotal(0); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query.q || '';
    const s = router.query.sort || '';
    setQuery(q); setSort(s);
    fetchResults(q, s);
  }, [router.isReady, router.query.q, router.query.sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push({ pathname: '/search', query: { q: query, ...(sort && { sort }) } });
  };

  const handleSort = (s) => {
    setSort(s);
    router.push({ pathname: '/search', query: { q: query, sort: s } });
  };

  const SORT_OPTS = [
    { v: '', label: 'Relevance' },
    { v: 'price_asc', label: 'Price: Low to High' },
    { v: 'price_desc', label: 'Price: High to Low' },
    { v: 'newest', label: 'Newest First' },
  ];

  return (
    <>
      <Head><title>{query ? `"${query}" — Search | RUTHAN` : 'Search | RUTHAN'}</title></Head>
      <div className="min-h-screen bg-background-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {/* Header */}

        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Results summary + sort */}
          {router.query.q && (
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">
                  {loading ? 'Searching...' : `${total.toLocaleString()} results for`}{' '}
                  {!loading && <span style={{ color: '#4169e1' }}>"{router.query.q}"</span>}
                </h1>
              </div>
              {/* Sort chips */}
              <div className="flex gap-2 flex-wrap">
                {SORT_OPTS.map(o => (
                  <button key={o.v} onClick={() => handleSort(o.v)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${sort === o.v ? 'text-white border-primary' : 'border-slate-200 text-slate-600 bg-white hover:border-primary'}`}
                    style={sort === o.v ? { backgroundColor: '#4169e1' } : {}}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty search prompt */}
          {!router.query.q && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <span className="material-symbols-outlined text-7xl text-slate-200 mb-5 select-none">search</span>
              <h2 className="text-2xl font-bold text-slate-700 mb-2">What are you looking for?</h2>
              <p className="text-slate-400 text-sm">Type in the search bar above to find products.</p>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
                  <div className="aspect-[3/4] bg-slate-100" />
                  <div className="p-4 space-y-2"><div className="h-3 bg-slate-200 rounded w-4/5" /><div className="h-3 bg-slate-100 rounded w-2/5" /></div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {!loading && router.query.q && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="material-symbols-outlined text-7xl text-slate-200 mb-5 select-none">search_off</span>
              <h2 className="text-2xl font-bold text-slate-700 mb-3">No results found</h2>
              <p className="text-slate-500 mb-8">Try different keywords or browse our categories.</p>
              <Link href="/products" className="px-8 py-3 rounded-xl font-bold text-white no-underline hover:opacity-90" style={{ backgroundColor: '#4169e1' }}>Browse All Products</Link>
            </div>
          )}

          {/* Results grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {products.map(p => {
                const img = Array.isArray(p.images) ? p.images[0] : (p.imageUrl || p.image || '');
                const price = toINR(p.price);
                const mrp   = toMRP(p.price);
                const disc  = Math.round((1 - price / mrp) * 100);
                const wishlisted = isWishlisted ? isWishlisted(p.id) : false;
                return (
                  <div key={p.id} className="product-card group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-50">
                      <Link href={`/products/${p.slug || p.id}`} className="block w-full h-full no-underline">
                        <img src={img || 'https://placehold.co/300x400?text=No+Image'} alt={p.name} className="product-image w-full h-full object-cover transition-transform duration-500" onError={e => { e.target.src = 'https://placehold.co/300x400?text=No+Image'; }} />
                      </Link>
                      {disc > 5 && <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">-{disc}%</span>}
                      <button onClick={() => { const added = toggleWishlist ? toggleWishlist(p) : false; toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist'); }}
                        className={`absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center transition-colors ${wishlisted ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}>
                        <span className={`material-symbols-outlined text-sm select-none ${wishlisted ? 'fill-1' : ''}`}>favorite</span>
                      </button>
                      <div className="quick-add absolute bottom-0 left-0 right-0 p-3 opacity-0 translate-y-2 transition-all duration-200">
                        <button onClick={() => { addToCart(p); toast.success('Added to cart!'); }}
                          className="w-full py-2.5 rounded-xl text-white text-xs font-extrabold shadow-lg"
                          style={{ backgroundColor: '#4169e1' }}>
                          Quick Add
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <Link href={`/products/${p.slug || p.id}`} className="no-underline">
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">{p.name}</h3>
                      </Link>
                      <div className="flex items-baseline gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">₹{price.toLocaleString('en-IN')}</span>
                        <span className="text-xs text-slate-400 line-through">₹{mrp.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>


        <SiteFooter />
        <BottomNav />
      </div>
    </>
  );
}
