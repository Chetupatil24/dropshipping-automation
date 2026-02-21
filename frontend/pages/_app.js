import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import LiveSalesPopup from '../components/LiveSalesPopup';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <LiveSalesPopup />
      <Toaster position="top-right" />
    </>
  );
}
