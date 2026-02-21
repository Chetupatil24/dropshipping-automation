import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white mt-20">
            {/* Newsletter Section */}
            <div className="bg-gradient-primary py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl md:text-3xl font-bold mb-2">
                                Subscribe to Our Newsletter
                            </h3>
                            <p className="text-blue-100">
                                Get exclusive deals, new arrivals, and fashion tips directly to your inbox
                            </p>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-6 py-3 rounded-lg flex-1 md:w-80 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                            />
                            <button className="bg-amber-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-600 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* About */}
                    <div>
                        <h3 className="text-2xl font-black mb-4 text-gradient bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
                            RUTHAN
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">The Shopping Spot</p>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Your trusted destination for quality products, great prices, and exceptional service.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="bg-gray-800 p-2.5 rounded-lg hover:bg-blue-600 transition-colors" aria-label="Facebook">
                                <FaFacebookF />
                            </a>
                            <a href="#" className="bg-gray-800 p-2.5 rounded-lg hover:bg-blue-400 transition-colors" aria-label="Twitter">
                                <FaTwitter />
                            </a>
                            <a href="#" className="bg-gray-800 p-2.5 rounded-lg hover:bg-pink-600 transition-colors" aria-label="Instagram">
                                <FaInstagram />
                            </a>
                            <a href="#" className="bg-gray-800 p-2.5 rounded-lg hover:bg-blue-700 transition-colors" aria-label="LinkedIn">
                                <FaLinkedinIn />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="font-bold mb-4 text-lg">Customer Service</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/track" className="hover:text-white transition-colors">Track Order</Link></li>
                            <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold mb-4 text-lg">Contact Us</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex items-start gap-3">
                                <FiMail className="text-blue-400 mt-1 flex-shrink-0" />
                                <a href="mailto:support@ruthan.com" className="hover:text-white transition-colors">
                                    support@ruthan.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <FiPhone className="text-blue-400 mt-1 flex-shrink-0" />
                                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                                    +91 98765 43210
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <FiMapPin className="text-blue-400 mt-1 flex-shrink-0" />
                                <span>Bangalore, Karnataka, India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                    <p>© {currentYear} Ruthan. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
