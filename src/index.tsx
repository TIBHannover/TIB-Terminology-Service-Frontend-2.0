import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createInstance } from "@datapunt/matomo-tracker-react";
import SiteMatomoProvider from "./components/Matomo/SiteMatomoProvider";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { defaultShouldDehydrateQuery } from "@tanstack/react-query";
import { localStoragePersister, queryClient } from "./Libs/QueryCache";

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
          buster: "2",
          dehydrateOptions: {
            shouldDehydrateQuery: (query) => {
              return (
                defaultShouldDehydrateQuery(query) && query.meta?.persist === true
              );
            },
          },
        }}
      >
        <App />
        {process.env.REACT_APP_DEBUG_MODE === "true" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </PersistQueryClientProvider>
    </SiteMatomoProvider>
  </React.StrictMode>,
);

reportWebVitals();
