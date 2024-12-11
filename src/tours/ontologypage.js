
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


export function treeViewTourSteps(type) {
  const steps = [
    {
      selector: tourSelectorPrefix + 'tree-welcome',
      content: `This the ontology ${type} tree view. Here you can check the tree structure, check the ${type} detail, check its notes, etc.`,
    },
    {
      selector: tourSelectorPrefix + 'tree-node',
      content: () => {
        return (
          <>
            <p>This is a {type}. You can click on it to check its detail on the right side of this page.</p>
            <p>
              <b>Hint: </b> You can use arrow keys <i className="fa fa-arrow-up"></i>/<i className="fa fa-arrow-down"></i> on your keyboard
              <i className="fa fa-keyboard-o"></i> to move between nodes and select them in this tree.
            </p>
          </>
        );
      }

    },
    {
      selector: tourSelectorPrefix + 'tree-expand-node-icon',
      content: () => {
        return (
          <>
            <p>You can use this to expand(+) or collapse(-) (in case it is already expanded) this {type} to see its children.
              In case you do not see these icons means this {type} is a leaf (has no child).
            </p>
            <p>
              <b>Hint: </b> You can use arrow keys <i className="fa fa-arrow-left"></i>/<i className="fa fa-arrow-right"></i> on your keyboard
              <i className="fa fa-keyboard-o"></i> to expand/collapse a node.
            </p>
          </>
        );
      }
    },
    {
      selector: tourSelectorPrefix + 'tree-action-btn-reset',
      content: `This will reset the tree that means closing the right side detail pane and unselecting the selected ${type}`
    },
    {
      selector: tourSelectorPrefix + 'tree-action-btn-showobsolete',
      content: `Click here if you like to see the obsolete ${type}(s) in this tree. They will get added as tree roots.`
    },
    {
      selector: tourSelectorPrefix + 'tree-action-btn-subtree',
      content: `Use this to switch between ${type} sub-tree/full-tree mode. Sub-tree means only showing the path from the root to this ${type}.
        Full-tree means vice versa. 
      `
    },
    {
      selector: tourSelectorPrefix + 'tree-jumpto-box',
      content: `This is the jump-to that allows you to jump to your desire ${type} in the tree. Type your ${type} label partially here and 
        select it to jump to it in the tree.
      `
    },
    {
      selector: tourSelectorPrefix + 'tree-page-resize-line',
      content: `You can resize the left pane (tree) and the right pane (detail table) by dragging this line to left and right.`
    },
    {
      selector: tourSelectorPrefix + 'tree-table-detail',
      content: `Here you can check the detail about this ${type}. 
        You can also check this ${type} metadata as JSON by using the button at the end of this table.
      `
    },
    {
      selector: tourSelectorPrefix + 'tree-table-note_tab',
      content: `Here you can check the notes defined for this ${type} by other people. 
        This help you to achieve a better understanding regarding this ${type} and its usage.
      `
    },

  ];
  if (type === 'class') {
    steps.push({
      selector: tourSelectorPrefix + 'tree-table-graph',
      content: `Here you can check this ${type} graph visualization.`

    });
  }

  return steps;
}


