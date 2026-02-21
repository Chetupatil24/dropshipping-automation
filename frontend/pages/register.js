import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { authAPI } from '../lib/api';
import { useStore } from '../lib/store';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';

export default function Register() {
    const router = useRouter();
    const { setUser } = useStore();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { data } = await authAPI.register(formData);
            setUser(data.user, data.token);
            toast.success('Welcome to Ruthan! 🎉');
            router.push('/');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Create Account - Ruthan | The Shopping Spot</title>
            </Head>

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-purple-900 py-12 px-4 relative overflow-hidden">
                {/* Animated background orbs */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-20 right-20 w-72 h-72 bg-teal-300/20 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-md w-full relative z-10">
                    {/* Card */}
                    <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-10">
                        {/* Logo */}
                        <div className="text-center mb-8">
                            <Link href="/" className="inline-block">
                                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
                                    <span className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-blue-700 to-purple-900 bg-clip-text text-transparent">
                                        RUTHAN
                                    </span>
                                    <span className="text-sm text-gray-500 italic">The Shopping Spot</span>
                                </h1>
                            </Link>
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                                Create Account
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Join Ruthan today and start shopping!
                            </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* Name Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FiMail className="text-blue-600 text-xl" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="ruthanshoppingspot@gmail.com"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FiLock className="text-blue-600 text-xl" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FiLock className="text-blue-600 text-xl" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-full font-extrabold text-lg hover:from-teal-600 hover:to-secondary transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
                            >
                                {loading ? 'Creating Account...' : (
                                    <>
                                        Create Account <FiArrowRight />
                                    </>
                                )}
                            </button>

                            {/* Login Link */}
                            <div className="text-center mt-6">
                                <p className="text-gray-600">
                                    Already have an account?{' '}
                                    <Link href="/login" className="font-bold text-blue-700 hover:text-teal-500 transition-colors">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-8 flex justify-center gap-6 text-white text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🎉</span>
                            <span>Free to Join</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🚀</span>
                            <span>Fast Shipping</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
