import React from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import App from './App';
import reportWebVitals from './reportWebVitals'
import { createInstance } from '@datapunt/matomo-tracker-react';
import SiteMatomoProvider from './components/Matomo/SiteMatomoProvider';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { defaultShouldDehydrateQuery } from '@tanstack/react-query';


// Adding Matomo
const instance = createInstance({
  urlBase: process.env.REACT_APP_TS_PUBLIC_URL! as string,
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

const aWeek = 1000 * 60 * 60 * 24 * 7;
const cacheTime = process.env.REACT_APP_CACHE_ENABLED === "true" ? aWeek : 0;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: cacheTime,
      staleTime: cacheTime,
    },
  },
});

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});


const container = document.getElementById("root")!;
const root = createRoot(container);


root.render(
  <React.StrictMode>
    <SiteMatomoProvider value={instance}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: localStoragePersister,
          dehydrateOptions: {
            shouldDehydrateQuery: (query) => {
              if (!query.meta) {
                return true;
              }
              return defaultShouldDehydrateQuery(query) && query.meta.cache !== false
            }
          }
        }}
      >
        <App />
        {process.env.REACT_APP_DEBUG_MODE === "true" && <ReactQueryDevtools initialIsOpen={false} />}
      </PersistQueryClientProvider>
    </SiteMatomoProvider>
  </React.StrictMode >
)


reportWebVitals()
