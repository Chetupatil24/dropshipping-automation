import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStore } from '../lib/store';
import { ordersAPI } from '../lib/api';
import { toast } from 'react-hot-toast';
import { FiLock, FiTruck, FiCreditCard, FiMapPin } from 'react-icons/fi';

export default function Checkout() {
    const router = useRouter();
    const { cart, getCartTotal, clearCart, user } = useStore();
    const [isClient, setIsClient] = useState(false);

    const [formData, setFormData] = useState({
        // Shipping
        shippingAddress: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
        },
        // Payment
        paymentMethod: 'razorpay', // 'razorpay' or 'cod'
    });

    const [loading, setLoading] = useState(false);

    // Client-side only rendering and redirects
    useEffect(() => {
        setIsClient(true);

        if (!user) {
            router.push('/login');
            return;
        }

        if (cart.length === 0) {
            router.push('/cart');
            return;
        }

        // Pre-fill user data
        setFormData(prev => ({
            ...prev,
            shippingAddress: {
                ...prev.shippingAddress,
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
            }
        }));
    }, [user, cart, router]);

    // Show loading during SSR or redirect
    if (!isClient || !user || cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Loading checkout...</p>
                </div>
            </div>
        );
    }

    const subtotal = getCartTotal();
    const shipping = subtotal >= 1000 ? 0 : 50;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            shippingAddress: {
                ...formData.shippingAddress,
                [name]: value,
            },
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                shippingAddress: formData.shippingAddress,
                paymentMethod: formData.paymentMethod,
                total,
            };

            const { data } = await ordersAPI.create(orderData);

            if (formData.paymentMethod === 'razorpay') {
                // Initialize Razorpay payment
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: total * 100, // Convert to paise
                    currency: 'INR',
                    name: 'Ruthan',
                    description: 'Order Payment',
                    order_id: data.razorpayOrderId,
                    handler: async (response) => {
                        await ordersAPI.confirmPayment(data.id, response);
                        clearCart();
                        toast.success('Order placed successfully! 🎉');
                        router.push(`/orders/${data.id}`);
                    },
                    prefill: {
                        name: `${formData.shippingAddress.firstName} ${formData.shippingAddress.lastName}`,
                        email: formData.shippingAddress.email,
                        contact: formData.shippingAddress.phone,
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                // COD order
                clearCart();
                toast.success('Order placed! Pay on delivery 💰');
                router.push(`/orders/${data.id}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Checkout - Ruthan | The Shopping Spot</title>
                <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent text-center">
                        Secure Checkout
                    </h1>
                    <p className="text-gray-600 mb-12 text-center">Complete your order in just a few steps</p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Shipping Address */}
                                <div className="bg-white rounded-2xl shadow-lg p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-3 rounded-full">
                                            <FiMapPin className="text-white text-2xl" />
                                        </div>
                                        <h2 className="text-2xl font-extrabold">Shipping Address</h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                required
                                                value={formData.shippingAddress.firstName}
                                                onChange={handleChange}
                                                className="input"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                required
                                                value={formData.shippingAddress.lastName}
                                                onChange={handleChange}
                                                className="input"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.shippingAddress.email}
                                                onChange={handleChange}
                                                className="input"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={formData.shippingAddress.phone}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="+91 1234567890"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                                            <textarea
                                                name="address"
                                                required
                                                value={formData.shippingAddress.address}
                                                onChange={handleChange}
                                                className="input"
                                                rows="3"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                required
                                                value={formData.shippingAddress.city}
                                                onChange={handleChange}
                                                className="input"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                required
                                                value={formData.shippingAddress.state}
                                                onChange={handleChange}
                                                className="input"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Pincode</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                required
                                                value={formData.shippingAddress.pincode}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="400001"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-white rounded-2xl shadow-lg p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-3 rounded-full">
                                            <FiCreditCard className="text-white text-2xl" />
                                        </div>
                                        <h2 className="text-2xl font-extrabold">Payment Method</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl cursor-pointer hover:bg-purple-50 transition-colors">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="razorpay"
                                                checked={formData.paymentMethod === 'razorpay'}
                                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                                className="mr-4"
                                            />
                                            <div>
                                                <p className="font-bold">Online Payment (UPI, Card, Netbanking)</p>
                                                <p className="text-sm text-gray-600">Secure payment via Razorpay</p>
                                            </div>
                                        </label>

                                        <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl cursor-pointer hover:bg-purple-50 transition-colors">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={formData.paymentMethod === 'cod'}
                                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                                className="mr-4"
                                            />
                                            <div>
                                                <p className="font-bold">Cash on Delivery (COD) 💰</p>
                                                <p className="text-sm text-gray-600">Pay when you receive your order</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-5 rounded-full font-extrabold text-xl hover:from-purple-700 hover:to-pink-600 transition-all hover:scale-105 shadow-2xl disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <FiLock />
                                    {loading ? 'Processing...' : `Place Order - ₹${total.toFixed(2)}`}
                                </button>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-2xl p-8 shadow-2xl sticky top-4 text-white">
                                <h2 className="text-3xl font-extrabold mb-6">Order Summary</h2>

                                {/* Cart Items */}
                                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-xl p-3">
                                            <div className="w-16 h-16 bg-white/30 rounded-lg overflow-hidden">
                                                {item.images?.[0] && (
                                                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-sm">{item.name}</p>
                                                <p className="text-xs">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Pricing */}
                                <div className="space-y-3 mb-6 border-t border-white/30 pt-6">
                                    <div className="flex justify-between text-lg">
                                        <span>Subtotal:</span>
                                        <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg">
                                        <span>Shipping:</span>
                                        <span className="font-bold">{shipping === 0 ? '🎉 FREE' : `₹${shipping}`}</span>
                                    </div>
                                    <div className="flex justify-between text-lg">
                                        <span>Tax (18% GST):</span>
                                        <span className="font-bold">₹{tax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t-2 border-white/50 pt-3 flex justify-between font-extrabold text-2xl">
                                        <span>Total:</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Trust Badges */}
                                <div className="space-y-2 text-sm bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                    <div className="flex items-center gap-2">
                                        <FiLock />
                                        <span>100% Secure Payment</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiTruck />
                                        <span>Fast Delivery Across India</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
