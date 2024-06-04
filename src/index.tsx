import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App';
import reportWebVitals from './reportWebVitals'
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';


 
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



ReactDOM.render(
  <React.StrictMode>
    <MatomoProvider value={instance}>
       <App />
    </MatomoProvider>
  </React.StrictMode>,
  document.getElementById('root')
)


reportWebVitals()
