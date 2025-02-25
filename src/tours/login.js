
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
              Although ontology lookup is completely free to access, there are some extra functionalities such as note
              feature and term request that require authentication. This it not mandatory for most core functions of the terminology service.
            </span>
            <br />
            <span>In case you wish to use the extra features, you can login via:</span>
            <li>GitHub</li>
            <li>ORCID</li>
          </>
        )
      }
    },
  ];
  return steps;
}
