const tourSelectorPrefix = ".stour-";

export function loginInHeaderTourSteps(isUserLogin) {
  const steps = [
    {
      selector: tourSelectorPrefix + "login-in-header",
      content: () => {
        if (isUserLogin) {
          return (
            <>
              <span>Your user panel. You can check:</span>
              <li>My Profile: info and API keys</li>
              {process.env.REACT_APP_ONTOLOGY_FOLLOW_FEATURE === "true" && (
                <li>My Profile → Notifications: notification email and followed ontology subscriptions</li>
              )}
              <li>Define and check your custom ontology collections</li>
              <li>Your submited issue requests for ontologies.</li>
            </>
          );
        }
        return (
          <>
            <span>
              TIB Terminology Service can be used freely and without
              authentication. There are features like personal collections,
              adding notes, ontology suggestions, or term requests which
              increase your experience even more but require login.
            </span>
            <br />
            <span>You can authenticate via:</span>
            <li>GitHub</li>
            <li>ORCID</li>
          </>
        );
      },
    },
  ];
  return steps;
}
