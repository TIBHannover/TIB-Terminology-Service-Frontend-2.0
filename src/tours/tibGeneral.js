
const tourSelectorPrefix = '.stour-';



export function homePageTourStepsTibGeneral() {
  const steps = [

    {
      selector: tourSelectorPrefix + 'collection-box-in-home',
      content: () => {
        return (
          <>
            <span>Each box reperesents a hosted collection in TIB terminology service</span>
            <br /><br />
            <span>Click on the logo to check the list of ontologies in each collection.</span>
            <br /><br />
            <span>Click on the [Read More] to check more details about the collection.</span>
          </>
        )
      }
    },
  ]

  return steps;
}


export function headerTourStepsTibGeneral() {
  const steps = [
    {
      selector: tourSelectorPrefix + 'searchbox',
      content: 'You can use this to search after ontologies, classes, properties, and individuals.',
    },
    {
      selector: tourSelectorPrefix + 'searchbox-exactmatch',
      content: "You can narrow down your search to be an exact match for your query instead of the default fuzzy search.",
      style: {
        marginLeft: '-50px',
      },
    },
    {
      selector: tourSelectorPrefix + 'searchbox-obsolete',
      content: "Search only in obsolete terms. Obsolete terms are deprecated ones set by the ontology develepers.",
    },
    {
      selector: tourSelectorPrefix + 'searchbox-advanced',
      content: "Set extra properties for your search such as search in a specific sub-tree.",
      style: {
        marginLeft: '150px',
      },
    },

    {
      selector: tourSelectorPrefix + 'collections-navbar-item',
      content: 'Checkout the details about the hosted Collections in TIB.',
    },
    {
      selector: tourSelectorPrefix + 'ontologies-navbar-item',
      content: "Checkout the list of available ontologies.",
    },
    {
      selector: tourSelectorPrefix + 'help-navbar-item',
      content: "Need help? Here you can find the most frequent questions and answers regarding TIB terminology service.",
    },
    {
      selector: tourSelectorPrefix + 'api-navbar-item',
      content: "You plan to use API? check this for the detailed documentation.",
    },
    {
      selector: tourSelectorPrefix + 'about-navbar-item',
      content: "Read more about TIB terminology service.",
    },
  ];
  return steps;
}
