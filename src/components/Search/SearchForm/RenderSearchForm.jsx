import {useContext} from "react";
import Toolkit from "../../../Libs/Toolkit";
import {AppContext} from "../../../context/AppContext";
import {storeUserSettings} from "../../../api/user";
import {Link} from "react-router-dom";


const RenderSearchForm = (props) => {
  
  const appContext = useContext(AppContext);
  
  
  function setPlaceHolder() {
    if (props.ontologyId) {
      return ("Search in \n" + props.ontologyId);
    }
    return ("Search for ontology, term, properties and individuals");
  }
  
  
  function renderAutoCompleteResult() {
    let resultList = [];
    let key = 0;
    for (let result of props.autoCompleteResult) {
      resultList.push(
        <Link to={props.setSearchUrl(result['autosuggest'])} key={key} className="container"
              data-value={result['autosuggest']} onClick={(e) => {
          props.optionClickCallback(e)
        }}>
          <div className="autocomplete-item item-for-navigation">
            {result['autosuggest']}
          </div>
        </Link>
      )
      key++;
    }
    return resultList
  }
  
  
  function renderJumpToResult() {
    let resultList = []
    for (let result of props.jumpToResult) {
      resultList.push(
        <div className="row mb-3">
          {setJumpResultButtons(result)}
        </div>
      )
    }
    return resultList;
  }
  
  
  function setJumpResultButtons(resultItem) {
    let content = [];
    let obsoletes = Toolkit.getObsoleteFlagValue();
    let targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']);
    
    if (resultItem["type"] === 'class') {
      targetHref += '/terms?iri=' + encodeURIComponent(resultItem['iri']) + `&obsoletes=${obsoletes}`;
    } else if (resultItem["type"] === 'property') {
      targetHref += '/props?iri=' + encodeURIComponent(resultItem['iri']) + `&obsoletes=${obsoletes}`;
    } else if (resultItem["type"] === 'individual') {
      targetHref += '/individuals?iri=' + encodeURIComponent(resultItem['iri']) + `&obsoletes=${obsoletes}`;
    }
    
    content.push(
      <Link to={targetHref} className="jumto-result-link container" data-value={resultItem['label']} onClick={(e) => {
        props.optionClickCallback(e)
      }}>
        <div className="item-for-navigation">
          {resultItem['label']}
          <div className="jumpto-badge-onto">{resultItem['ontology_name']}</div>
          {resultItem["type"] !== 'ontology' &&
            <div className="jumpto-badge-onto bg-main-color">{resultItem['short_form']}</div>}
        </div>
      </Link>
    );
    
    return content;
  }
  
  
  async function handleUserCollectionClose() {
    let userSttings = {...appContext.userSettings};
    userSttings.userCollectionEnabled = !appContext.userSettings.userCollectionEnabled;
    userSttings.activeCollection = {"title": "", "ontology_ids": []};
    appContext.setUserSettings(userSttings);
    await storeUserSettings(userSttings);
    window.location.reload();
  }
  
  
  function createUserCollectionToggleTooltopText() {
    if (appContext.user && appContext.userSettings.userCollectionEnabled) {
      let text = `Collection "${appContext.userSettings?.activeCollection.title}". Included ontologies: `;
      text += appContext.userSettings.activeCollection['ontology_ids'].join(", ");
      return text;
    }
    return "";
  }
  
  
  return (
    <>
      <div className='row site-header-searchbox-holder'>
        <div className='col-sm-9 search-bar-container stour-searchbox'>
          <div className="input-group">
            {appContext.user && appContext.userSettings.activeCollection.title !== "" && !props.ontologyId &&
              <div className="custom-collection-btn" title={createUserCollectionToggleTooltopText()}>
                <div>
                  {appContext.userSettings.activeCollection.title}
                  <i className="fa fa-close fa-borderless" onClick={handleUserCollectionClose}></i>
                </div>
              </div>
            }
            <input
              type="text"
              className="form-control search-input"
              placeholder={setPlaceHolder()}
              aria-describedby="basic-addon2"
              onChange={props.handleSearchInputChange}
              onKeyDown={props.handleKeyDown}
              id="s-field"
            />
            <div className="input-group-append">
              <button className='btn btn-secondary search-btn' type='button'
                      onClick={props.triggerSearch}>Search
              </button>
            </div>
          </div>
          <div className="row search-overlay-box">
            <div className="col-md-12">
              <div className="row">
                {props.autoCompleteResult.length !== 0 && !props.advSearchEnabled &&
                  <div id="autocomplete-container" className="col-md-12" ref={props.autoCompleteRef}>
                    {renderAutoCompleteResult()}
                  </div>
                }
              </div>
              <div className="row">
                {props.jumpToResult.length !== 0 && !props.ontologyId &&
                  <div ref={props.jumptToRef}
                       className="col-md-12 justify-content-md-center jumpto-container jumpto-search-container"
                       id="jumpresult-container">
                    <div>
                      <h4>Jump To</h4>
                      {renderJumpToResult()}
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
          
          {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" &&
            <p>
              <span className="examples">
                Examples: <Link className="example-link" to="search?q=electric+vehicle">electric vehicle</Link>,
                <Link className="example-link" href="search?q=agent">agent</Link></span>
            </p>
          }
          
          <div className='row site-header-search-filters-container mt-1'>
            <div className='col-lg-3 col-sm-4 search-forn-checkbox-holders stour-searchbox-exactmatch'>
              <input type="checkbox" className='form-check-input' id="exact-checkbox" value="exact match"
                     onClick={props.handleExactCheckboxClick}/>
              <label className="form-check-label ms-2" htmlFor="exact-checkbox">Exact match</label>
            </div>
            <div className='col-lg-3 col-sm-4 search-forn-checkbox-holders stour-searchbox-obsolete'>
              <input type="checkbox" className='form-check-input' id="obsoletes-checkbox" value="Obsolete results"
                     onClick={props.handleObsoletesCheckboxClick}/>
              <label className="form-check-label ms-2" htmlFor="obsoletes-checkbox">Obsolete terms</label>
            </div>
            {process.env.REACT_APP_ADVANCED_SEARCH === "true" &&
              <div className="col-lg-6 col-sm-4 adv-search-title-holder stour-searchbox-advanced">
                <div className='row'>
                  <div className='col-sm-12'>
                    <div className="form-switch">
                      <input
                        className="form-check-input toggle-input"
                        type="checkbox"
                        role="switch"
                        id="adv-search-toggle"
                        onClick={props.handleAdvancedSearchToggle}
                        checked={props.advSearchEnabled}
                        onChange={() => {
                        }}
                      />
                      <label className="form-check-label" htmlFor="adv-search-toggle">Advanced search</label>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default RenderSearchForm;