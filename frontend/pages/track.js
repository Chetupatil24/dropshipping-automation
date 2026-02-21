import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { FiPackage, FiTruck, FiMapPin, FiCalendar, FiRefreshCw, FiCheckCircle, FiClock } from 'react-icons/fi';
import Footer from '../components/Footer';

export default function TrackOrder() {
    const router = useRouter();
    const [orderNumber, setOrderNumber] = useState('');
    const [tracking, setTracking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(false);

    useEffect(() => {
        // If order number in URL query, auto-fetch
        if (router.query.order) {
            setOrderNumber(router.query.order);
            fetchTracking(router.query.order);
        }
    }, [router.query]);

    useEffect(() => {
        let interval;
        if (autoRefresh && tracking) {
            // Auto-refresh every 60 seconds
            interval = setInterval(() => {
                fetchTracking(orderNumber, true);
            }, 60000);
        }
        return () => clearInterval(interval);
    }, [autoRefresh, tracking, orderNumber]);

    const fetchTracking = async (orderNum, silent = false) => {
        if (!orderNum) {
            toast.error('Please enter an order number');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tracking/public/${orderNum}`);
            const data = await response.json();

            if (data.success) {
                setTracking(data.data);
                if (!silent) {
                    toast.success('Tracking information loaded!');
                }
            } else {
                setTracking(null);
                toast.error(data.error || 'Order not found');
            }
        } catch (error) {
            console.error('Tracking error:', error);
            toast.error('Failed to fetch tracking information');
            setTracking(null);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <FiCheckCircle className="text-green-500" />;
            case 'shipped':
            case 'out_for_delivery': return <FiTruck className="text-purple-500" />;
            case 'processing': return <FiClock className="text-blue-500" />;
            default: return <FiPackage className="text-gray-500" />;
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            'pending': 'Order Placed',
            'processing': 'Processing',
            'shipped': 'Shipped',
            'out_for_delivery': 'Out for Delivery',
            'delivered': 'Delivered'
        };
        return statusMap[status] || status;
    };

    const getProgressPercentage = (status) => {
        const progress = {
            'pending': 25,
            'processing': 50,
            'shipped': 75,
            'out_for_delivery': 90,
            'delivered': 100
        };
        return progress[status] || 0;
    };

    return (
        <>
            <Head>
                <title>Track Your Order - Ruthan | The Shopping Spot</title>
                <meta name="description" content="Track your Ruthan order in real-time at The Shopping Spot" />
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white">
                {/* Header */}
                <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 shadow-lg py-6">
                    <div className="container mx-auto px-4">
                        <Link href="/" className="flex flex-col">
                            <span className="text-3xl font-extrabold text-white tracking-tight">RUTHAN</span>
                            <span className="text-xs text-purple-200 italic">The Shopping Spot</span>
                        </Link>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    {/* Page Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                            Track Your Order
                        </h1>
                        <p className="text-gray-600 text-lg">Enter your order number to see real-time tracking</p>
                    </div>

                    {/* Search Form */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && fetchTracking(orderNumber)}
                                placeholder="Enter your order number (e.g., ORD-12345)"
                                className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-lg"
                            />
                            <button
                                onClick={() => fetchTracking(orderNumber)}
                                disabled={loading}
                                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-4 rounded-full font-extrabold hover:from-purple-700 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center gap-2"
                           >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Tracking...
                                    </>
                                ) : (
                                    <>
                                        <FiPackage />
                                        Track Order
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Tracking Results */}
                    {tracking && (
                        <div className="space-y-6">
                            {/* Status Card */}
                            <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-2xl p-8 text-white shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-sm opacity-90">Order Number</p>
                                        <h2 className="text-3xl font-extrabold">{tracking.orderNumber}</h2>
                                    </div>
                                    <div className="text-6xl">
                                        {getStatusIcon(tracking.status)}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-2xl font-bold">{getStatusText(tracking.status)}</span>
                                        <button
                                            onClick={() => {
                                                fetchTracking(orderNumber, true);
                                                toast.success('Refreshed!');
                                            }}
                                            className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 transition-all"
                                       >
                                            <FiRefreshCw className="text-xl" />
                                        </button>
                                    </div>
                                    <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-white h-full transition-all duration-500"
                                            style={{ width: `${getProgressPercentage(tracking.status)}%` }}
                                       ></div>
                                    </div>
                                </div>

                                {/* Quick Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    {tracking.trackingNumber && (
                                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                                            <p className="text-sm opacity-90 mb-1">Tracking Number</p>
                                            <p className="font-bold text-lg">{tracking.trackingNumber}</p>
                                        </div>
                                    )}
                                    {tracking.carrier && (
                                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                                            <p className="text-sm opacity-90 mb-1">Carrier</p>
                                            <p className="font-bold text-lg">{tracking.carrier}</p>
                                        </div>
                                    )}
                                    {tracking.currentLocation && (
                                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 col-span-2">
                                            <p className="text-sm opacity-90 mb-1 flex items-center gap-2">
                                                <FiMapPin /> Current Location
                                            </p>
                                            <p className="font-bold text-lg">{tracking.currentLocation}</p>
                                        </div>
                                    )}
                                    {tracking.estimatedDelivery && (
                                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 col-span-2">
                                            <p className="text-sm opacity-90 mb-1 flex items-center gap-2">
                                                <FiCalendar /> Estimated Delivery
                                            </p>
                                            <p className="font-bold text-lg">
                                                {new Date(tracking.estimatedDelivery).toLocaleDateString('en-IN', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* External Tracking Link */}
                                {tracking.trackingUrl && (
                                    <div className="mt-6">
                                        <a
                                            href={tracking.trackingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full block text-center bg-white text-purple-600 px-6 py-3 rounded-full font-bold hover:scale-105 transition-all"
                                       >
                                            Track on {tracking.carrier} Website →
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Auto Refresh Toggle */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="font-bold text-gray-800">Auto-refresh every 60 seconds</span>
                                    <input
                                        type="checkbox"
                                        checked={autoRefresh}
                                        onChange={(e) => setAutoRefresh(e.target.checked)}
                                        className="w-12 h-6 appearance-none bg-gray-300 rounded-full relative cursor-pointer transition-colors checked:bg-purple-600"
                                    />
                                </label>
                            </div>

                            {/* Timeline */}
                            {tracking.history && tracking.history.length> 0 && (
                                <div className="bg-white rounded-2xl shadow-lg p-8">
                                    <h3 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
                                        <FiTruck className="text-purple-600" />
                                        Tracking Timeline
                                    </h3>
                                    <div className="space-y-4">
                                        {tracking.history.map((event, index) => (
                                            <div key={index} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                                                    {index <tracking.history.length - 1 && (
                                                        <div className="w-0.5 h-full bg-gray-200 my-1"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-6">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="font-bold text-gray-800">{event.description}</p>
                                                            {event.location && (
                                                                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                                                    <FiMapPin className="text-xs" />
                                                                    {event.location}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(event.timestamp).toLocaleString('en-IN')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <Footer />
            </div>

            <style jsx>{`
        input[type="checkbox"]:checked::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          top: 2px;
          right: 2px;
          transition: all 0.3s;
        }
        input[type="checkbox"]::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          top: 2px;
          left: 2px;
          transition: all 0.3s;
        }
      `}</style>
        </>
    );
}
