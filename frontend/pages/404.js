import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  return (
    <>
      <Head><title>404 - Page Not Found | RUTHAN</title></Head>
      <div className="min-h-screen bg-background-light flex flex-col items-center justify-center px-6 text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div className="text-[120px] font-extrabold leading-none" style={{ color: '#4169e1', opacity: 0.12 }}>404</div>
        <div className="mt-[-40px] mb-6">
          <span className="material-symbols-outlined text-6xl select-none" style={{ color: '#4169e1' }}>search_off</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Page Not Found</h1>
        <p className="text-slate-500 max-w-md mb-8 text-sm leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="px-8 py-3 rounded-xl font-bold text-white no-underline hover:opacity-90 transition-all shadow" style={{ backgroundColor: '#4169e1' }}>
            Go Home
          </Link>
          <Link href="/products" className="px-8 py-3 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 no-underline hover:border-blue-300 transition-all">
            Browse Products
          </Link>
        </div>
      </div>
    </>
  );
}
