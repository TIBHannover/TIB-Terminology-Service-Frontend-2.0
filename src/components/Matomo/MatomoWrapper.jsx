import {useLocation} from 'react-router-dom';
import {useMatomo} from '@datapunt/matomo-tracker-react'
import {useEffect} from "react";

export function MatomoWrapper(props) {
  const location = useLocation();
  const {trackPageView, trackEvent} = useMatomo()
  useEffect(() => {
    if (!window.localStorage.getItem("cookie-show") || window.location.href.includes("localhost")) {
      return;
    }
    setTimeout(() => {
      trackPageView();
    }, 1000)
  }, [location.pathname]);
  return (
    props.children
  )
}
