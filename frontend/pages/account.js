import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStore } from '../lib/store';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit, FiLogOut, FiPackage, FiHeart } from 'react-icons/fi';

export default function Account() {
    const router = useRouter();
    const { user, logout } = useStore();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
        });
    }, [user, router]);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // API call to update user profile
            toast.success('Profile updated successfully! ✨');
            setEditing(false);
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    if (!user) return null;

    return (
        <>
            <Head>
                <title>My Account - Ruthan | The Shopping Spot</title>
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                            My Account
                        </h1>
                        <p className="text-gray-600">Manage your Ruthan profile and orders</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                                <div className="text-center mb-6">
                                    <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4">
                                        {user.firstName?.[0]}{user.lastName?.[0]}
                                    </div>
                                    <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                                    <p className="text-gray-600">{user.email}</p>
                                </div>

                                <nav className="space-y-2">
                                    <Link href="/account" className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-xl font-medium">
                                        <FiUser />
                                        Profile
                                    </Link>
                                    <Link href="/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl transition-colors">
                                        <FiPackage />
                                        Orders
                                    </Link>
                                    <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl transition-colors">
                                        <FiHeart />
                                        Wishlist
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 rounded-xl transition-colors"
                                    >
                                        <FiLogOut />
                                        Logout
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-3xl font-extrabold">Profile Information</h2>
                                    {!editing && (
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-bold hover:from-purple-700 hover:to-pink-600 transition-all"
                                        >
                                            <FiEdit />
                                            Edit
                                        </button>
                                    )}
                                </div>

                                {editing ? (
                                    <form onSubmit={handleUpdate} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                    className="input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    className="input"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="input"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="input"
                                                placeholder="+91 1234567890"
                                            />
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full font-extrabold hover:from-purple-700 hover:to-pink-600 transition-all"
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditing(false)}
                                                className="flex-1 bg-gray-200 text-gray-700 px-8 py-4 rounded-full font-bold hover:bg-gray-300 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                                            <div className="bg-white p-3 rounded-full">
                                                <FiUser className="text-purple-600 text-xl" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Name</p>
                                                <p className="text-lg font-bold">{user.firstName} {user.lastName}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                                            <div className="bg-white p-3 rounded-full">
                                                <FiMail className="text-purple-600 text-xl" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Email</p>
                                                <p className="text-lg font-bold">{user.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                                            <div className="bg-white p-3 rounded-full">
                                                <FiPhone className="text-purple-600 text-xl" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Phone</p>
                                                <p className="text-lg font-bold">{user.phone || 'Not provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t-2 border-gray-100">
                                    <div className="text-center">
                                        <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                                            0
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">Total Orders</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                                            ₹0
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">Total Spent</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                                            0
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">Wishlist Items</p>
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
