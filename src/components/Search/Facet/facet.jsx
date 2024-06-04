import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import { a } from "react-spring";


const Facet = (props) => {

    const appContext = useContext(AppContext);

    const DEFAULT_NUMBER_OF_SHOWN_ONTOLOGIES = 5;
    
    const [resultTypes, setResultTypes] = useState([]);
    const [ontologyFacetData, setOntologyFacetData] = useState([]);    
    const [ontologyListShowAll, setOntologyListShowAll] = useState(false);
    const [countOfShownOntologies, setCountOfShownOntologies] = useState(DEFAULT_NUMBER_OF_SHOWN_ONTOLOGIES);
    const [showMoreLessOntologiesText, setShowMoreLessOntologiesText] = useState("+ Show More");
    const [showMoreIsNeededForOntologies, setShowMoreIsNeededForOntologies] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [typesCheckBoxesToRender, setTypesCheckBoxesToRender] = useState(null);
    const [ontologyCheckBoxesToRender, setOntologyCheckBoxesToRender] = useState(null);
    const [collectionCheckBoxesToRender, setCollectionCheckBoxesToRender] = useState(null);



    function setComponentData(){                 
        if (props.facetData.length === 0 || typeof props.facetData["facet_fields"] === "undefined"){            
            setResultTypes({});
            setOntologyFacetData({});                    
        }
        else{            
            let facetData = props.facetData["facet_fields"];
            let allTypes = facetData["type"];
            let allOntologies = facetData["ontology_name"];
            let ontologyFacetData = {};
            let types = {};                        
            for(let i=0; i < allOntologies.length; i++){               
                if(i % 2 == 0){
                    if(appContext.userCollectionEnabled && !appContext.activeUserCollection['ontology_ids'].includes(allOntologies[i].toLowerCase())){                        
                        continue;
                    }
                    ontologyFacetData[allOntologies[i].toUpperCase()] = allOntologies[i + 1];
                }
            }
            for(let i=0; i < allTypes.length; i++){
                if(i % 2 == 0){                    
                    types[allTypes[i]] = allTypes[i + 1];                    
                }
            }                                    
            setResultTypes(types);
            setOntologyFacetData(ontologyFacetData);                           
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
        setTypesCheckBoxesToRender(result);
    }


    function createOntologiesCheckboxList(){        
        let result = [];
        let counter = 1;  
      
        for(let ontologyId in ontologyFacetData){                         
            if (counter > countOfShownOntologies && !ontologyListShowAll){
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
                                        id={"search-checkbox-" + ontologyId.toLowerCase()} 
                                        key={ontologyId}
                                        onClick={props.handleOntologyCheckBoxClick}
                                        data-isChecked={props.selectedOntologies.includes(ontologyId.toLowerCase())}
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
        setOntologyCheckBoxesToRender(result);
    }



    function createCollectionsCheckBoxes(){        
        let result = [];
        for (let record of props.allCollections){
            for(let ontoId of record['ontolgies']){
                if(props.selectedOntologies.includes(ontoId.toLowerCase()) || props.selectedOntologies.length === 0){
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
        setCollectionCheckBoxesToRender(result);
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


    function updateCountOfShownOntologies(){
        let lastSelectedOntologyIndex = 0;
        let counter = 1;
        let ontologiesInFacetLength = 0;        
        for(let ontoId in ontologyFacetData){
            if(props.selectedOntologies.includes(ontoId.toLowerCase())){
                lastSelectedOntologyIndex = counter;
            }
            if(ontologyFacetData[ontoId] !== 0){
                ontologiesInFacetLength += 1;
            }
            counter += 1;
        }     
        
        let numberOfShownOntologies = DEFAULT_NUMBER_OF_SHOWN_ONTOLOGIES;         
        if(lastSelectedOntologyIndex > countOfShownOntologies){
            setCountOfShownOntologies(lastSelectedOntologyIndex);
            numberOfShownOntologies = lastSelectedOntologyIndex;           
        }

        if(ontologiesInFacetLength > numberOfShownOntologies){
            setShowMoreIsNeededForOntologies(true);
        }
        else{
            setShowMoreIsNeededForOntologies(false);
        }        
                    
    }


    function enableSelectedCheckBoxesOnLoad(){
        let allFacetCheckBoxes = document.getElementsByClassName('search-facet-checkbox');                
        for(let checkbox of allFacetCheckBoxes){                  
            if(checkbox.dataset.ischecked === "true"){                
                document.getElementById(checkbox.id).checked = true;
            }
            delete checkbox.dataset.ischecked;
        }
    }


    useEffect(() => {        
        setComponentData(); 
        updateCountOfShownOntologies();            
    }, []);


    useEffect(() => {        
        if(!appContext.userCollectionEnabled){
            createCollectionsCheckBoxes();
            setIsLoading(false);
        }        
    }, [props.allCollections]);



    useEffect(() => {        
        setComponentData();              
        createTypesCheckboxList();
        createOntologiesCheckboxList();
        !appContext.userCollectionEnabled && createCollectionsCheckBoxes();
        setIsLoading(false);
    }, [props.facetData]);


    useEffect(() => {                       
        createTypesCheckboxList();
    }, [resultTypes]);


    useEffect(() => {                       
        createOntologiesCheckboxList();
        updateCountOfShownOntologies();     
    }, [ontologyFacetData]);


    useEffect(() => {                       
        createOntologiesCheckboxList();        
        setIsLoading(false);  
    }, [countOfShownOntologies, ontologyListShowAll]);


    useEffect(() => {                       
        enableSelectedCheckBoxesOnLoad(); 
    }, [typesCheckBoxesToRender, ontologyCheckBoxesToRender, collectionCheckBoxesToRender]);



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
                        <a onClick={props.clearFacet}>Clear All Filters</a>
                        <br></br>
                    </div>
                </div> 
                <h4>{"Type"}</h4>
                 <div class="facet-box" id="facet-types-list">                                              
                    {typesCheckBoxesToRender}
                </div>
                <h4>{"Ontologies"}</h4>
                <div class="facet-box">                            
                    {ontologyCheckBoxesToRender}                                                
                    {showMoreIsNeededForOntologies && 
                        <div className="text-center" id="search-facet-show-more-ontology-btn">
                            <a className="show-more-btn"  onClick={handleOntologyShowMoreClick}>{showMoreLessOntologiesText}</a>
                        </div>
                    }
                </div>
                {process.env.REACT_APP_COLLECTION_FACET_SHOWN === "true" && 
                    <>
                        <h4>{"Collections"}</h4>
                        <div class="facet-box" id="facet-collections-list">
                            {!appContext.userCollectionEnabled && collectionCheckBoxesToRender}
                            {appContext.userCollectionEnabled && 
                                <>
                                <p>
                                    Your collection named "{appContext.activeUserCollection.title}" is enabled. 
                                </p>
                                <p>
                                    Disable it by clicking <i className="fa fa-close"></i> 
                                    in case you wish to see the full list of collections and ontologies.
                                </p>
                                </>
                            }
                        </div>
                    </>}
            </div>}
        </div>
    );


}

export default Facet;