import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { productsAPI } from '../lib/api';
import { useStore } from '../lib/store';
import { toast } from 'react-hot-toast';
import {
  FiShoppingCart, FiUser, FiSearch, FiTruck, FiShield,
  FiRefreshCw, FiStar, FiMenu, FiHeart, FiMapPin, FiSmartphone, FiHome
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { addToCart, getCartCount, user } = useStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await productsAPI.getAll();
      setProducts(data.products?.slice(0, 12) || []);
    } catch (error) {
      console.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const categories = [
    { name: 'Fashion', icon: '👔', link: '/products?category=fashion', color: 'from-blue-600 to-blue-800' },
    { name: 'Footwear', icon: '👟', link: '/products?category=footwear', color: 'from-teal-500 to-teal-700' },
    { name: 'Electronics', icon: '📱', link: '/products?category=electronics', color: 'from-gray-700 to-gray-900' },
    { name: 'Accessories', icon: '⌚', link: '/products?category=accessories', color: 'from-amber-500 to-amber-700' },
    { name: 'Home & Kitchen', icon: '🏠', link: '/products?category=home', color: 'from-teal-600 to-emerald-600' },
    { name: 'Custom Prints', icon: '🎨', link: '/products?category=custom', color: 'from-blue-700 to-indigo-700' },
    { name: 'Ethnic Wear', icon: '🪷', link: '/products?category=ethnic', color: 'from-amber-600 to-orange-600' },
    { name: 'Sports', icon: '⚽', link: '/products?category=sports', color: 'from-teal-600 to-cyan-600' },
  ];

  return (
    <>
      <Head>
        <title>Ruthan - Online Shopping India | Fashion, Electronics, Home & More</title>
        <meta name="description" content="Shop online for clothes, shoes, electronics, accessories, and more. Best deals, COD available, free delivery across India." />
        <meta name="keywords" content="online shopping india, fashion, electronics, footwear, accessories, home appliances, deals, offers" />
      </Head>

      {/* Top Bar */}
      <div className="bg-primary text-white py-1 text-xs">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4">
            <span>🎉 Get Extra 10% Off on Your First Order</span>
          </div>
          <div className="flex gap-4">
            <span>📞 Help: +91 98765 43210</span>
            <span className="hidden md:inline">📧 support@ruthan.com</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="text-3xl font-black">
                <span className="text-primary">RUTHAN</span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  id="search"
                  name="search"
                  type="text"
                  placeholder="Search for Products, Brands and More"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-primary focus:outline-none"
                />
                <button className="absolute right-0 top-0 h-full px-6 bg-primary text-white">
                  <FiSearch className="text-xl" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link href={user ? '/account' : '/login'} className="hidden md:flex items-center gap-2 hover:text-primary">
                <FiUser className="text-2xl" />
                <span className="font-semibold">{user ? 'Account' : 'Login'}</span>
              </Link>

              <Link href="/cart" className="relative flex items-center gap-2 hover:text-primary">
                <FiShoppingCart className="text-2xl" />
                <span className="font-semibold hidden md:inline">Cart</span>
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-8 py-2 text-sm overflow-x-auto">
              <Link href="/products?category=fashion" className="hover:text-primary font-semibold whitespace-nowrap">Fashion</Link>
              <Link href="/products?category=electronics" className="hover:text-primary font-semibold whitespace-nowrap">Electronics</Link>
              <Link href="/products?category=footwear" className="hover:text-primary font-semibold whitespace-nowrap">Footwear</Link>
              <Link href="/products?category=home" className="hover:text-primary font-semibold whitespace-nowrap">Home & Kitchen</Link>
              <Link href="/products?category=accessories" className="hover:text-primary font-semibold whitespace-nowrap">Accessories</Link>
              <Link href="/products?category=custom" className="hover:text-primary font-semibold whitespace-nowrap">Custom Products</Link>
              <Link href="/products?category=ethnic" className="hover:text-primary font-semibold whitespace-nowrap">Ethnic Wear</Link>
              <Link href="/products?category=sports" className="hover:text-primary font-semibold whitespace-nowrap">Sports</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner - Modern Gradient */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-900 text-white py-20 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4 animate-pulse">🎉 LIMITED TIME OFFER</div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 drop-shadow-2xl">Big Billion Days Sale!</h1>
          <p className="text-2xl md:text-3xl mb-8 font-light">Up to <span className="text-amber-400 font-bold">80% Off</span> + Extra 10% Bank Discount</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/products" className="bg-secondary hover:bg-secondary-dark text-white font-bold px-10 py-5 rounded-full text-lg shadow-2xl hover:scale-105 transition-transform">
              🛍️ Shop Now
            </Link>
            <Link href="/products?deals=true" className="bg-white/20 backdrop-blur-lg border-2 border-white/50 hover:bg-white/30 text-white font-bold px-10 py-5 rounded-full text-lg shadow-2xl hover:scale-105 transition-transform">
              ⚡ View All Deals
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section - Trendy Cards */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.link}
                className="group"
              >
                <div className={`relative bg-gradient-to-br ${category.color} p-6 rounded-2xl text-center hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden`}>
                  {/* Glass effect overlay */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  <div className="relative z-10">
                    <div className="text-6xl mb-3 group-hover:scale-125 transition-transform duration-300">{category.icon}</div>
                    <div className="text-white font-bold text-sm drop-shadow-lg">{category.name}</div>
                  </div>
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products - Modern Grid */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">🔥 Trending Products</h2>
              <p className="text-gray-600 text-lg">Hot picks that everyone's buying</p>
            </div>
            <Link href="/products" className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {loading ? (
              // Skeletons
              Array(12).fill(0).map((_, i) => (
                <div key={i} className="card h-80 skeleton"></div>
              ))
            ) : (
              products.map((product) => (
                <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    {!product.image && (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        📦
                      </div>
                    )}
                    {/* Quick add & discount badges */}
                    <button
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                    >
                      <FiHeart className="text-red-500 text-lg" />
                    </button>
                    <div className="absolute top-3 left-3 bg-amber-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg">
                      33% OFF
                    </div>
                  </div>
                  <div className="p-4">
                    <Link href={`/products/${product.slug || product.id}`}>
                      <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="flex items-center gap-1 bg-green-600 text-white text-xs px-2.5 py-1 rounded-md font-bold">
                        <span>4.3</span>
                        <FiStar className="text-xs fill-current" />
                      </div>
                      <span className="text-xs text-gray-500 font-medium">(234)</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-2xl font-black text-gray-900">₹{product.price}</span>
                      <span className="text-sm text-gray-400 line-through">₹{Math.round(product.price * 1.5)}</span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-gradient-to-r from-secondary to-teal-600 hover:from-teal-600 hover:to-secondary text-white font-bold py-3 rounded-xl transition-all hover:scale-105 shadow-md hover:shadow-xl"
                    >
                      🛒 Add to Cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Today's Best Deals</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 rounded-lg">
              <h3 className="text-3xl font-black mb-2">Fashion Sale</h3>
              <p className="text-lg mb-4">Up to 70% Off</p>
              <Link href="/products?category=fashion" className="bg-white text-blue-700 font-bold px-6 py-3 rounded-sm inline-block hover:bg-gray-100">
                Shop Now
              </Link>
            </div>
            <div className="bg-gradient-to-br from-teal-500 to-teal-700 text-white p-8 rounded-lg">
              <h3 className="text-3xl font-black mb-2">Electronics</h3>
              <p className="text-lg mb-4">Min 40% Off</p>
              <Link href="/products?category=electronics" className="bg-white text-teal-700 font-bold px-6 py-3 rounded-sm inline-block hover:bg-gray-100">
                Explore
              </Link>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-700 text-white p-8 rounded-lg">
              <h3 className="text-3xl font-black mb-2">Custom Gifts</h3>
              <p className="text-lg mb-4">Starting ₹99</p>
              <Link href="/products?category=custom" className="bg-white text-amber-700 font-bold px-6 py-3 rounded-sm inline-block hover:bg-gray-100">
                Create Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <FiTruck className="text-5xl text-primary mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-1">Free Delivery</h3>
              <p className="text-gray-600 text-sm">On orders above ₹499</p>
            </div>
            <div>
              <FiShield className="text-5xl text-primary mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-1">Secure Payments</h3>
              <p className="text-gray-600 text-sm">100% Protected</p>
            </div>
            <div>
              <FiRefreshCw className="text-5xl text-primary mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-1">Easy Returns</h3>
              <p className="text-gray-600 text-sm">7 Days Return Policy</p>
            </div>
            <div>
              <FiStar className="text-5xl text-primary mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-1">Best Quality</h3>
              <p className="text-gray-600 text-sm">Authentic Products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">RUTHAN</h3>
              <p className="text-sm mb-4">India's most trusted online shopping destination. Shop for electronics, fashion, home & more.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products?category=fashion" className="hover:text-white">Fashion</Link></li>
                <li><Link href="/products?category=electronics" className="hover:text-white">Electronics</Link></li>
                <li><Link href="/products?category=footwear" className="hover:text-white">Footwear</Link></li>
                <li><Link href="/products?category=accessories" className="hover:text-white">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/track" className="hover:text-white">Track Order</Link></li>
                <li><Link href="/returns" className="hover:text-white">Returns</Link></li>
                <li><Link href="/shipping" className="hover:text-white">Shipping</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>📞 +91 98765 43210</li>
                <li>📧 support@ruthan.com</li>
                <li>📍 Bangalore, India</li>
                <li>🕒 24/7 Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>© 2026 Ruthan. All rights reserved. | COD Available | 100% Authentic Products</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float */}
      <a
        href="https://wa.me/919876543210?text=Hi Ruthan! I need help"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all animate-pulse"
      >
        <FaWhatsapp className="text-3xl" />
      </a>
    </>
  );
}
