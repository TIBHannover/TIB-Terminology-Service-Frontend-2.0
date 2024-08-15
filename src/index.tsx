import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App';
import reportWebVitals from './reportWebVitals'
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


 
// Adding Matomo
const instance = createInstance({
  urlBase: process.env.REACT_APP_TS_PUBLIC_URL as string,
  siteId: process.env.REACT_APP_TS_SITE_ID as any, 
  trackerUrl: "https://support.tib.eu/piwik/matomo.php",
  srcUrl: "https://support.tib.eu/piwik/matomo.js",
  disabled: false,
  linkTracking: true,
  configurations: {
      disableCookies: true,
      },

  }
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});


ReactDOM.render(
  <React.StrictMode>
    <MatomoProvider value={instance}>
      <PersistQueryClientProvider client={queryClient} persistOptions={{persister:localStoragePersister}}>
        <App />
        {process.env.REACT_APP_DEBUG_MODE === "true" && <ReactQueryDevtools initialIsOpen={false} />}
      </PersistQueryClientProvider>
    </MatomoProvider>
  </React.StrictMode>,
  document.getElementById('root')
)


reportWebVitals()
