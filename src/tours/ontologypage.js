const tourSelectorPrefix = '.stour-';


export function ontologyPageTabTourSteps() {
  const steps = [
    {
      selector: tourSelectorPrefix + 'overview',
      content: "Check the ontology metadata and statistics.",
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
      selector: tourSelectorPrefix + 'overview-welcome',
      content: "This is the ontology overview page where you can check the ontology metadata and statistics.",
    },
    {
      selector: tourSelectorPrefix + 'overview-page-table',
      content: "Check the core information about an ontology in this table.",
    },
    {
      selector: tourSelectorPrefix + 'overview-page-stats',
      content: "Ontology content (class/property/individual) statistics.",
    },
    {
      selector: tourSelectorPrefix + 'overview-page-more-metadata',
      content: "Click here to check if more metadata (e.g. creator, publisher, etc.) is available about this ontology.",
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
        content: "Request adding this ontology to TIB collection(s) in case you see the need. We will evaluate your request and add it to the desired collecion(s) if it fits the criteria.",
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
              <b>Hint: </b> You can use arrow keys <i className="fa fa-arrow-up"></i>/<i
              className="fa fa-arrow-down"></i> on your keyboard
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
            <p>You can use this to expand(+) or collapse(-) (in case it is already expanded) this {type} to see its
              children.
              In case you do not see these icons means this {type} is a leaf (has no child).
            </p>
            <p>
              <b>Hint: </b> You can use arrow keys <i className="fa fa-arrow-left"></i>/<i
              className="fa fa-arrow-right"></i> on your keyboard
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


export function individualsListTourSteps() {
  const steps = [
    {
      selector: tourSelectorPrefix + 'individual-list-welcome',
      content: `This the ontology individuals list view. Here you can check individuals detail, check thier notes, and check their parent class in the tree.`,
    },
    {
      selector: tourSelectorPrefix + 'individual-list-node',
      content: 'This an individual lable. You can click on it to check its detail on the right pane table.'
    },
    {
      selector: tourSelectorPrefix + 'check-in-tree-individual',
      content: 'Click here to check the selected individual in the class tree structure. You can use this to check the class that this individual instantiated from.'
    },
    {
      selector: tourSelectorPrefix + 'tree-jumpto-box',
      content: `This is the jump-to that allows you to jump to your desire individual in the list. Type your individual label partially here and 
        select it to jump to it in the list.
      `
    },
    {
      selector: tourSelectorPrefix + 'tree-page-resize-line',
      content: `You can resize the left pane (tree) and the right pane (detail table) by dragging this line to left and right.`
    },
    {
      selector: tourSelectorPrefix + 'tree-table-detail',
      content: `Here you can check the detail about this individual. 
        You can also check this individual metadata as JSON by using the button at the end of this table.
      `
    },
    {
      selector: tourSelectorPrefix + 'tree-table-note_tab',
      content: `Here you can check the notes defined for this individual by other people. 
        This help you to achieve a better understanding regarding this individual and its usage.
      `
    },
  ];
  
  return steps;
}


export function classListTourSteps() {
  const steps = [
    {
      selector: tourSelectorPrefix + 'class-list-welcome',
      content: `This the ontology class list view. Here you can check the list of classes alongside with some their of the most important metadata.`,
    },
    {
      selector: tourSelectorPrefix + 'class-list-obsolete-checkbox',
      content: () => {
        return (
          <>
            <p>
              Check this to only see the obsolete classes list. Unchecked means only show the non-obsolete classes.
            </p>
            <p>
              <b>Attention:</b> this enable the obsolete check globally for this application. This means obsolete
              checkbox will be enabled
              for all other section such as the search and tree view.
            </p>
          </>
        );
      }
    },
    {
      selector: tourSelectorPrefix + 'class-list-jumpto-box',
      content: `This is the jump-to that allows you to jump to your desire class in the list. Type your class label partially here and 
        select it to jump to it in the list.
      `
    },
    {
      selector: tourSelectorPrefix + 'class-list-hide-column-icon',
      content: 'Use this to hide a column from your view in case you like to have a smaller table.'
    },
  ];
  
  return steps;
}


export function githubPanelTourSteps() {
  const steps = [
    {
      selector: tourSelectorPrefix + 'github-welcome',
      content: () => {
        return (
          <>
            <p>
              This the ontology GitHub panel (if hosted on GitHub). Here you can check the list of open issues, and
              also, open new issues and term requests.
            </p>
            <p>
              <b>Attention:</b> You can file a new issue or term request only if you login in TS via your GitHub
              account. Otherwise you can
              only check the list of issues.
            </p>
          
          </>
        );
      }
    },
    {
      selector: tourSelectorPrefix + 'github-issue-status-dropdown',
      content: () => {
        return (
          <>
            <p>
              This is the filter for issues/pull-requests based on their status on GitHub.
            </p>
            <ul>
              <li>open (default)</li>
              <li>closed</li>
              <li>all: closed + open</li>
            </ul>
          
          </>
        );
      }
    },
    {
      selector: tourSelectorPrefix + 'github-issue-type-radio',
      content: () => {
        return (
          <>
            <p>
              Here you can select the type of this list: issues and pull requests.
            </p>
            in case you do not know what is a pull request check
            <a
              href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests"
              target={'_blank'}
              className='ms-1'
            >
              here
            </a>
          </>
        );
      }
    },
    {
      selector: tourSelectorPrefix + 'github-issue-open-btn-general',
      content: () => {
        return (
          <>
            <p>
              Use this to open an issue for this ontology on its GitHub repository.
            </p>
            <p>
              <b>Attention:</b> If you plan to create a Term Request, use the other button below this.
            </p>
          </>
        );
      }
      
    },
    {
      selector: tourSelectorPrefix + 'github-issue-open-btn-termRequest',
      content: () => {
        return (
          <>
            <p>
              Use this to request a new term for this ontology. The request will be an issue on the ontology repository.
              We provide a template for you to help you requesting the term.
            </p>
            <p>
              <b>Attention:</b> We cannot guarantee that your term request will be accepted. It is up to the ontology
              maintainers.
            </p>
          </>
        );
      }
      
    }
  ];
  
  if (document.getElementsByClassName("git-issue-title").length !== 0) {
    steps.push(
      {
        selector: tourSelectorPrefix + 'github-issue-title',
        content: 'This is the issue title. Clicking on it will open the issue page on GitHub.'
      }
    );
    steps.push(
      {
        selector: tourSelectorPrefix + 'github-issue-number',
        content: 'This is the issue #number, opening date, and the GitHub user who opened it.'
      }
    );
  }
  
  return steps;
}


export function notesTourSteps() {
  const steps = [
    {
      selector: tourSelectorPrefix + 'ontology-note-welcome',
      style: {
        maxWidth: '50%',
      },
      content: () => {
        return (
          <>
            <h5>Ontology Notes</h5>
            <p>This is the ontology notes panel. Here you can check the existing notes,
              create new notes, and add comment to other users notes.
            </p>
            <p>
              <b>Hint: What is a note exactly?</b>
            </p>
            <p>
              You can see the notes as the extra contexual data for an ontology or a term defined by the community
              (like a community note). Notes helps ontology users to understand and use the ontology
              better. Besides, it is a place to ask question about the ontology and its terms from the community.
            </p>
            <p><b>Why use note and not GitHub issues for this?</b></p>
            <p>
              <ul>
                <li>
                  Some ontologies are not hosted on GitHub (or any version control
                  system with an issue list feature.)
                </li>
                <li>
                  Some questions might not be suitable and accpetable as a Git issue
                  based on the target repository rules.
                </li>
                <li>
                  You can attach a note directly to a term and visit it on the tree under note tab for the target term.
                  Not possible on GitHub.
                </li>
              </ul>
            </p>
            <br/>
            <p>
              <b>Hint: </b>This is one of the good examples of using the note feature:
              <a
                href='https://terminology.nfdi4chem.de/ts/ontologies/vibso/notes?page=1&size=10&originalNotes=false&type=all'
                target={'_blank'} className='ms-2'
              >
                VIBSO Notes
              </a>
            </p>
          
          </>
        );
      }
    },
    {
      selector: tourSelectorPrefix + 'onto-note-type-filter',
      content: 'Here you can filter the note list (if exist) for this ontology based on the target type.'
    },
    {
      selector: tourSelectorPrefix + 'onto-note-import-from-parent',
      content: `By default this list contains also the notes that are defined for any term that is imported from this ontology.
            For instance, if someone define a note for a term X somewhere else and the term X belongs to this ontology,
            you will see that note here in case they publish it for the parent also.
            `
    }
  ];
  
  if (!window.location.href.includes('noteId=')) {
    steps.push({
      selector: tourSelectorPrefix + 'onto-note-add-btn',
      content: 'Use this to define a new note for this ontology (you need to be logged in.)'
    });
  }
  
  let noteList = document.getElementsByClassName('note-list-card');
  if (noteList && noteList.length !== 0) {
    steps.push({
      selector: tourSelectorPrefix + 'onto-note-list-card',
      content: 'This is a note.'
    });
    steps.push({
      selector: tourSelectorPrefix + 'onto-note-list-card-meta',
      content: 'Creation date and made by whome. Besides, you will see Pinned tag if the note is pinned by admin and Imported tag if it is imported.'
    });
    steps.push({
      selector: tourSelectorPrefix + 'onto-note-list-card-title',
      content: 'This is the note title. You can click on it to check the note detail.'
    });
    steps.push({
      selector: tourSelectorPrefix + 'onto-note-list-card-about',
      content: 'Check this note describes which artifact: ontology, class, property, and individual. You can click on them to see the term details.'
    });
    
  }
  
  return steps;
}

