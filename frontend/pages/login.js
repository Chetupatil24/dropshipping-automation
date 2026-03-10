import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { authAPI } from '../lib/api';
import { useStore } from '../lib/store';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      const { user, token } = res.data;
      setUser(user, token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success(`Welcome back, ${user.name || user.email}!`);
      router.push(router.query.redirect || '/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Head><title>Sign In | RUTHAN</title></Head>
      <div className="min-h-screen bg-background-light flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {/* Header */}
        <header className="bg-white border-b border-slate-100 py-5 px-6 flex justify-center">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter no-underline" style={{ color: '#4169e1' }}>RUTHAN</Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[420px]">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10">
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(65,105,225,0.08)' }}>
                  <span className="material-symbols-outlined text-3xl select-none" style={{ color: '#4169e1' }}>person</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900">Welcome Back</h1>
                <p className="text-slate-500 text-sm mt-1">Sign in to your RUTHAN account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm select-none">mail</span>
                    <input
                      name="email" type="email" value={form.email} onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all bg-white"
                      style={{ '--tw-ring-color': '#4169e1' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm select-none">lock</span>
                    <input
                      name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange}
                      placeholder="Your password"
                      className="w-full border border-slate-200 rounded-xl pl-11 pr-12 py-3 text-sm font-medium outline-none transition-all bg-white"
                    />
                    <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      <span className="material-symbols-outlined text-sm select-none">{showPass ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Link href="/forgot-password" className="text-xs font-bold no-underline hover:opacity-80 transition-opacity" style={{ color: '#4169e1' }}>Forgot Password?</Link>
                  </div>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-white text-sm tracking-wide transition-all hover:opacity-90 shadow disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#4169e1' }}
                >
                  {loading ? <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <span className="material-symbols-outlined text-sm select-none">login</span>}
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                  Don't have an account?{' '}
                  <Link href="/register" className="font-bold no-underline" style={{ color: '#4169e1' }}>Create one</Link>
                </p>
              </div>
            </div>

            <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-xs select-none">verified_user</span>
              Secured with 256-bit SSL encryption
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
