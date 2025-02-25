
const tourSelectorPrefix = '.stour-';



export function homePageTourStepsTibGeneral() {
  const steps = [
    {
      selector: tourSelectorPrefix + 'collection-box-in-home',
      style: {
        maxWidth: '40%',
      },
      content: () => {
        return (
          <>
            <span>
              TIB Terminology Service organises sets of ontologies, i.e. grouped by discipline, in <b>collections</b>.
              Each box represents a hosted collection in TIB Terminology Service.
            </span>
            <br /><br />
            <span>Click on the logo to check the list of ontologies in each collection.</span>
            <br /><br />
            <span>Click on the [Read More] to check more details about the collection.</span>
            <br />
            <br />
            <h6><b>What is a Collection?</b></h6>
            <p>
              A collection is a set of ontologies associated with a project. Projects use and/or develop
              these ontologies to semantically annotate their datasets. Defining a collection for a project helps the project members and software to
              norrow down their term lookup to their target ontologies. These collections are defined by the TIB team for projects.
            </p>
          </>
        );
      },
    },
  ];
  return steps;
}


export function headerTourStepsTibGeneral() {
  const steps = [
    {
      selector: tourSelectorPrefix + 'searchbox',
      content: 'You can use the search bar to search after ontologies, classes, properties, and individuals.',
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
      content: "Search only in obsolete terms. Obsolete terms are deprecated ones set by the ontology developers.",
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
      content: 'Checkout the details about the hosted collections in TIB.',
    },
    {
      selector: tourSelectorPrefix + 'ontologies-navbar-item',
      content: "Checkout the list of available ontologies.",
    },
    {
      selector: tourSelectorPrefix + 'help-navbar-item',
      content: "Need help? Here you can find the most frequent questions and answers regarding TIB Terminology Service.",
    },
    {
      selector: tourSelectorPrefix + 'api-navbar-item',
      content: "You plan to use API? Check this for the detailed documentation.",
    },
    {
      selector: tourSelectorPrefix + 'about-navbar-item',
      content: "Read more about TIB Terminology Service.",
    },
  ];
  return steps;
}
