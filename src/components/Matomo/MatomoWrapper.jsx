import { useLocation } from 'react-router-dom';
import { useMatomo } from '@datapunt/matomo-tracker-react'
import React from 'react';


export function MatomoWrapper(props){
    const location = useLocation();
    const { trackPageView, trackEvent } = useMatomo()
    React.useEffect(() => {
        setTimeout(() => {
            // Track page view
            trackPageView();
            console.log("test")
        }, 1000)
     }, [location.pathname]);
    return (
        props.children
    )
}