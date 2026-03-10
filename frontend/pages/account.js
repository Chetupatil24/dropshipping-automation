import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStore } from '../lib/store';
import { authAPI } from '../lib/api';
import { toast } from 'react-hot-toast';

const TABS = [
  { id: 'profile', label: 'Profile', icon: 'person' },
  { id: 'orders', label: 'My Orders', icon: 'package_2' },
  { id: 'wishlist', label: 'Wishlist', icon: 'favorite' },
  { id: 'security', label: 'Security', icon: 'shield' },
];

const toINR = (usd) => Math.round(parseFloat(usd || 0) * 83 * 1.45);

export default function AccountPage() {
  const router = useRouter();
  const { user, token, setUser, logout, wishlist = [], getCartCount } = useStore();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const cartCount = getCartCount();

  useEffect(() => {
    if (!token) { router.push('/login?redirect=/account'); return; }
    if (user) setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
  }, [user, token]);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(form);
      setUser(res.data.user || { ...user, ...form }, token);
      localStorage.setItem('user', JSON.stringify(res.data.user || { ...user, ...form }));
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out');
    router.push('/');
  };

  if (!user) return (
    <div className="min-h-screen bg-background-light flex items-center justify-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
    </div>
  );

  return (
    <>
      <Head><title>My Account | RUTHAN</title></Head>
      <div className="min-h-screen bg-background-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <nav className="hidden md:flex gap-6 text-sm font-semibold">
              <Link href="/products" className="hover:text-primary transition-colors text-slate-700 no-underline">Shop</Link>
              <Link href="/orders" className="hover:text-primary transition-colors text-slate-700 no-underline">Orders</Link>
            </nav>
            <Link href="/" className="text-2xl font-extrabold tracking-tighter no-underline" style={{ color: '#4169e1' }}>RUTHAN</Link>
            <div className="flex items-center gap-4">
              <Link href="/cart" className="relative no-underline">
                <span className="material-symbols-outlined text-slate-700 hover:text-primary transition-colors select-none">shopping_bag</span>
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-10">
          {/* Profile hero */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 mb-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white flex-shrink-0" style={{ backgroundColor: '#4169e1' }}>
              {(user.name || user.email || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-extrabold text-slate-900">{user.name || 'My Account'}</h1>
              <p className="text-slate-500 text-sm mt-1">{user.email}</p>
              {user.createdAt && <p className="text-xs text-slate-400 mt-1">Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>}
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 transition-all">
              <span className="material-symbols-outlined text-sm select-none">logout</span> Logout
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${tab === t.id ? 'text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
                style={tab === t.id ? { backgroundColor: '#4169e1' } : {}}>
                <span className={`material-symbols-outlined text-sm select-none ${tab === t.id ? 'fill-1' : ''}`}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">

            {/* Profile */}
            {tab === 'profile' && (
              <div>
                <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-primary select-none">person</span> Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[['name','Full Name','text','badge'],['email','Email Address','email','mail'],['phone','Phone Number','tel','call']].map(([name, label, type, icon]) => (
                    <div key={name} className={name === 'email' ? 'sm:col-span-2' : ''}>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{label}</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm select-none">{icon}</span>
                        <input name={name} type={type} value={form[name]} onChange={e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))}
                          className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all bg-white" />
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={saveProfile} disabled={saving}
                  className="mt-8 px-8 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
                  style={{ backgroundColor: '#4169e1' }}>
                  {saving ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <span className="material-symbols-outlined text-sm select-none">save</span>}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}

            {/* Orders */}
            {tab === 'orders' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-extrabold flex items-center gap-2"><span className="material-symbols-outlined text-primary select-none">package_2</span> My Orders</h2>
                  <Link href="/orders" className="text-sm font-bold no-underline" style={{ color: '#4169e1' }}>View All</Link>
                </div>
                <div className="flex flex-col items-center py-10 text-center text-slate-400">
                  <span className="material-symbols-outlined text-5xl mb-3 select-none">package_2</span>
                  <p className="font-semibold">View your complete order history</p>
                  <Link href="/orders" className="mt-4 px-6 py-2.5 rounded-xl font-bold text-white no-underline hover:opacity-90 transition" style={{ backgroundColor: '#4169e1' }}>Go to Orders</Link>
                </div>
              </div>
            )}

            {/* Wishlist */}
            {tab === 'wishlist' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-extrabold flex items-center gap-2"><span className="material-symbols-outlined text-primary select-none fill-1">favorite</span> My Wishlist</h2>
                  <span className="text-slate-400 text-sm font-medium">{wishlist.length} items</span>
                </div>
                {wishlist.length === 0 ? (
                  <div className="flex flex-col items-center py-10 text-center text-slate-400">
                    <span className="material-symbols-outlined text-5xl mb-3 select-none">favorite</span>
                    <p className="font-semibold">Your wishlist is empty</p>
                    <Link href="/products" className="mt-4 px-6 py-2.5 rounded-xl font-bold text-white no-underline hover:opacity-90 transition" style={{ backgroundColor: '#4169e1' }}>Discover Products</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlist.slice(0, 6).map(item => {
                      const img = Array.isArray(item.images) ? item.images[0] : (item.imageUrl || item.image || '');
                      return (
                        <Link key={item.id} href={`/products/${item.slug || item.id}`} className="group flex gap-3 p-3 rounded-xl border border-slate-100 hover:border-primary transition-all no-underline">
                          <div className="w-12 h-14 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                            <img src={img || 'https://placehold.co/48x56?text=+'} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-primary transition-colors">{item.name}</p>
                            <p className="text-xs font-extrabold mt-1" style={{ color: '#4169e1' }}>₹{toINR(item.price).toLocaleString('en-IN')}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Security */}
            {tab === 'security' && (
              <div>
                <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-primary select-none">shield</span> Security Settings</h2>
                <div className="space-y-4">
                  {[['current','Current Password','lock'],['next','New Password','lock_reset'],['confirm','Confirm New Password','verified']].map(([name, label, icon]) => (
                    <div key={name}>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{label}</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm select-none">{icon}</span>
                        <input name={name} type="password" value={passwords[name]} onChange={e => setPasswords(p => ({ ...p, [e.target.name]: e.target.value }))}
                          className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all bg-white" />
                      </div>
                    </div>
                  ))}
                  <button className="mt-4 px-8 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 flex items-center gap-2" style={{ backgroundColor: '#4169e1' }}>
                    <span className="material-symbols-outlined text-sm select-none">lock</span> Update Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 flex items-center justify-around px-4 py-3 z-50">
          <Link href="/" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">home</span><span className="text-[10px] font-bold">Home</span></Link>
          <Link href="/products" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">search</span><span className="text-[10px] font-bold">Shop</span></Link>
          <Link href="/wishlist" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">favorite</span><span className="text-[10px] font-bold">Wishlist</span></Link>
          <Link href="/orders" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">package_2</span><span className="text-[10px] font-bold">Orders</span></Link>
          <Link href="/account" className="flex flex-col items-center gap-0.5 text-primary no-underline"><span className="material-symbols-outlined select-none fill-1">person</span><span className="text-[10px] font-bold">Profile</span></Link>
        </nav>
      </div>
    </>
  );
}
