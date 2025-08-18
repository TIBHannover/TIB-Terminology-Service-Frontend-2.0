const tourSelectorPrefix = '.stour-';


export function makeOntologyListPageTourSteps() {
  const steps = [
    {
      selector: tourSelectorPrefix + "onto-list-browse",
      content: "Browse all available ontologies on this page. View the total number of hosted ontologies at a glance.",
    },
    {
      selector: tourSelectorPrefix + "ontology-card-in-list",
      content: "This is an ontology. Here, you can view its detailed information.",
    },
    {
      selector: tourSelectorPrefix + "onto-id",
      content: "This is the ontology ID (short form). Click it to navigate to the ontology’s detail page.",
    },
    {
      selector: tourSelectorPrefix + "onto-name",
      content: "This is the ontology full title. Click it to navigate to the ontology’s detail page.",
    },
    {
      selector: tourSelectorPrefix + "onto-description",
      content: "This is the ontology description. Click [Read more] to expand and view the full text (if applicable).",
    },
    {
      selector: tourSelectorPrefix + "onto-class-count",
      content: "This shows the number of classes in this ontology."
    },
    {
      selector: tourSelectorPrefix + "onto-props-count",
      content: "This shows the number of properties in this ontology."
    },
    {
      selector: tourSelectorPrefix + "onto-loaded-time",
      content: "This is the date when the ontology was indexed (or last updated) in our system."
    },
    ...(process.env.REACT_APP_PROJECT_ID === "general"
      ? [
        {
          selector: tourSelectorPrefix + "onto-collection-list",
          content: "This is a comma-separated list of collections that include this ontology. Click on any collection to view its details."
        },
      ]
      : []),
    {
      selector: tourSelectorPrefix + "onto-list-sort",
      content: "You can sort the ontology list by title, prefix (ID), number of classes/properties/individuals, and load time."
    },
    {
      selector: tourSelectorPrefix + "onto-list-filter-keyword",
      content: () => {
        return (
          <>
            <p>
              Filter ontologies by keyword. The search applies to ontology <b>titles </b>
              and <b>IDs</b>, making it the fastest way to
              find your ontology.
            </p>
          </>
        )
      }
    },
    {
      selector: tourSelectorPrefix + "onto-list-filter-collectin",
      content: () => {
        return (
          <>
            <p>
              Filter the ontology list based on their collections.
              By default, filtering uses a union (OR) logic. To find ontologies common
              to multiple collections, enable the <b>Intersection</b> option.
            </p>
          </>
        )
      }
    }
  ];
  
  if (process.env.REACT_APP_ONTOLOGY_SUGGESTION === "true") {
    steps.push(
      {
        selector: tourSelectorPrefix + "onto-list-suggest-onto",
        content: () => {
          return (
            <>
              <p>
                If you can't find your desired ontology,
                you can suggest it for indexing by providing its <b>name </b> and <b>PURL </b>.
                You must be <b>logged </b> in to use this feature.
              </p>
            </>
          )
        }
      }
    );
  }
  return steps;
}
