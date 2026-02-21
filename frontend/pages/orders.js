import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStore } from '../lib/store';
import { ordersAPI } from '../lib/api';
import { toast } from 'react-hot-toast';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiArrowRight } from 'react-icons/fi';

export default function Orders() {
    const router = useRouter();
    const { user } = useStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, shipped, delivered

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchOrders();
    }, [user, router]);

    const fetchOrders = async () => {
        try {
            const { data } = await ordersAPI.getMyOrders();
            setOrders(data);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <FiClock className="text-yellow-500" />;
            case 'processing': return <FiPackage className="text-blue-500" />;
            case 'shipped': return <FiTruck className="text-blue-600" />;
            case 'delivered': return <FiCheckCircle className="text-green-500" />;
            case 'cancelled': return <FiXCircle className="text-red-500" />;
            default: return <FiPackage className="text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        return order.status === filter;
    });

    if (!user) return null;

    return (
        <>
            <Head>
                <title>My Orders - Ruthan | The Shopping Spot</title>
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header */}
                    <div className="mb-12">
                        <Link href="/account" className="text-blue-700 hover:text-purple-700 mb-4 inline-flex items-center gap-2">
                            ← Back to Account
                        </Link>
                        <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                            My Orders
                        </h1>
                        <p className="text-gray-600">Track and manage your Ruthan orders</p>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                        {[
                            { key: 'all', label: 'All Orders' },
                            { key: 'pending', label: 'Pending' },
                            { key: 'shipped', label: 'Shipped' },
                            { key: 'delivered', label: 'Delivered' }
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${filter === key
                                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Orders List */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading your orders...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiPackage className="text-6xl text-blue-700" />
                            </div>
                            <h2 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                                No Orders Yet
                            </h2>
                            <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
                            <Link href="/" className="inline-block bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-full font-bold hover:from-teal-600 hover:to-secondary transition-all">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredOrders.map((order) => (
                                <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-200">
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <p className="text-sm text-gray-600">Order #{order.id}</p>
                                                <p className="font-bold text-lg">
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span className="capitalize">{order.status}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Total</p>
                                            <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                                                ₹{order.total}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {/* Order Items */}
                                        <div className="space-y-4 mb-6">
                                            {order.items?.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4">
                                                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl overflow-hidden">
                                                        {item.product?.images?.[0] && (
                                                            <img
                                                                src={item.product.images[0]}
                                                                alt={item.product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold line-clamp-1">{item.product?.name}</h4>
                                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                    </div>
                                                    <p className="font-bold">₹{item.price}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Tracking */}
                                        {order.trackingNumber && (
                                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
                                                <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                                                <p className="font-bold text-lg text-yellow-900 tracking-wider">{order.trackingNumber}</p>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-4">
                                            <Link
                                                href={`/orders/${order.id}`}
                                                className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-full font-bold hover:from-teal-600 hover:to-secondary transition-all text-center flex items-center justify-center gap-2"
                                            >
                                                View Details
                                                <FiArrowRight />
                                            </Link>
                                            {order.status === 'delivered' && (
                                                <button className="px-6 py-3 border-2 border-purple-200 text-blue-700 rounded-full font-bold hover:bg-purple-50 transition-all">
                                                    Reorder
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
