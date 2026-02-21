import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStore } from '../lib/store';
import { paymentsAPI } from '../lib/api';
import { toast } from 'react-hot-toast';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

export default function Cart() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart, user } = useStore();
  const [processing, setProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to checkout');
      router.push('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    router.push('/checkout');
  };

  if (cart.length === 0) {
    return (
      <>
        <Head>
          <title>Shopping Cart - Ruthan</title>
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-white">
          <div className="container mx-auto px-4 py-20">
            <div className="text-center max-w-xl mx-auto">
              <div className="mb-8">
                <FiShoppingBag className="text-8xl text-gray-300 mx-auto mb-6" />
              </div>
              <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Your Cart is Empty
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Looks like you haven't added anything to your cart yet. Start shopping now!
              </p>
              <Link href="/" className="inline-block bg-gradient-to-r from-secondary to-teal-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-teal-600 hover:to-secondary transition-all hover:scale-105 shadow-2xl">
                Start Shopping 🛍️
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal >= 1000 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <>
      <Head>
        <title>Shopping Cart - Ruthan | The Shopping Spot</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Shopping Cart
          </h1>
          <p className="text-gray-600 mb-8">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-200">
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex-shrink-0 overflow-hidden">
                      {item.images && item.images[0] && (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      )}
                    </div>

                    <div className="flex-1">
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-bold text-xl hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-teal-600 transition-all"
                      >
                        {item.name}
                      </Link>
                      <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mt-2">
                        ₹{item.price}
                      </p>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-purple-200 rounded-full overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-4 py-2 hover:bg-purple-100 transition-colors font-bold text-purple-600"
                        >
                          -
                        </button>
                        <span className="px-6 py-2 font-bold text-purple-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-4 py-2 hover:bg-purple-100 transition-colors font-bold text-purple-600"
                        >
                          +
                        </button>
                      </div>

                      <div className="font-extrabold text-2xl w-28 text-right bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                        ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 hover:scale-125 transition-transform p-2"
                      >
                        <FiTrash2 size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-900 rounded-2xl p-8 shadow-2xl sticky top-4 text-white">
                <h2 className="text-3xl font-extrabold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal:</span>
                    <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Shipping:</span>
                    <span className="font-bold">{shipping === 0 ? '🎉 FREE' : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Tax (18% GST):</span>
                    <span className="font-bold">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-white/30 pt-4 flex justify-between font-extrabold text-2xl">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal < 1000 && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6 text-sm">
                    <p className="font-medium">
                      💡 Add <span className="font-extrabold">₹{(1000 - subtotal).toFixed(2)}</span> more for FREE shipping!
                    </p>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-secondary to-teal-600 text-white px-8 py-4 rounded-full font-extrabold text-lg hover:from-teal-600 hover:to-secondary transition-all hover:scale-105 shadow-lg mb-4 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <FiArrowRight />
                </button>

                <Link href="/" className="block w-full bg-white/20 backdrop-blur-sm text-white text-center px-8 py-3 rounded-full font-bold hover:bg-white/30 transition-all">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
