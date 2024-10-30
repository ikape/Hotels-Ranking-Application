import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from '../store';
import { AppProps } from 'next/app';
import { PersistGate } from 'redux-persist/integration/react';
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <Provider store={store}>
            {isClient ? (
                <PersistGate loading={null} persistor={persistor}>
                    <Component {...pageProps} />
                </PersistGate>
            ) : (
                <Component {...pageProps} />
            )}
        </Provider>
    );
}

export default MyApp;
