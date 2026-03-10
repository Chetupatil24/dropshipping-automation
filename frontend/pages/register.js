import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { authAPI } from '../lib/api';
import { useStore } from '../lib/store';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all fields'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await authAPI.register({ name: form.name, email: form.email, password: form.password });
      const { user, token } = res.data;
      setUser(user, token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Account created! Welcome to RUTHAN.');
      router.push('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Head><title>Create Account | RUTHAN</title></Head>
      <div className="min-h-screen bg-background-light flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <header className="bg-white border-b border-slate-100 py-5 px-6 flex justify-center">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter no-underline" style={{ color: '#4169e1' }}>RUTHAN</Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[420px]">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10">
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(65,105,225,0.08)' }}>
                  <span className="material-symbols-outlined text-3xl select-none" style={{ color: '#4169e1' }}>person_add</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900">Create Account</h1>
                <p className="text-slate-500 text-sm mt-1">Join RUTHAN for exclusive deals</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: 'name', label: 'Full Name', type: 'text', icon: 'badge', placeholder: 'Your full name' },
                  { name: 'email', label: 'Email Address', type: 'email', icon: 'mail', placeholder: 'you@example.com' },
                ].map(({ name, label, type, icon, placeholder }) => (
                  <div key={name}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{label}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm select-none">{icon}</span>
                      <input name={name} type={type} value={form[name]} onChange={handleChange} placeholder={placeholder}
                        className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all bg-white" />
                    </div>
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm select-none">lock</span>
                    <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Min. 6 characters"
                      className="w-full border border-slate-200 rounded-xl pl-11 pr-12 py-3 text-sm font-medium outline-none transition-all bg-white" />
                    <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      <span className="material-symbols-outlined text-sm select-none">{showPass ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm select-none">lock_reset</span>
                    <input name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="Re-enter password"
                      className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all bg-white" />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-white text-sm tracking-wide transition-all hover:opacity-90 shadow disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                  style={{ backgroundColor: '#4169e1' }}>
                  {loading ? <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <span className="material-symbols-outlined text-sm select-none">how_to_reg</span>}
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link href="/login" className="font-bold no-underline" style={{ color: '#4169e1' }}>Sign in</Link>
                </p>
              </div>
            </div>

            <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-xs select-none">verified_user</span>
              Your data is protected with 256-bit SSL
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
