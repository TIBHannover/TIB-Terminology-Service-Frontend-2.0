
const tourSelectorPrefix = '.stour-';


export function loginInHeaderTourSteps(isUserLogin) {
  const steps = [
    {
      selector: tourSelectorPrefix + 'login-in-header',
      content: () => {
        if (isUserLogin) {
          return (
            <>
              <span>Your user panel. You can check:</span>
              <li>Profile info</li>
              <li>Define and check your custom ontology collections</li>
              <li>Your submited issue requests for ontologies.</li>
            </>
          );
        }
        return (
          <>
            <span>
              TIB Terminology service can be used freely and without authentication.
              There are features like personal collections, adding notes, ontology suggestions, or term requests which increase your experience even more but require login.
            </span>
            <br />
            <span>You can authenticate via:</span>
            <li>GitHub</li>
            <li>ORCID</li>
          </>
        )
      }
    },
  ];
  return steps;
}
