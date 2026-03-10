import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';
import BottomNav from '../components/BottomNav';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error('Please fill all required fields'); return; }
    setLoading(true);
    // Simulate API call (replace with real endpoint when available)
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setLoading(false);
  };

  const CONTACTS = [
    { icon: 'mail', title: 'Email Us', detail: 'support@ruthan.in', sub: 'Reply within 24 hours' },
    { icon: 'phone', title: 'Call Us', detail: '+91 98765 43210', sub: 'Mon–Sat, 9AM–6PM IST' },
    { icon: 'location_on', title: 'Our Office', detail: 'Mumbai, Maharashtra', sub: 'India 400001' },
  ];

  return (
    <>
      <Head><title>Contact Us | RUTHAN</title></Head>
      <div className="min-h-screen bg-background-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        <Navbar />

        <main className="max-w-5xl mx-auto px-6 py-14">
          <div className="text-center mb-12">
            <p className="text-xs font-extrabold uppercase tracking-widest mb-3" style={{ color: '#4169e1' }}>Get In Touch</p>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">We're Here to Help</h1>
            <p className="text-slate-500 max-w-lg mx-auto">Have a question, feedback, or need support? Fill out the form below and our team will get back to you promptly.</p>
          </div>

          {/* Contact info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
            {CONTACTS.map(c => (
              <div key={c.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(65,105,225,0.08)' }}>
                  <span className="material-symbols-outlined text-xl select-none" style={{ color: '#4169e1' }}>{c.icon}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 mb-1">{c.title}</h3>
                <p className="text-sm font-bold text-slate-700">{c.detail}</p>
                <p className="text-xs text-slate-400 mt-0.5">{c.sub}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-10 max-w-2xl mx-auto">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
                  <span className="material-symbols-outlined text-3xl text-emerald-600 fill-1 select-none">check_circle</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Message Sent!</h2>
                <p className="text-slate-500 text-sm mb-6">Thank you for reaching out. We'll reply within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="px-8 py-3 rounded-xl font-bold text-white hover:opacity-90 transition" style={{ backgroundColor: '#4169e1' }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-extrabold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[['name','Your Name','badge'],['email','Email Address','mail']].map(([name, placeholder, icon]) => (
                      <div key={name}>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{placeholder}</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm select-none">{icon}</span>
                          <input name={name} value={form[name]} onChange={handleChange} placeholder={placeholder}
                            className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all bg-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Subject</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm select-none">subject</span>
                      <input name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?"
                        className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Message <span className="text-red-400">*</span></label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell us more..."
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all bg-white resize-none" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-4 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#4169e1' }}>
                    {loading ? <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <span className="material-symbols-outlined text-sm select-none">send</span>}
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </>
            )}
          </div>
        </main>


        <SiteFooter />
        <BottomNav />
      </div>
    </>
  );
}
