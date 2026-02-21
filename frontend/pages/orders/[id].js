import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStore } from '../../lib/store';
import { ordersAPI } from '../../lib/api';
import { toast } from 'react-hot-toast';
import { FiPackage, FiTruck, FiCheckCircle, FiMapPin, FiCalendar, FiCreditCard, FiDownload } from 'react-icons/fi';

export default function OrderDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { user } = useStore();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (id) {
            fetchOrder();
        }
    }, [user, id, router]);

    const fetchOrder = async () => {
        try {
            const { data } = await ordersAPI.getById(id);
            setOrder(data);
        } catch (error) {
            toast.error('Order not found');
            router.push('/orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusSteps = (currentStatus) => {
        const steps = [
            { key: 'pending', label: 'Order Placed', icon: FiPackage },
            { key: 'processing', label: 'Processing', icon: FiPackage },
            { key: 'shipped', label: 'Shipped', icon: FiTruck },
            { key: 'delivered', label: 'Delivered', icon: FiCheckCircle }
        ];

        const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
        const currentIndex = statusOrder.indexOf(currentStatus);

        return steps.map((step, index) => ({
            ...step,
            completed: index <= currentIndex,
            active: index === currentIndex
        }));
    };

    if (!user || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) return null;

    const steps = getStatusSteps(order.status);

    return (
        <>
            <Head>
                <title>Order #{order.id} - Ruthan</title>
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/orders" className="text-purple-600 hover:text-purple-700 mb-4 inline-flex items-center gap-2">
                            ← Back to Orders
                        </Link>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                                    Order #{order.id}
                                </h1>
                                <p className="text-gray-600">
                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-purple-200 text-purple-600 rounded-full font-bold hover:bg-purple-50 transition-all">
                                <FiDownload />
                                Invoice
                            </button>
                        </div>
                    </div>

                    {/* Order Status Timeline */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <h2 className="text-2xl font-extrabold mb-8">Order Status</h2>
                        <div className="relative">
                            {/* Progress Line */}
                            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-500"
                                    style={{ width: `${(steps.filter(s => s.completed).length - 1) * 33.33}%` }}
                                ></div>
                            </div>

                            {/* Steps */}
                            <div className="relative grid grid-cols-4 gap-4">
                                {steps.map((step, index) => (
                                    <div key={step.key} className="flex flex-col items-center">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${step.completed
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white scale-110'
                                                : 'bg-gray-200 text-gray-400'
                                            }`}>
                                            <step.icon className="text-xl" />
                                        </div>
                                        <p className={`text-sm font-bold text-center ${step.completed ? 'text-purple-600' : 'text-gray-400'
                                            }`}>
                                            {step.label}
                                        </p>
                                        {step.completed && step.key === order.status && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tracking Number */}
                        {order.trackingNumber && (
                            <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                                        <p className="text-2xl font-extrabold text-yellow-900 tracking-wider">{order.trackingNumber}</p>
                                    </div>
                                    <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-bold hover:from-purple-700 hover:to-pink-600 transition-all">
                                        Track Package
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Order Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl font-extrabold mb-6">Order Items</h2>
                                <div className="space-y-4">
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                                            <div className="w-24 h-24 bg-white rounded-xl overflow-hidden">
                                                {item.product?.images?.[0] && (
                                                    <img
                                                        src={item.product.images[0]}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg line-clamp-2">{item.product?.name}</h3>
                                                <p className="text-gray-600">Quantity: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">Price</p>
                                                <p className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                                                    ₹{item.price}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary & Details */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Summary */}
                            <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-2xl p-6 shadow-2xl text-white">
                                <h2 className="text-2xl font-extrabold mb-4">Order Summary</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span className="font-bold">₹{order.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping:</span>
                                        <span className="font-bold">{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax:</span>
                                        <span className="font-bold">₹{order.tax}</span>
                                    </div>
                                    <div className="border-t-2 border-white/30 pt-3 flex justify-between text-xl font-extrabold">
                                        <span>Total:</span>
                                        <span>₹{order.total}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-2 rounded-full">
                                        <FiMapPin className="text-white text-xl" />
                                    </div>
                                    <h3 className="text-xl font-extrabold">Shipping Address</h3>
                                </div>
                                <div className="text-gray-700 leading-relaxed">
                                    <p className="font-bold">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                                    <p>{order.shippingAddress?.address}</p>
                                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
                                    <p className="mt-2">📱 {order.shippingAddress?.phone}</p>
                                    <p>📧 {order.shippingAddress?.email}</p>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-2 rounded-full">
                                        <FiCreditCard className="text-white text-xl" />
                                    </div>
                                    <h3 className="text-xl font-extrabold">Payment Method</h3>
                                </div>
                                <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                                    <span className="font-bold capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
