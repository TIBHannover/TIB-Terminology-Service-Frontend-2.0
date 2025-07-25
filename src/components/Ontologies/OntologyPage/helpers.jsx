import {Link} from 'react-router-dom';
import {OntologyPageContext} from '../../../context/OntologyPageContext';
import {useContext} from 'react';
import DropDown from '../../common/DropDown/DropDown';
import {Lang} from '../../../UrlFactory/UrlParamNames';


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
    result.push(
      <li className={"nav-item ontology-detail-nav-item " + "stour-" + configObject['id']}
          key={configObject['keyForRenderAsTabItem']}>
        <Link
          onClick={props.tabChangeHandler}
          data-value={configObject['tabId']}
          className={(props.activeTabId === parseInt(configObject['tabId'])) ? "nav-link active" : "nav-link"}
          to={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + ontologyPageContext.ontology.ontologyId + configObject['urlEndPoint']}
        >
          {configObject['tabTitle']}
          {configItemKey === "Notes" ? ` (${props.noteCounts})` : ""}
        </Link>
      </li>
    );
  }
  
  let langOptions = [];
  for (let lang of ontologyPageContext.ontology.language) {
    let temp = {"label": lang, "value": lang};
    langOptions.push(temp);
  }
  return (
    <>
      <ul className="nav nav-tabs">
        {result}
        <form className="ms-auto">
          <DropDown
            options={langOptions}
            dropDownId="onto-language"
            dropDownTitle="Ontology language"
            dropDownChangeHandler={(e) => {
              ontologyPageContext.setOntoLang(e.target.value);
            }}
            defaultValue={ontologyPageContext.ontoLang}
          />
        </form>
      </ul>
    </>
  );
}


export const OntologyPageHeadSection = () => {
  const ontologyPageContext = useContext(OntologyPageContext);
  return [
    <div className='span'>
      <div className='row ont-info-bar header-collapseable-section'>
        <div className="col-sm-12">
          <div>
            <h2>
              <Link
                className={"ont-info-bar-title"}
                to={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + ontologyPageContext.ontology.ontologyId}
              >
                {ontologyPageContext.ontology.title}
              </Link>
            </h2>
          </div>
          <div>
            <a href={ontologyPageContext.ontology.iri}>{ontologyPageContext.ontology.iri}</a>
          </div>
        </div>
      </div>
      <div className='row collpase-button-container justify-content-md-center'>
        <div className='col-sm-1'>
          <div className='header-collapse-btn' onClick={() => {
            collpaseSiteHeader()
          }}>
            <i className='fa fa-angle-double-up header-collpase-icon'></i>
          </div>
        </div>
      </div>
    </div>
  ];
}


function collpaseSiteHeader() {
  let siteHeader = document.getElementsByClassName('header-wrapper')[0];
  let collapseIcone = document.getElementsByClassName('header-collpase-icon')[0];
  let ontologyBannerContainer = document.getElementsByClassName('ont-info-bar')[0];
  let collapseIconContainer = document.getElementsByClassName('collpase-button-container')[0];
  if (collapseIcone.classList.contains('fa-angle-double-up')) {
    ontologyBannerContainer.classList.add('hidden-header');
    siteHeader.classList.add('hidden-header');
    siteHeader.classList.remove('visible-header');
    ontologyBannerContainer.classList.remove('visible-header');
    collapseIcone.classList.remove('fa-angle-double-up');
    collapseIcone.classList.add('fa-angle-double-down');
    collapseIconContainer.classList.add('show-header-arrow-down');
  } else {
    siteHeader.classList.remove('hidden-header');
    ontologyBannerContainer.classList.remove('hidden-header');
    siteHeader.classList.add('visible-header');
    ontologyBannerContainer.classList.add('visible-header');
    collapseIcone.classList.add('fa-angle-double-up');
    collapseIcone.classList.remove('fa-angle-double-down');
    collapseIconContainer.classList.remove('show-header-arrow-down');
  }
  
}