import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { productsAPI } from '../lib/api';
import { useStore } from '../lib/store';
import { toast } from 'react-hot-toast';
import { FiGrid, FiList, FiFilter, FiX, FiShoppingCart, FiHeart, FiStar, FiTruck, FiMapPin, FiMenu } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function Products() {
    const router = useRouter();
    const { addToCart, getCartCount } = useStore();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        category: router.query.category || '',
        priceRange: [0, 10000],
        sortBy: 'newest',
        search: ''
    });

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await productsAPI.getAll(filters);
            setProducts(data.products || []);
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (product) => {
        addToCart(product, 1);
        toast.success('Added to cart! 🛒');
    };

    const categories = ['All', 'Footwear', 'Ethnic Wear', 'Custom Prints', 'Streetwear', 'Accessories', 'International'];
    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'popular', label: 'Most Popular' }
    ];

    const priceRanges = [
        { label: 'Under ₹500', min: 0, max: 500 },
        { label: '₹500 - ₹1000', min: 500, max: 1000 },
        { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
        { label: 'Above ₹2000', min: 2000, max: 100000 }
    ];

    return (
        <>
            <Head>
                <title>All Products - Ruthan | The Shopping Spot in Bangalore</title>
                <meta name="description" content="Browse our complete collection of footwear, ethnic wear, custom prints, and streetwear from Bangalore's best vendors" />
            </Head>

            {/* WhatsApp */}
            <a
                href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all animate-pulse"
           >
            <FaWhatsapp className="text-3xl" />
        </a>

            {/* Header */ }
            <header className ="bg-white shadow-md sticky top-0 z-40">
                <div className ="container mx-auto py-4 flex items-center justify-between">
                    <Link href ="/" className="text-2xl lg:text-3xl font-black text-transparent bg-clip-text gradient-primary">
    RUTHAN
                    </Link>
        <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg">
            <FiShoppingCart className ="text-2xl" />
    {
        getCartCount()> 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        { getCartCount() }
                            </span>
                        )
    }
                    </Link>
                </div>
            </header>

        <div className="min-h-screen bg-gray-50 py-8">
            <div className ="container mx-auto px-4">
    {/* Breadcrumb */ }
    <div className="mb-6 text-sm flex items-center gap-2">
        <Link href ="/" className="text-teal-600 hover:underline">Home</Link>
            <span className ="text-gray-400">/</span>
                <span className ="text-gray-900 font-medium">Products</span>
                    </div>

        {/* Page Header */ }
        <div className ="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">
    { filters.category || 'All Products' }
                            </h1>
        <p className="text-gray-600 flex items-center gap-2">
            <span> { products.length } products found</span>
                <span className="text-teal-600 flex items-center gap-1">
                    <FiTruck /> Free delivery in Bangalore
                                </span>
                            </p>
                        </div>

        {/* View & Sort Controls */ }
        <div className ="flex items-center gap-4">
            <button
    onClick = {() => setShowFilters(!showFilters)
}
className ="lg:hidden btn-primary px-4 py-2 flex items-center gap-2"
   >
    <FiFilter />
Filters
                            </button>

    <div className="hidden md:flex bg-white border border-gray-200 rounded-lg p-1">
        <button
onClick = {() => setViewMode('grid')}
className = {`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-teal-600 text-white' : 'text-gray-600'}`}
                               >
    <FiGrid />
                                </button>
    <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-teal-600 text-white' : 'text-gray-600'}`}
   >
        <FiList />
    </button>
                            </div>

    <select
        value={filters.sortBy}
        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        className="px-4 py-2 border border-gray-200 rounded-lg font-medium focus:outline-none focus:border-teal-500"
           >
        {
            sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))
        }
                            </select>
                        </div>
                    </div>

    <div className="flex gap-8">
{/* Desktop Filters */ }
<aside className="hidden lg:block w-72 flex-shrink-0">
    <div className ="card sticky top-24">
        <h3 className ="text-xl font-bold mb-6 flex items-center gap-2">
            <FiFilter className ="text-teal-600" />
Filters
                                </h3>

    {/* Category Filter */ }
    <div className ="mb-6">
        <h4 className ="font-bold mb-3">Category</h4>
            <div className ="space-y-2">
{
    categories.map(category => (
        <label key={category} className="flex items-center gap-2 p-2 hover:bg-teal-50 rounded-lg cursor-pointer transition-colors">
    <input
                                                    type ="radio"
                                                    name ="category"
                                                    value = { category }
                                                    checked = { filters.category === (category === 'All' ? '' : category) }
                                                    onChange = {(e) => setFilters({ ...filters, category: e.target.value === 'All' ? '' : e.target.value })}
className ="text-teal-600 focus:ring-teal-500"
    />
    <span>{category}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

    {/* Price Range */ }
    <div className ="mb-6">
        <h4 className ="font-bold mb-3">Price Range</h4>
            <div className ="space-y-2">
{
    priceRanges.map(range => (
        <label key={range.label} className="flex items-center gap-2 p-2 hover:bg-teal-50 rounded-lg cursor-pointer transition-colors">
    <input
                                                    type ="checkbox"
                                                    className ="text-teal-600 focus:ring-teal-500 rounded"
    />
    <span>{range.label}</span>
                                            </label>
                                        ))
}
                                    </div>
                                </div>

    <button
        onClick={() => setFilters({ category: '', priceRange: [0, 10000], sortBy: 'newest', search: '' })}
        className="w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-lg font-bold transition-colors"
           >
            Clear All
                                </button>
                            </div>
                        </aside>

    {/* Mobile Filters */ }
{
    showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setShowFilters(false)}>
            <div className ="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className ="flex items-center justify-between mb-6">
                    <h3 className ="text-xl font-bold">Filters</h3>
                        <button onClick = {() => setShowFilters(false)
}>
    <FiX className="text-2xl" />
                                        </button>
                                    </div>
    {/* Same content as desktop */ }
    <div className ="mb-6">
        <h4 className ="font-bold mb-3">Category</h4>
            <div className ="space-y-2">
{
    categories.map(category => (
        <label key={category} className="flex items-center gap-2 p-2">
    <input type ="radio" name="category-mobile" className="text-teal-600" />
    <span> { category }</span>
                                                </label>
                                            ))
}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

{/* Products Grid */ }
<div className="flex-1">
{
    loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {
        [...Array(12)].map((_, i) => (
            <div key={i} className="card h-96 skeleton"></div>
        ))
    }
                                </div>
                            ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'space-y-4'}>
            {products.map((product) => (
                <div key={product.id} className="group card p-0 overflow-hidden hover:shadow-2xl transition-all">
            <Link href={`/products/${product.slug}`}>
                <div className="aspect-square bg-gray-100 overflow-hidden relative">
                    <img
                        src={product.images?.[0] || 'https://placehold.co/400x400?text=No+Image'}
                        alt={product.name}
                        onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                                                    )}
                {product.discount && (
                    <span className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                {product.discount}% OFF
            </span>
                                                    )}
            <button className="absolute top-3 right-3 bg-white p-2 rounded-full hover:scale-110 transition-transform">
            <FiHeart />
        </button>
                                                </div>
                                            </Link>
        <div className="p-4">
            <Link href = {`/products/${product.slug}`
}>
    <h3 className="font-bold line-clamp-2 mb-2 group-hover:text-teal-600 transition-colors">
{ product.name }
                                                    </h3>
                                                </Link>
    <div className="flex items-center gap-1 mb-2">
        <FiStar className ="text-amber-400 fill-current" />
            <span className ="text-sm font-semibold">4.5</span>
                <span className ="text-sm text-gray-500">(120)</span>
                                                </div>
    <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
        <FiMapPin className ="text-teal-600" />
            <span> Bangalore Vendor</span>
                                                </div>
    <div className="flex items-center justify-between">
        <div className ="price text-xl">₹{(product.price * 83).toFixed(0)}</div>
            <button
onClick = {() => handleAddToCart(product)}
className ="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full hover:scale-110 transition-all shadow-md"
   >
    <FiShoppingCart />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

{/* Pagination */ }
{
    !loading && products.length> 0 && (
        <div className="mt-12 flex justify-center gap-2">
    {
        [1, 2, 3, 4, 5].map(page => (
            <button
                key={page}
                className={`w-10 h-10 rounded-full font-bold transition-all ${page === 1
                        ? 'bg-teal-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-teal-50'
                    }`}
           >
                {page}
            </button>
        ))
    }
                                </div>
                            )
}

{/* Empty State */ }
{
    !loading && products.length === 0 && (
        <div className="text-center py-16">
            <div className ="text-6xl mb-4">🔍</div>
                <h3 className ="text-2xl font-bold mb-2">No products found</h3>
                    <p className ="text-gray-600 mb-6">Try adjusting your filters</p>
                        <button onClick = {() => setFilters({ category: '', priceRange: [0, 10000], sortBy: 'newest', search: '' })
} className ="btn-primary">
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

    {/* Footer */ }
    <footer className ="bg-gray-900 text-gray-300 py-8">
        <div className ="container mx-auto px-4 text-center">
            <p>© 2026 Ruthan.All rights reserved.Made with ❤️ in Bangalore</p>
                </div>
            </footer>
        </>
    );
}
