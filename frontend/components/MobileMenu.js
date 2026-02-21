import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX, FiHome, FiPackage, FiTruck, FiUser, FiHeart, FiShoppingBag } from 'react-icons/fi';

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { href: '/', label: 'Home', icon: FiHome },
        { href: '/products', label: 'All Products', icon: FiPackage },
        { href: '/categories/fashion', label: 'Fashion', icon: FiShoppingBag },
        { href: '/deals', label: 'Deals & Offers', icon: FiHeart },
        { href: '/track', label: 'Track Order', icon: FiTruck },
        { href: '/account', label: 'My Account', icon: FiUser },
    ];

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
            >
                {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="bg-gradient-primary p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-black text-white">RUTHAN</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                            aria-label="Close menu"
                        >
                            <FiX className="text-2xl" />
                        </button>
                    </div>
                    <p className="text-white/90 text-sm">The Shopping Spot</p>
                </div>

                {/* Menu Items */}
                <nav className="p-4 overflow-y-auto h-[calc(100%-200px)]">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors group"
                                    >
                                        <Icon className="text-xl text-blue-600 group-hover:scale-110 transition-transform" />
                                        <span className="font-medium text-gray-800 group-hover:text-blue-600">
                                            {item.label}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Categories */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <h3 className="px-4 text-sm font-bold text-gray-500 mb-3">CATEGORIES</h3>
                        <ul className="space-y-2">
                            {['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports'].map((category) => (
                                <li key={category}>
                                    <Link
                                        href={`/categories/${category.toLowerCase().replace(' & ', '-')}`}
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                                    >
                                        {category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-center text-sm text-gray-600">
                        <span className="font-bold">Need Help?</span>
                        <br />
                        <a href="tel:+919876543210" className="text-blue-600 hover:underline">
                            Call: +91 98765 43210
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
