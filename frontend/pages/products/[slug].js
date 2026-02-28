import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStore } from '../../lib/store';
import { productsAPI } from '../../lib/api';
import { toast } from 'react-hot-toast';
import { FiShoppingCart, FiHeart, FiTruck, FiCheckCircle, FiStar } from 'react-icons/fi';
import StockScarcityBar from '../../components/StockScarcityBar';
import ProductBundles from '../../components/ProductBundles';

export default function ProductDetail() {
    const router = useRouter();
    const { slug } = router.query;
    const { addToCart } = useStore();

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    // Fetch product on load
    useEffect(() => {
        if (slug) {
            fetchProduct();
        }
    }, [slug]);

    const fetchProduct = async () => {
        try {
            const { data } = await productsAPI.getBySlug(slug);
            setProduct(data.product || data);
        } catch (error) {
            toast.error('Product not found');
            router.push('/');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        addToCart({ ...product, quantity });
        toast.success(`Added ${quantity} to cart! 🛒`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <>
            <Head>
                <title>{product.name} - Ruthan</title>
                <meta name="description" content={product.description} />
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white py-12">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb */}
                    <div className="mb-8 text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-700">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium">{product.name}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Images */}
                        <div>
                            {/* Main Image */}
                            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 mb-4 overflow-hidden">
                                <img
                                    src={product.images?.[selectedImage] || 'https://placehold.co/400x400?text=No+Image'}
                                    alt={product.name}
                                    onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
                                    className="w-full h-auto rounded-2xl hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Thumbnail Images */}
                            {product.images && product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-2 overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-purple-500 scale-105' : 'border-transparent'
                                                }`}
                                        >
                                            <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-auto rounded-lg" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            {/* Title */}
                            <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar key={i} className="fill-current" />
                                    ))}
                                </div>
                                <span className="text-gray-600">(4.8) • 128 reviews</span>
                            </div>

                            {/* Price */}
                            <div className="mb-8">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                                        ₹{(product.price * 83).toFixed(0)}
                                    </span>
                                    {product.compareAtPrice && (
                                        <>
                                            <span className="text-2xl text-gray-500 line-through">₹{(product.compareAtPrice * 83).toFixed(0)}</span>
                                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-4 py-1 rounded-full font-bold text-sm">
                                                SAVE {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-3">About this product</h3>
                                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                            </div>

                            {/* Features */}
                            <StockScarcityBar />

                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <FiTruck className="text-blue-700 text-2xl" />
                                        <div>
                                            <p className="font-bold">Fast Delivery</p>
                                            <p className="text-sm text-gray-600">3-5 days</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FiCheckCircle className="text-blue-700 text-2xl" />
                                        <div>
                                            <p className="font-bold">COD Available</p>
                                            <p className="text-sm text-gray-600">Pay on delivery</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-3">Quantity</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-purple-200 rounded-full overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-6 py-3 hover:bg-purple-100 transition-colors font-bold text-blue-700 text-xl"
                                        >
                                            -
                                        </button>
                                        <span className="px-8 py-3 font-bold text-purple-900 text-xl">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-6 py-3 hover:bg-purple-100 transition-colors font-bold text-blue-700 text-xl"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="text-gray-600">
                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                    </span>
                                </div>
                            </div>

                            {/* Add to Cart */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock <= 0}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-5 rounded-full font-extrabold text-xl hover:from-teal-600 hover:to-secondary transition-all hover:scale-105 shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    <FiShoppingCart className="text-2xl" />
                                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                                <button className="bg-white border-2 border-purple-200 text-blue-700 px-6 py-5 rounded-full font-bold hover:bg-purple-50 transition-all hover:scale-105 shadow-lg">
                                    <FiHeart className="text-2xl" />
                                </button>
                            </div>

                            {/* Security Badges */}
                            <div className="mt-8 flex gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🔒</span>
                                    <span>Secure Checkout</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🚚</span>
                                    <span>Free Shipping on ₹1000+</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">↩️</span>
                                    <span>Easy Returns</span>
                                </div>
                            </div>

                            <ProductBundles mainProduct={product} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
