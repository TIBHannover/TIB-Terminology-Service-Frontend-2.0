import { useEffect, useState } from "react";
import { useHistory } from "react-router";



const Facet = (props) => {

    const [resultLoaded, setResultLoaded] = useState(false);
    const [resultTypes, setResultTypes] = useState([]);
    const [ontologyFacetData, setOntologyFacetData] = useState([]);
    const [collections, setCollections] = useState([]);
    const [ontologyListShowAll, setOntologyListShowAll] = useState(false);
    const [countOfShownOntologies, setCountOfShownOntologies] = useState(5);
    const [showMoreLessOntologiesText, setShowMoreLessOntologiesText] = useState("+ Show More");
    const [currentUrl, setCurrentUrl] = useState("");
    const [isLoading, setIsLoading] = useState("");

    const history = useHistory();



    async function setComponentData(){        
        let currentUrl = window.location.href;            
        if (props.facetData.length === 0 || typeof props.facetData["facet_fields"] === "undefined"){
            setResultLoaded(true);
            setResultTypes({});
            setOntologyFacetData({});
            setCurrentUrl(currentUrl);
            setIsLoading(false);            
        }
        else{            
            let facetData = props.facetData["facet_fields"];
            let allTypes = facetData["type"];
            let allOntologies = facetData["ontology_name"];
            let ontologyFacetData = {};
            let types = {};                        
            for(let i=0; i < allOntologies.length; i++){
                if(i % 2 == 0){
                    ontologyFacetData[allOntologies[i].toUpperCase()] = allOntologies[i + 1];
                }
            }
            for(let i=0; i < allTypes.length; i++){
                if(i % 2 == 0){                    
                    types[allTypes[i]] = allTypes[i + 1];                    
                }
            }
                        
            setResultLoaded(true);
            setResultTypes(types);
            setOntologyFacetData(ontologyFacetData);
            setCollections(props.allCollections);
            setCurrentUrl(currentUrl);
            setIsLoading(false);           
        }                    
    }



    function createTypesCheckboxList(){        
        let result = [];
        for(let type in resultTypes){
            if(resultTypes[type] !== 0){
                result.push(
                    <div class="row typeRow facet-item-row"  key={type}>
                        <div class="col-sm-9">
                            <div class="form-check">
                                <input 
                                    class="form-check-input search-facet-checkbox"
                                    type="checkbox" 
                                    value={type}
                                    id={"search-checkbox-" + type} 
                                    key={type}
                                    onClick={props.handleTypesCheckBoxClick}
                                    data-isChecked={props.selectedTypes.includes(type)}
                                />                    
                                <label class="form-check-label" for={"search-checkbox-" + type} >
                                {type}
                                </label>
                            </div>         
                        </div>
                        <div class="col-sm-3">
                            <div class="facet-result-count">{resultTypes[type]}</div>
                        </div>                    
                    </div>
                );
            }            
        }
        return result;
    }



    function createOntologiesCheckboxList(){        
        let lastSelectedOntologyIndex = 0;
        let counter = 1;
        for(let ontoId in ontologyFacetData){
            if(props.selectedOntologies.includes(ontoId.toUpperCase())){
                lastSelectedOntologyIndex = counter;
            }
            counter += 1;
        }
        if(lastSelectedOntologyIndex < countOfShownOntologies){
            lastSelectedOntologyIndex = countOfShownOntologies;
        }

        let result = [];
        counter = 1;
        for(let ontologyId in ontologyFacetData){             
            if (counter > lastSelectedOntologyIndex && !ontologyListShowAll){
                break;
            }
            if(ontologyFacetData[ontologyId] !== 0){
                result.push(
                    <div key={ontologyId}>
                        <div class="row ontoloyRow facet-item-row">
                            <div class="col-sm-9">
                                <div class="form-check">
                                    <input 
                                        class="form-check-input search-facet-checkbox ontology-facet-checkbox"
                                        type="checkbox" 
                                        value={ontologyId}
                                        id={"search-checkbox-" + ontologyId} 
                                        key={ontologyId}
                                        onClick={props.handleOntologyCheckBoxClick}
                                        data-isChecked={props.selectedOntologies.includes(ontologyId.toUpperCase())}
                                    />                    
                                    <label class="form-check-label" for={"search-checkbox-" + ontologyId} >
                                    {ontologyId}
                                    </label>
                                </div>                                
                            </div>
                            <div class="col-sm-3">
                                <div class="facet-result-count">{ontologyFacetData[ontologyId]}</div>
                            </div>                    
                        </div>                    
                    </div>                
                );
            }            
            counter += 1;
        }        
        return result;
    }



    function createCollectionsCheckBoxes(){        
        let result = [];
        for (let record of collections){
            for(let ontoId of record['ontolgies']){
                if(props.selectedOntologies.includes(ontoId) || props.selectedOntologies.length === 0){
                    result.push(
                        <div className="row facet-item-row">
                            <div className='col-sm-9'>
                                <div class="form-check">
                                    <input 
                                        class="form-check-input search-facet-checkbox"
                                        type="checkbox" 
                                        value={record['collection']}
                                        id={"search-checkbox-" + record['collection']} 
                                        key={record['collection']}
                                        onClick={props.handleCollectionsCheckboxClick}
                                        data-isChecked={props.selectedCollections.includes(record['collection'])}
                                    />                    
                                    <label class="form-check-label" for={"search-checkbox-" + record['collection']} >
                                    {record['collection']}
                                    </label>
                                </div>                      
                            </div>                
                        </div>
                    );
                    break;
                }
            }                        
        }
        return result;
    }



    function handleOntologyShowMoreClick(e){                        
        if(ontologyListShowAll){
            setShowMoreLessOntologiesText( "+ Show More");
            setOntologyListShowAll(false);          
        }
        else{
            setShowMoreLessOntologiesText( "- Show Less");
            setOntologyListShowAll(true);            
        }

    }



    function clearFacet(){        
        props.handleChange([], [], []);
        let allFacetCheckBoxes = document.getElementsByClassName('search-facet-checkbox');                
        for(let checkbox of allFacetCheckBoxes){            
            if(checkbox.dataset.ischecked !== "true"){
                document.getElementById(checkbox.id).checked = false;
            }
            delete checkbox.dataset.ischecked;
        }            
    }


    useEffect(() => {
        setComponentData(); 
    }, []);



    useEffect(() => {
        let allFacetCheckBoxes = document.getElementsByClassName('search-facet-checkbox');                
        for(let checkbox of allFacetCheckBoxes){                  
            if(checkbox.dataset.ischecked === "true"){                
                document.getElementById(checkbox.id).checked = true;
            }
            delete checkbox.dataset.ischecked;
        }
        // check show more button for ontologies is needed or not
        let counter = 0;
        let facetOntologies = ontologyFacetData;
        for(let key in facetOntologies){
            if(facetOntologies[key] !== 0){
                counter ++;
            }            
        }
        let showMoreIsNeeded = "";
        let showMoreDiv = document.getElementById('search-facet-show-more-ontology-btn');
        if(counter <= countOfShownOntologies && showMoreDiv){
            showMoreDiv.style.display = 'none';
            showMoreIsNeeded = false;
        }
        else if(showMoreDiv){
            showMoreDiv.style.display = '';
            showMoreIsNeeded = true;
        }
        setComponentData();         
        // if(currentUrl !== window.location.href){
        //     setComponentData();          
        // } 
    }, [props.facetData, props.allCollections]);



    return(
        <div class="row" id="search-facet-container-box">                                   
            {isLoading && 
            <div class="d-flex justify-content-center">
                <div class="spinner-grow text-info facet-loading-effect" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>}                
            {!isLoading &&
            <div class="col-sm-12">
                <h2>Filter Results</h2>    
                <div className="row">
                    <div className="col-sm-12 clear-filter-link-box">
                        <a onClick={clearFacet}>Clear All Filters</a>
                        <br></br>
                    </div>
                </div> 
                <h4>{"Type"}</h4>
                 <div class="facet-box" id="facet-types-list">                                              
                    {createTypesCheckboxList()}
                </div>
                <h4>{"Ontologies"}</h4>
                <div class="facet-box">                            
                    {createOntologiesCheckboxList()}                                                
                    <div className="text-center" id="search-facet-show-more-ontology-btn">
                        <a className="show-more-btn"  onClick={handleOntologyShowMoreClick}>{showMoreLessOntologiesText}</a>
                    </div>                        
                </div>
                {process.env.REACT_APP_COLLECTION_FACET_SHOWN === "true" &&
                <><h4>{"Collections"}</h4><div class="facet-box" id="facet-collections-list">
                        {createCollectionsCheckBoxes()}
                    </div></>}
            </div>}
        </div>
    );


}

export default Facet;