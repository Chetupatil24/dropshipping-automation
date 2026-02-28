import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { productsAPI } from '../lib/api';
import { useStore } from '../lib/store';
import { toast } from 'react-hot-toast';
import { FiGrid, FiList, FiFilter, FiX, FiShoppingCart, FiStar, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
// Selling price = CJ cost (USD) × 83 (INR) × 1.45 (45% markup)
const toINR = (usdPrice) => Math.round(parseFloat(usdPrice || 0) * 83 * 1.45);
const toMRP = (usdPrice) => Math.round(parseFloat(usdPrice || 0) * 83 * 1.9);

export default function Products() {
    const router = useRouter();
    const { addToCart, getCartCount } = useStore();
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [priceMax, setPriceMax] = useState(50000);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 20;

    // Sync category from URL
    useEffect(() => {
        if (router.isReady) {
            setSelectedCategory(router.query.category || '');
            setPage(1);
        }
    }, [router.isReady, router.query.category]);

    // Fetch products when category/page changes
    useEffect(() => {
        if (router.isReady) fetchProducts();
    }, [selectedCategory, page, router.isReady]);

    // Load categories from API once
    useEffect(() => {
        axios.get(`${API_URL}/products/categories`)
            .then(res => setCategories(res.data.categories || []))
            .catch(() => {});
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = { page, limit: LIMIT };
            if (selectedCategory) params.category = selectedCategory;
            if (searchInput.trim()) params.search = searchInput.trim();
            const { data } = await productsAPI.getAll(params);
            setAllProducts(data.products || []);
            setTotalPages(data.totalPages || 1);
        } catch {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchProducts();
    };

    const handleAddToCart = (product) => {
        addToCart(product, 1);
        toast.success('Added to cart!');
    };

    // Client-side sort + price filter
    const displayProducts = useMemo(() => {
        let result = allProducts.filter(p => toINR(p.price) <= priceMax);
        if (sortBy === 'price-low') result = [...result].sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-high') result = [...result].sort((a, b) => b.price - a.price);
        else if (sortBy === 'name-az') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        return result;
    }, [allProducts, sortBy, priceMax]);

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'name-az', label: 'Name A–Z' },
    ];

    const priceFilters = [
        { label: 'All Prices', max: 50000 },
        { label: 'Under ₹500', max: 500 },
        { label: 'Under ₹1,000', max: 1000 },
        { label: 'Under ₹2,000', max: 2000 },
        { label: 'Under ₹5,000', max: 5000 },
    ];

    const FilterContent = () => (
        <div className="space-y-6">
            <form onSubmit={handleSearch}>
                <h4 className="font-bold mb-2 text-gray-800 text-sm uppercase tracking-wide">Search</h4>
                <div className="flex gap-1">
                    <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
                        placeholder="Search products..." className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500" />
                    <button type="submit" className="bg-teal-600 text-white px-3 py-2 rounded-lg"><FiSearch /></button>
                </div>
            </form>
            <div>
                <h4 className="font-bold mb-3 text-gray-800 text-sm uppercase tracking-wide">Category</h4>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                    <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-teal-50 rounded-lg cursor-pointer">
                        <input type="radio" name="cat" checked={selectedCategory === ''} onChange={() => { setSelectedCategory(''); setPage(1); }} className="text-teal-600 accent-teal-600" />
                        <span className="text-sm text-gray-700">All Categories</span>
                    </label>
                    {categories.map(cat => (
                        <label key={cat} className="flex items-center gap-2 px-2 py-1.5 hover:bg-teal-50 rounded-lg cursor-pointer">
                            <input type="radio" name="cat" checked={selectedCategory === cat} onChange={() => { setSelectedCategory(cat); setPage(1); }} className="text-teal-600 accent-teal-600" />
                            <span className="text-sm text-gray-700 truncate">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <h4 className="font-bold mb-3 text-gray-800 text-sm uppercase tracking-wide">Max Price</h4>
                <div className="space-y-1">
                    {priceFilters.map(pf => (
                        <label key={pf.label} className="flex items-center gap-2 px-2 py-1.5 hover:bg-teal-50 rounded-lg cursor-pointer">
                            <input type="radio" name="price" checked={priceMax === pf.max} onChange={() => setPriceMax(pf.max)} className="text-teal-600 accent-teal-600" />
                            <span className="text-sm text-gray-700">{pf.label}</span>
                        </label>
                    ))}
                </div>
            </div>
            <button onClick={() => { setSelectedCategory(''); setSortBy('newest'); setPriceMax(50000); setSearchInput(''); setPage(1); }}
                className="w-full bg-gray-100 hover:bg-gray-200 py-2 rounded-lg font-semibold text-sm transition-colors text-gray-700">
                Clear All Filters
            </button>
        </div>
    );

    return (
        <>
            <Head>
                <title>{selectedCategory || 'All Products'} — Ruthan Shopping</title>
                <meta name="description" content="Shop fashion, jewellery, kids wear, accessories and more at Ruthan." />
            </Head>

            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all">
                <FaWhatsapp className="text-2xl" />
            </a>

            <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <Link href="/" className="text-2xl font-black text-teal-700 shrink-0">RUTHAN</Link>
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
                        <div className="relative w-full">
                            <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
                                placeholder="Search products, brands..."
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-l-xl focus:border-teal-500 focus:outline-none text-sm" />
                            <button type="submit" className="absolute right-0 top-0 h-full px-4 bg-teal-600 text-white rounded-r-xl hover:bg-teal-700">
                                <FiSearch />
                            </button>
                        </div>
                    </form>
                    <Link href="/cart" className="relative p-1">
                        <FiShoppingCart className="text-2xl text-gray-700" />
                        {getCartCount() > 0 && (
                            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {getCartCount()}
                            </span>
                        )}
                    </Link>
                </div>
            </header>

            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-6">
                    <div className="mb-4 text-sm flex items-center gap-2 text-gray-400">
                        <Link href="/" className="text-teal-600 hover:underline">Home</Link>
                        <span>/</span>
                        <span className="text-gray-700 font-medium">{selectedCategory || 'All Products'}</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5 gap-3">
                        <div>
                            <h1 className="text-2xl font-black text-gray-900">{selectedCategory || 'All Products'}</h1>
                            <p className="text-gray-500 text-sm mt-0.5">{displayProducts.length} products</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setShowFilters(true)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold">
                                <FiFilter /> Filters
                            </button>
                            <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
                                <button onClick={() => setViewMode('grid')}
                                    className={`p-2.5 ${viewMode === 'grid' ? 'bg-teal-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                                    <FiGrid />
                                </button>
                                <button onClick={() => setViewMode('list')}
                                    className={`p-2.5 ${viewMode === 'list' ? 'bg-teal-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                                    <FiList />
                                </button>
                            </div>
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-teal-500 bg-white">
                                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <aside className="hidden lg:block w-60 flex-shrink-0">
                            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24 border border-gray-100">
                                <h3 className="text-base font-bold mb-4 text-gray-800">Filters</h3>
                                <FilterContent />
                            </div>
                        </aside>

                        {showFilters && (
                            <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setShowFilters(false)}>
                                <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto shadow-xl"
                                    onClick={e => e.stopPropagation()}>
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="text-lg font-bold">Filters</h3>
                                        <button onClick={() => setShowFilters(false)}><FiX className="text-2xl" /></button>
                                    </div>
                                    <FilterContent />
                                </div>
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            {loading ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="bg-gray-200 animate-pulse rounded-2xl h-72"></div>
                                    ))}
                                </div>
                            ) : displayProducts.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-xl font-bold mb-2 text-gray-800">No products found</h3>
                                    <p className="text-gray-500 mb-4">Try a different category or clear filters</p>
                                    <button onClick={() => { setSelectedCategory(''); setSearchInput(''); setPriceMax(50000); setPage(1); }}
                                        className="bg-teal-600 text-white px-6 py-2 rounded-full font-semibold">
                                        Show All Products
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {viewMode === 'grid' ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {displayProducts.map(product => {
                                                const price = toINR(product.price);
                                                const mrp = product.compareAtPrice ? toINR(product.compareAtPrice) : toMRP(product.price);
                                                const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
                                                return (
                                                    <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                                                        <Link href={`/products/${product.slug}`}>
                                                            <div className="aspect-square bg-gray-100 overflow-hidden relative">
                                                                <img src={product.images?.[0] || 'https://placehold.co/400x400?text=No+Image'} alt={product.name}
                                                                    onError={e => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                {discount > 0 && (
                                                                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                                                                        {discount}% OFF
                                                                    </span>
                                                                )}
                                                                <button onClick={e => { e.preventDefault(); handleAddToCart(product); }}
                                                                    className="absolute bottom-2 right-2 bg-white text-teal-600 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 hover:bg-teal-600 hover:text-white transition-all">
                                                                    <FiShoppingCart className="text-sm" />
                                                                </button>
                                                            </div>
                                                        </Link>
                                                        <div className="p-3">
                                                            <Link href={`/products/${product.slug}`}>
                                                                <h3 className="font-semibold text-sm line-clamp-2 mb-1.5 hover:text-teal-600 text-gray-800 leading-snug">{product.name}</h3>
                                                            </Link>
                                                            <div className="flex items-center gap-1 mb-2">
                                                                <FiStar className="text-amber-400 fill-current text-xs" />
                                                                <span className="text-xs font-semibold text-gray-600">4.3</span>
                                                                <span className="text-xs text-gray-400">(84)</span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <span className="font-black text-gray-900 text-base">₹{price}</span>
                                                                    <span className="text-xs text-gray-400 line-through ml-1">₹{mrp}</span>
                                                                </div>
                                                                <button onClick={() => handleAddToCart(product)}
                                                                    className="bg-teal-600 hover:bg-teal-700 text-white p-1.5 rounded-full transition-all">
                                                                    <FiShoppingCart className="text-sm" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {displayProducts.map(product => {
                                                const price = toINR(product.price);
                                                const mrp = product.compareAtPrice ? toINR(product.compareAtPrice) : toMRP(product.price);
                                                const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
                                                return (
                                                    <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 flex gap-4 border border-gray-100">
                                                        <Link href={`/products/${product.slug}`} className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                                            <img src={product.images?.[0] || 'https://placehold.co/200x200?text=No+Image'} alt={product.name}
                                                                onError={e => { e.target.src = 'https://placehold.co/200x200?text=No+Image'; }}
                                                                className="w-full h-full object-cover" />
                                                        </Link>
                                                        <div className="flex-1 min-w-0">
                                                            <Link href={`/products/${product.slug}`}>
                                                                <h3 className="font-semibold text-gray-800 hover:text-teal-600 mb-1 line-clamp-2 text-sm">{product.name}</h3>
                                                            </Link>
                                                            <p className="text-xs text-gray-400 mb-1.5">{product.category}</p>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <span className="font-black text-gray-900">₹{price}</span>
                                                                <span className="text-sm text-gray-400 line-through">₹{mrp}</span>
                                                                {discount > 0 && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">{discount}% off</span>}
                                                            </div>
                                                        </div>
                                                        <button onClick={() => handleAddToCart(product)}
                                                            className="self-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl font-semibold text-sm shrink-0">
                                                            Add to Cart
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {totalPages > 1 && (
                                        <div className="mt-10 flex justify-center items-center gap-2">
                                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                                className="p-2 rounded-full bg-white border border-gray-200 disabled:opacity-40 hover:bg-teal-50 transition-colors">
                                                <FiChevronLeft />
                                            </button>
                                            {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                                                const pg = i + 1;
                                                return (
                                                    <button key={pg} onClick={() => setPage(pg)}
                                                        className={`w-9 h-9 rounded-full font-bold text-sm transition-all ${pg === page ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-teal-50'}`}>
                                                        {pg}
                                                    </button>
                                                );
                                            })}
                                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                                className="p-2 rounded-full bg-white border border-gray-200 disabled:opacity-40 hover:bg-teal-50 transition-colors">
                                                <FiChevronRight />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <footer className="bg-gray-900 text-gray-400 py-6 mt-8">
                <div className="container mx-auto px-4 text-center text-sm">
                    <p>© 2026 Ruthan. All rights reserved. Made with ❤️ in Bangalore</p>
                </div>
            </footer>
        </>
    );
}
