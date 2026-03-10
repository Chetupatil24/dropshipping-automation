import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { authAPI } from '../lib/api';
import { toast } from 'react-hot-toast';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    if (router.isReady && !token) setTokenValid(false);
  }, [router.isReady, token]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.password || !form.confirm) { toast.error('Please fill all fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await authAPI.resetPassword({ token, password: form.password });
      setDone(true);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Reset link is invalid or expired';
      toast.error(msg);
      if (msg.includes('expired') || msg.includes('invalid')) setTokenValid(false);
    } finally { setLoading(false); }
  };

  return (
    <>
      <Head><title>Reset Password | RUTHAN</title></Head>
      <div className="min-h-screen bg-background-light flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <header className="bg-white border-b border-slate-100 py-4 px-6">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter no-underline" style={{ color: '#4169e1' }}>RUTHAN</Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10">

              {/* ── Invalid / expired token ── */}
              {!tokenValid ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(239,68,68,0.08)' }}>
                    <span className="material-symbols-outlined text-2xl select-none" style={{ color: '#ef4444' }}>error</span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Link Expired</h1>
                  <p className="text-slate-500 text-sm mb-6">This password reset link is invalid or has expired. Please request a new one.</p>
                  <Link href="/forgot-password" className="w-full py-3 px-6 rounded-xl font-bold text-white text-sm no-underline flex items-center justify-center gap-2 hover:opacity-90 transition" style={{ backgroundColor: '#4169e1' }}>
                    <span className="material-symbols-outlined text-sm select-none">refresh</span>
                    Request New Link
                  </Link>
                </div>

              /* ── Success ── */
              ) : done ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(34,197,94,0.08)' }}>
                    <span className="material-symbols-outlined text-2xl select-none" style={{ color: '#22c55e' }}>check_circle</span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Password Updated!</h1>
                  <p className="text-slate-500 text-sm mb-6">Your password has been reset successfully. You can now sign in with your new password.</p>
                  <Link href="/login" className="w-full py-3 px-6 rounded-xl font-bold text-white text-sm no-underline flex items-center justify-center gap-2 hover:opacity-90 transition" style={{ backgroundColor: '#4169e1' }}>
                    <span className="material-symbols-outlined text-sm select-none">login</span>
                    Sign In Now
                  </Link>
                </div>

              /* ── Reset form ── */
              ) : (
                <>
                  <div className="mb-8">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(65,105,225,0.08)' }}>
                      <span className="material-symbols-outlined text-xl select-none" style={{ color: '#4169e1' }}>lock_reset</span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Set New Password</h1>
                    <p className="text-slate-500 text-sm mt-1">Choose a strong password for your RUTHAN account.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">New Password</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm select-none">lock</span>
                        <input
                          type={showPass ? 'text' : 'password'} value={form.password}
                          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                          placeholder="Min. 6 characters"
                          className="w-full border border-slate-200 rounded-xl pl-11 pr-12 py-3 text-sm font-medium outline-none focus:border-primary transition-all bg-white"
                        />
                        <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                          <span className="material-symbols-outlined text-sm select-none">{showPass ? 'visibility_off' : 'visibility'}</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Confirm Password</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm select-none">lock</span>
                        <input
                          type={showConfirm ? 'text' : 'password'} value={form.confirm}
                          onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                          placeholder="Re-enter password"
                          className="w-full border border-slate-200 rounded-xl pl-11 pr-12 py-3 text-sm font-medium outline-none focus:border-primary transition-all bg-white"
                        />
                        <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                          <span className="material-symbols-outlined text-sm select-none">{showConfirm ? 'visibility_off' : 'visibility'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Password strength indicator */}
                    {form.password && (
                      <div className="space-y-1">
                        <div className="flex gap-1">
                          {[1,2,3,4].map(i => {
                            const len = form.password.length;
                            const hasUpper = /[A-Z]/.test(form.password);
                            const hasNum = /[0-9]/.test(form.password);
                            const hasSymbol = /[^A-Za-z0-9]/.test(form.password);
                            const score = (len >= 6 ? 1 : 0) + (len >= 10 ? 1 : 0) + (hasUpper || hasNum ? 1 : 0) + (hasSymbol ? 1 : 0);
                            const filled = i <= score;
                            const color = score <= 1 ? '#ef4444' : score === 2 ? '#f59e0b' : score === 3 ? '#3b82f6' : '#22c55e';
                            return <div key={i} className="h-1 flex-1 rounded-full transition-all" style={{ backgroundColor: filled ? color : '#e2e8f0' }} />;
                          })}
                        </div>
                        <p className="text-xs text-slate-400">
                          {(() => {
                            const len = form.password.length;
                            const hasUpper = /[A-Z]/.test(form.password);
                            const hasNum = /[0-9]/.test(form.password);
                            const hasSymbol = /[^A-Za-z0-9]/.test(form.password);
                            const score = (len >= 6 ? 1 : 0) + (len >= 10 ? 1 : 0) + (hasUpper || hasNum ? 1 : 0) + (hasSymbol ? 1 : 0);
                            return ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][score];
                          })()}
                        </p>
                      </div>
                    )}

                    <button type="submit" disabled={loading}
                      className="w-full py-4 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#4169e1' }}>
                      {loading ? <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <span className="material-symbols-outlined text-sm select-none">lock_reset</span>}
                      {loading ? 'Updating...' : 'Reset Password'}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <Link href="/login" className="text-sm font-bold no-underline flex items-center justify-center gap-1 hover:opacity-80 transition" style={{ color: '#4169e1' }}>
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
