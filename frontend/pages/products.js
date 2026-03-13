import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { productsAPI } from '../lib/api';
import { useStore } from '../lib/store';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';
import BottomNav from '../components/BottomNav';

const LIMIT = 24;

const VENDOR_TABS = [
  { id: '', label: 'All Products', icon: 'grid_view' },
  { id: 'qikink', label: 'Qikink POD', icon: 'print', badge: 'POD' },
  { id: 'printrove', label: 'Custom Prints', icon: 'palette', badge: 'CUSTOM', redirect: '/custom-prints' },
];

const VENDOR_BADGE = {
  qikink: { label: 'Qikink POD', cls: 'bg-blue-100 text-blue-700' },
  printrove: { label: 'Custom Print', cls: 'bg-purple-100 text-purple-700' },
};


export default function Products() {
  const router = useRouter();
  const { addToCart } = useStore();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ category: '', sort: 'createdAt:desc', search: '', maxPrice: '', vendor: '' });

  // Sync URL -> filters
  useEffect(() => {
    if (!router.isReady) return;
    const { category = '', sort = 'createdAt:desc', search = '', maxPrice = '', vendor = '' } = router.query;
    setFilters({ category, sort, search, maxPrice, vendor });
    setPage(1);
  }, [router.isReady, router.query]);

  // Load categories
  useEffect(() => {
    productsAPI.getCategories()
      .then(r => setCategories(r.data?.categories || []))
      .catch(() => {});
  }, []);

  // Load products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: LIMIT, page, sort: filters.sort };
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.maxPrice) params.maxPrice = parseFloat(filters.maxPrice);
      if (filters.vendor) params.vendor = filters.vendor;
      const { data } = await productsAPI.getAll(params);
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const totalPages = Math.ceil(total / LIMIT);

  const updateFilter = (key, val) => {
    const q = { ...router.query, [key]: val };
    if (!val) delete q[key];
    router.push({ pathname: '/products', query: q }, undefined, { shallow: true });
  };


  return (
    <>
      <Head><title>Shop All Products | RUTHAN</title></Head>
      <div className="bg-background-light min-h-screen text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-widest mb-8">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="material-symbols-outlined text-sm select-none">chevron_right</span>
            {filters.category ? (
              <>
                <Link href="/products" className="hover:text-primary">All Products</Link>
                <span className="material-symbols-outlined text-sm select-none">chevron_right</span>
                <span className="text-slate-900">{filters.category}</span>
              </>
            ) : <span className="text-slate-900">All Products</span>}
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight mb-3">{filters.category ? filters.category : 'Shop All Products'}</h1>
            <p className="text-slate-500 text-sm">{total} products found · Print-on-Demand from Qikink &amp; Printrove</p>
          </div>

          {/* Vendor Tabs */}
          <div className="flex gap-3 mb-8 overflow-x-auto pb-1 no-scrollbar">
            {VENDOR_TABS.map(tab => {
              const active = filters.vendor === tab.id && !tab.redirect;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.redirect) { router.push(tab.redirect); return; }
                    updateFilter('vendor', tab.id);
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border transition-all whitespace-nowrap ${
                    active
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-base select-none">{tab.icon}</span>
                  {tab.label}
                  {tab.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex gap-10">
            <aside className="w-60 shrink-0 hidden lg:block">
              <div className="sticky top-28 space-y-8">
                {/* Category filter */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Category</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="cat" checked={!filters.category} onChange={() => updateFilter('category', '')} className="accent-primary" />
                      <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">All</span>
                    </label>
                    {categories.slice(0, 12).map(c => (
                      <label key={c} className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" name="cat" checked={filters.category === c} onChange={() => updateFilter('category', c)} className="accent-primary" />
                        <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">{c}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Vendor filter */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Vendor</h3>
                  <div className="space-y-2">
                    {[['', 'All Vendors'], ['qikink', 'Qikink POD'], ['printrove', 'Printrove']].map(([val, label]) => (
                      <label key={val} className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" name="vendor" checked={filters.vendor === val} onChange={() => updateFilter('vendor', val)} className="accent-primary" />
                        <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Sort */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Sort By</h3>
                  <div className="space-y-2">
                    {[['createdAt:desc', 'Newest'], ['price:asc', 'Price: Low to High'], ['price:desc', 'Price: High to Low'], ['name:asc', 'Name A-Z']].map(([val, label]) => (
                      <label key={val} className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" name="sort" checked={filters.sort === val} onChange={() => updateFilter('sort', val)} className="accent-primary" />
                        <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Max price */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Max Price (₹)</h3>
                  <input
                    type="number" placeholder="e.g. 1500" step="100"
                    value={filters.maxPrice || ''}
                    onChange={e => updateFilter('maxPrice', e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                {(filters.category || filters.vendor || filters.maxPrice) && (
                  <button onClick={() => router.push('/products')} className="w-full text-center text-xs text-primary font-bold hover:underline">
                    Clear All Filters ×
                  </button>
                )}
              </div>
            </aside>

            {/* Main */}
            <div className="flex-1">
              {/* Grid header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <p className="text-sm text-slate-500">Showing {products.length} of {total}</p>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500 hidden sm:block">Sort:</span>
                  <select
                    value={filters.sort}
                    onChange={e => updateFilter('sort', e.target.value)}
                    className="text-sm font-semibold bg-transparent border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="createdAt:desc">Newest</option>
                    <option value="price:asc">Price: Low to High</option>
                    <option value="price:desc">Price: High to Low</option>
                    <option value="name:asc">Name A-Z</option>
                  </select>
                </div>
              </div>

              {/* Product grid */}
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array(8).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                      <div className="aspect-[3/4] bg-slate-100 animate-pulse" />
                      <div className="p-4 space-y-2">
                        <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                        <div className="h-4 bg-slate-100 rounded animate-pulse w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-24">
                  <span className="material-symbols-outlined text-6xl text-slate-300 select-none">search_off</span>
                  <p className="text-slate-500 mt-4 text-lg font-semibold">No products found</p>
                  <button onClick={() => router.push('/products')} className="mt-6 bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all">Clear Filters</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                  {products.map((p) => {
                    const price = parseFloat(p.price || 0);
                    const img = Array.isArray(p.images) ? p.images[0] : (p.imageUrl || p.image || '');
                    const vb = VENDOR_BADGE[p.vendor_id];
                    return (
                      <div key={p.id} className="product-card group cursor-pointer">
                        <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 rounded-xl mb-3">
                          <img src={img || 'https://placehold.co/400x600?text=No+Image'} alt={p.name} className="product-image w-full h-full object-cover transition-transform duration-700 ease-in-out" onError={e => { e.target.src = 'https://placehold.co/400x600?text=No+Image'; }} />
                          {vb && (
                            <span className={`absolute top-2 left-2 text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full ${vb.cls}`}>
                              {vb.label}
                            </span>
                          )}
                          {p.isFeatured && (
                            <span className="absolute top-2 right-2 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">★ Featured</span>
                          )}
                          <div className="quick-add absolute inset-x-3 bottom-3 opacity-0 transform translate-y-3 transition-all duration-300">
                            <button onClick={() => { addToCart(p); toast.success('Added!'); }} className="w-full bg-white text-slate-900 py-2.5 rounded-lg font-bold text-xs hover:bg-primary hover:text-white transition-colors shadow-xl">ADD TO CART</button>
                          </div>
                        </div>
                        <Link href={`/products/${p.slug || p.id}`} className="no-underline">
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 mb-1">{p.name}</h3>
                        </Link>
                        <p className="text-xs text-slate-400 mb-1">{p.category || ''}</p>
                        <span className="font-bold text-slate-900">₹{price.toLocaleString('en-IN')}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="w-10 h-10 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-30 transition-colors">
                    <span className="material-symbols-outlined select-none">chevron_left</span>
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pg = page <= 3 ? i + 1 : page + i - 2;
                    if (pg < 1 || pg > totalPages) return null;
                    return (
                      <button key={pg} onClick={() => setPage(pg)} className={`w-10 h-10 flex items-center justify-center rounded font-bold text-sm transition-colors ${pg === page ? 'bg-primary text-white' : 'hover:bg-slate-100'}`}>{pg}</button>
                    );
                  })}
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="w-10 h-10 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-30 transition-colors">
                    <span className="material-symbols-outlined select-none">chevron_right</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Mobile bottom nav */}

        <SiteFooter />
        <BottomNav />
      </div>
      <style jsx>{`
        .product-card:hover .product-image { transform: scale(1.05); }
        .product-card:hover .quick-add { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>
    </>
  );
}
