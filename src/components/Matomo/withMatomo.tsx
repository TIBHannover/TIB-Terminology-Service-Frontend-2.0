//@ts-ignore
import { useMatomo } from "@jonkoops/matomo-tracker-react";

/**
 * A HOC to use the Matomo hooks in class components
 */
function withMatomo(Component: React.ComponentType) {
  return function WrappedComponent(props: any) {
    const { trackPageView, trackEvent } = useMatomo();
    return (
      <Component
        {...props}
        trackPageView={trackPageView}
        trackEvent={trackEvent}
      />
    );
  };
}

export default withMatomo;
