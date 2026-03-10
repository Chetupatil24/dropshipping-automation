import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { authAPI } from '../lib/api';
import { toast } from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Enter your email address'); return; }
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent! Check your inbox.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send reset link. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Head><title>Forgot Password | RUTHAN</title></Head>
      <div className="min-h-screen bg-background-light flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <header className="bg-white border-b border-slate-100 py-5 px-6 flex justify-center">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter no-underline" style={{ color: '#4169e1' }}>RUTHAN</Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[420px]">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10">
              {sent ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
                    <span className="material-symbols-outlined text-3xl text-emerald-600 fill-1 select-none">mark_email_read</span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 mb-3">Check Your Email</h1>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    We sent a password reset link to <span className="font-bold text-slate-900">{email}</span>. Check your inbox (and spam folder).
                  </p>
                  <Link href="/login" className="block w-full py-4 rounded-xl font-bold text-white text-center no-underline hover:opacity-90 transition-all" style={{ backgroundColor: '#4169e1' }}>
                    Back to Sign In
                  </Link>
                  <button onClick={() => { setSent(false); }} className="mt-4 text-sm text-slate-400 hover:text-slate-600 transition-colors w-full text-center">
                    Resend Email
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(65,105,225,0.08)' }}>
                      <span className="material-symbols-outlined text-3xl select-none" style={{ color: '#4169e1' }}>lock_reset</span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Forgot Password?</h1>
                    <p className="text-slate-500 text-sm mt-1">No worries — we'll send you a reset link.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm select-none">mail</span>
                        <input
                          type="email" value={email} onChange={e => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all bg-white"
                        />
                      </div>
                    </div>

                    <button type="submit" disabled={loading}
                      className="w-full py-4 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#4169e1' }}>
                      {loading ? <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <span className="material-symbols-outlined text-sm select-none">send</span>}
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <Link href="/login" className="text-sm font-bold no-underline flex items-center justify-center gap-1" style={{ color: '#4169e1' }}>
                      <span className="material-symbols-outlined text-sm select-none">arrow_back</span> Back to Sign In
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
