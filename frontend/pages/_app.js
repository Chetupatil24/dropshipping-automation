import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useStore } from '../lib/store';

export default function App({ Component, pageProps }) {
  const { token, setUser } = useStore();

  useEffect(() => {
    // Restore user from localStorage on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser && !token) {
      try { setUser(JSON.parse(storedUser), storedToken); } catch {}
    }
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            fontSize: '14px',
            borderRadius: '12px',
            padding: '12px 18px',
          },
          success: { iconTheme: { primary: '#4169e1', secondary: '#fff' } },
        }}
      />
      <Component {...pageProps} />
    </>
  );
}
