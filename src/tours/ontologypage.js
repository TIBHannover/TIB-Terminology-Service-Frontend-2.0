
const tourSelectorPrefix = '.stour-';


export function ontologyPageTabTourSteps() {
  const steps = [
    {
      selector: tourSelectorPrefix + 'overview',
      content: "Check the ontology metadata and stats.",
    },
    {
      selector: tourSelectorPrefix + 'term',
      content: "Explore the ontology class tree and check the classes metadata.",
    },
    {
      selector: tourSelectorPrefix + 'property',
      content: "Explore the ontology property tree and check the properties metadata.",
    },
    {
      selector: tourSelectorPrefix + 'individual',
      content: "Explore the ontology list of individuals (if exist) and check their metadata.",
    },
    {
      selector: tourSelectorPrefix + 'termList',
      content: "Explore the ontology list of classes and check their metadata.",
    },
    {
      selector: tourSelectorPrefix + 'notes',
      content: "Read the community notes regarding this ontology or its classes/properties/individuals. You can as well create your own notes and reply to existing ones.",
    },
    {
      selector: tourSelectorPrefix + 'gitIssues',
      content: "(If hosted on GitHub) Check the list of issues from the ontology GitHub repository, report issues, and request missing terms.",
    },
  ];

  return steps;
}


export function ontologyOverViewTourSteps() {
  const steps = [
    {
      selector: tourSelectorPrefix + 'overview-page-table',
      content: "Check the core information about an ontology in this table.",
    },
    {
      selector: tourSelectorPrefix + 'overview-page-stats',
      content: "Ontology content (class/property/individual) stats.",
    },
    {
      selector: tourSelectorPrefix + 'overview-page-more-metadata',
      content: "Click here to check more metadata (if exist. Example: creator, publiser, etc.) about this onology.",
    },
    {
      selector: tourSelectorPrefix + 'overview-page-show-metadata-as-json-btn',
      content: "Check this ontology complete metadata in JSON format in your browser.",
    },
  ];
  if (process.env.REACT_APP_PROJECT_ID === "general" && process.env.REACT_APP_ONTOLOGY_SUGGESTION === "true") {
    steps.push(
      {
        selector: tourSelectorPrefix + 'overview-page-add-to-collection',
        content: "Request adding this ontology to TIB collection(s) in case you see the need. We will evaluate your request and add it to the desired collecion(s) if it fits.",
      }
    );
  }


  return steps;
}


