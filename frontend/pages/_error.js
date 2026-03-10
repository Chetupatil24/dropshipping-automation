import Head from 'next/head';
import Link from 'next/link';

export default function Error({ statusCode }) {
  return (
    <>
      <Head><title>{statusCode ? `${statusCode} Error` : 'Error'} | RUTHAN</title></Head>
      <div className="min-h-screen bg-background-light flex flex-col items-center justify-center px-6 text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
          <span className="material-symbols-outlined text-4xl text-red-500 select-none">error</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
          {statusCode ? `${statusCode} — Server Error` : 'An Error Occurred'}
        </h1>
        <p className="text-slate-500 max-w-md mb-8 text-sm leading-relaxed">
          {statusCode === 404 ? "The page you're looking for doesn't exist." : "Something went wrong on our end. Please try again shortly."}
        </p>
        <Link href="/" className="px-8 py-3 rounded-xl font-bold text-white no-underline hover:opacity-90 transition-all shadow" style={{ backgroundColor: '#4169e1' }}>
          Go Home
        </Link>
      </div>
    </>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
