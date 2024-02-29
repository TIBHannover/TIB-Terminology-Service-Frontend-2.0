import Toolkit from "../../../Libs/Toolkit";



const RenderSearchForm = (props) => {


    function setPlaceHolder(){    
        if(props.ontologyId){
          return ("Search in \n" + props.ontologyId);
        }
        return("Search for ontology, term, properties and individuals");    
    }



    function renderAutoCompleteResult(){
        let resultList = [];
        let key = 0;
        for(let result of props.autoCompleteResult){      
          resultList.push(
            <a href={props.setSearchUrl(result['autosuggest'])} key={key} className="container">   
              <div className="autocomplete-item item-for-navigation">
                    {result['autosuggest']}
              </div>
            </a>             
          )
          key++;      
        }
        return resultList
    }



    function renderJumpToResult(){
        let resultList = []
        for(let result of props.jumpToResult){
          resultList.push(
            <div className="jump-autocomplete-container">
               {setJumpResultButtons(result)}
            </div>          
          )
        }
        return resultList;
    }
    


    function setJumpResultButtons(resultItem){
        let content = [];
        let obsoletes = Toolkit.getObsoleteFlagValue();
        let targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']);
    
        if(resultItem["type"] === 'class'){
            targetHref += '/terms?iri=' + encodeURIComponent(resultItem['iri']) + `&obsoletes=${obsoletes}`;       
        }
        else if(resultItem["type"] === 'property'){
            targetHref += '/props?iri=' + encodeURIComponent(resultItem['iri']) + `&obsoletes=${obsoletes}`;        
        }   
        else if(resultItem["type"] === 'individual'){
            targetHref += '/individuals?iri=' + encodeURIComponent(resultItem['iri']) + `&obsoletes=${obsoletes}`;
        }
    
        content.push(
            <a href={targetHref} className="jumto-result-link container">      
                <div className="jump-autocomplete-item jumpto-result-text item-for-navigation"> 
                    {resultItem['label']}
                    <div className="btn btn-default button-in-jumpto ontology-button">{resultItem['ontology_name']}</div>
                    {resultItem["type"] !== 'ontology' && <div className="btn btn-default button-in-jumpto term-button">{resultItem['short_form']}</div>}
                </div>      
            </a>
        ); 
    
        return content;    
    }



    return(
        <>
          <div className='row site-header-searchbox-holder'>
            <div className='col-sm-9 search-bar-container'>
              <div class="input-group input-group-lg">                              
                <input 
                    type="text" 
                    class="form-control search-input" 
                    placeholder={setPlaceHolder()}
                    aria-describedby="basic-addon2"
                    onChange={props.handleSearchInputChange}
                    onKeyDown={props.handleKeyDown}
                    id="s-field"                    
                  />
                <div class="input-group-append">
                  <button className='btn btn-outline-secondary search-btn' type='button' onClick={props.triggerSearch}>Search </button>  
                </div>
              </div>
                                    
              {props.autoCompleteResult.length !== 0 &&
                <div id = "autocomplete-container" className="col-md-12" ref={props.autoCompleteRef}>
                  {renderAutoCompleteResult()}
                </div>
              }         
              {props.jumpToResult.length !== 0 && !props.ontologyId &&
                <div ref={props.jumptToRef} className="col-md-12 justify-content-md-center jumpto-container jumpto-search-container" id="jumpresult-container" >
                  <div>
                    <h4>Jump To</h4>
                    {renderJumpToResult()}
                  </div>
                </div>
              }                                    
    
              {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" &&
                <p>
                  <span class="examples" >Examples: <a class="example-link" href="search?q=electric+vehicle">electric vehicle</a>,
                  <a class="example-link" href="search?q=agent">agent</a></span>
                </p>
              }
            </div>
          </div>          
        </>            
    )
}

export default RenderSearchForm;