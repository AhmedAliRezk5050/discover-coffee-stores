import StoresLocationProvider from '../context/stores-location-context';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <StoresLocationProvider>
      <Component {...pageProps} />
    </StoresLocationProvider>
  );
}

export default MyApp;
