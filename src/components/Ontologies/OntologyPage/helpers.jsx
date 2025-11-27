import { Link } from 'react-router-dom';
import { OntologyPageContext } from '../../../context/OntologyPageContext';
import { useContext } from 'react';
import DropDown from '../../common/DropDown/DropDown';
import { useState } from 'react';


export const OntologyPageTabs = (props) => {
  /* 
      Renders tabs for the Ontology page.
      The tab metadata comes from listOfComponentsAsTabs.json
  */

  const ontologyPageContext = useContext(OntologyPageContext);
  let result = [];
  for (let configItemKey in props.tabMetadataJson) {
    let configObject = props.tabMetadataJson[configItemKey];
    if (process.env.REACT_APP_NOTE_FEATURE !== "true" && configItemKey === "Notes") {
      continue;
    }
    if (process.env.REACT_APP_GITHUB_ISSUE_LIST_FEATURE !== "true" && configItemKey === "IssueList") {
      continue;
    }
    let activeClassName = (props.activeTabId === parseInt(configObject['tabId'])) ? "nav-item-active" : "";
    result.push(
      <div className={"ontology-detail-nav-item " + activeClassName + " stour-" + configObject['id']}
        key={configObject['keyForRenderAsTabItem']}>
        <Link
          onClick={props.tabChangeHandler}
          data-value={configObject['tabId']}
          className={"nav-link"}
          to={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + ontologyPageContext.ontology.ontologyId + configObject['urlEndPoint']}
        >
          {configObject['tabTitle']}
          {configItemKey === "Notes" ? ` (${props.noteCounts})` : ""}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="row h-100">
        <div className="col-12 d-flex flex-column">
          {result}

        </div>
      </div>
    </>
  );
}


export const OntologyPageHeadSection = () => {
  const ontologyPageContext = useContext(OntologyPageContext);
  let langOptions = [];
  for (let lang of ontologyPageContext.ontology.language ?? []) {
    let temp = { "label": lang, "value": lang };
    langOptions.push(temp);
  }
  return (
    <div className='row ontology-page-headbar'>
      <div className='col-sm-8 pb-0'>
        <p className='fw-bold'>{ontologyPageContext.ontology.title}</p>
      </div>
      <div className='col-sm-4 pb-0'>
        <div className='d-flex flex-row gap-4 justify-content-end'>
          <div>
            <form className="mt-auto bottom-0">
              <DropDown
                options={langOptions}
                dropDownId="onto-language"
                tooltipText="Select the language of the ontology"
                dropDownTitle={<i className="fa fa-language fs-5 border-0"></i>}
                dropDownChangeHandler={(e) => {
                  ontologyPageContext.setOntoLang(e.target.value);
                }}
                defaultValue={ontologyPageContext.ontoLang}
              />
            </form>
          </div>
          <div className='pt-1'>
            <button className='btn btn-sm' onClick={ontologyPageContext.handleFullScreen}>
              {!ontologyPageContext.fullScreenMode && <i class="fas fa-expand fs-6 mt-1" title='Full screen'></i>}
              {ontologyPageContext.fullScreenMode && <i class="fas fa-compress fs-6 mt-1" title='Exit full screen'></i>}
            </button>
          </div>
        </div>
      </div>
    </div >
  );
}


// export const OntologyPageHeadSection = () => {
//   return (
//     <div className='row collpase-button-container justify-content-md-center'>
//       <div className='col-sm-1'>
//         <div className='header-collapse-btn' onClick={() => {
//           collpaseSiteHeader()
//         }}>
//           <i className='fa fa-angle-double-up header-collpase-icon'></i>
//         </div>
//       </div>
//     </div>
//   );
// }


function collpaseSiteHeader() {
  let siteHeader = document.getElementsByClassName('header-wrapper')[0];
  let collapseIcone = document.getElementsByClassName('header-collpase-icon')[0];
  let collapseIconContainer = document.getElementsByClassName('collpase-button-container')[0];
  let collapseButton = document.getElementsByClassName('header-collapse-btn')[0];
  if (collapseIcone.classList.contains('fa-angle-double-up')) {
    siteHeader.classList.add('hidden-header');
    siteHeader.classList.remove('visible-header');
    collapseIcone.classList.remove('fa-angle-double-up');
    collapseIcone.classList.add('fa-angle-double-down');
    collapseIconContainer.classList.add('show-header-arrow-down');
    collapseButton.style.marginTop = "-10px";
  } else {
    siteHeader.classList.remove('hidden-header');
    siteHeader.classList.add('visible-header');
    collapseIcone.classList.add('fa-angle-double-up');
    collapseIcone.classList.remove('fa-angle-double-down');
    collapseIconContainer.classList.remove('show-header-arrow-down');
    collapseButton.style.marginTop = "-40px";
  }

}