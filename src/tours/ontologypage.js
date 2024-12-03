
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


