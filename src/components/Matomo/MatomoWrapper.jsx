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
        }, 1000)
     }, [location.pathname]);
    return (
        props.children
    )
}

export function MatomoOnClick(props){
    const location = useLocation();
    const { trackPageView, trackEvent } = useMatomo();
    trackEvent({ category: 'tree-node', action: 'click-event' })
    console.log("test")
    React.useEffect(() => {
        setTimeout(() => {
            // Track page view
            trackPageView();
        }, 1000)
     }, [location.pathname]);
    return (
        props.children
    )
    

}