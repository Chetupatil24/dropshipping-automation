import Head from 'next/head';
import Link from 'next/link';
import { FiHome, FiSearch } from 'react-icons/fi';

export default function Custom404() {
    return (
        <>
            <Head>
                <title>Page Not Found - Ruthan | The Shopping Spot</title>
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white flex items-center justify-center px-4">
                <div className="text-center max-w-2xl">
                    {/* Animated 404 */}
                    <div className="mb-8 relative">
                        <div className="absolute inset-0 blur-3xl opacity-30">
                            <div className="w-64 h-64 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full mx-auto animate-pulse"></div>
                        </div>
                        <h1 className="text-9xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent relative animate-float">
                            404
                        </h1>
                    </div>

                    {/* Message */}
                    <h2 className="text-4xl font-extrabold mb-4 text-gray-800">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        The page you're looking for seems to have wandered off.
                        <br />Don't worry, our best products are still waiting for you!
                    </p>

                    {/* Actions */}
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-extrabold hover:from-purple-700 hover:to-pink-600 transition-all hover:scale-105 shadow-2xl"
                        >
                            <FiHome />
                            Go Home
                        </Link>
                        <Link
                            href="/products"
                            className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-purple-200 text-purple-600 rounded-full font-bold hover:bg-purple-50 transition-all"
                        >
                            <FiSearch />
                            Browse Products
                        </Link>
                    </div>

                    {/* Decorative Elements */}
                    <div className="mt-16 grid grid-cols-3 gap-4 text-center">
                        <div className="p-6 bg-white rounded-2xl shadow-lg">
                            <div className="text-3xl mb-2">🛍️</div>
                            <p className="font-bold text-purple-600">Premium Fashion</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl shadow-lg">
                            <div className="text-3xl mb-2">🚚</div>
                            <p className="font-bold text-pink-600">Fast Delivery</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl shadow-lg">
                            <div className="text-3xl mb-2">💰</div>
                            <p className="font-bold text-orange-600">COD Available</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
        </>
    );
}
