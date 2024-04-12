import { useState, useEffect } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import { getJumpToResult } from '../../../api/search';
import SearchLib from '../../../Libs/searchLib';
// import OntologyApi from '../../../api/ontology';
import Toolkit from '../../../Libs/Toolkit';
import OntologyLib from '../../../Libs/OntologyLib';
import SearchUrlFactory from '../../../UrlFactory/SearchUrlFactory';



const AdvancedSearch = (props) => {
        
    const [selectedMetaData, setSelectedMetaData] = useState(SearchLib.getSearchInMetadataFieldsFromUrlOrStorage());
    const [selectedSearchUnderTerms, setSelectedSearchUnderTerms] = useState(SearchLib.getSearchUnderTermsFromUrlOrStorage());
    const [selectedSearchUnderAllTerms, setSelectedSearchUnderAllTerms] = useState(SearchLib.getSearchUnderAllTermsFromUrlOrStorage());
    // const [selectedOntologies, setSelectedOntologies] = useState(SearchLib.getAdvancedOntologIdsFromUrlOrStorage());
    const [termListForSearchUnder, setTermListForSearchUnder] = useState([]);
    // const [ontologiesListForSelection, setOntologiesListForSelection] = useState([]);
    const [loadingResult, setLoadingResult] = useState(true);
    const [placeHolderExtraText, setPlaceHolderExtraText] = useState(createOntologyListForPlaceholder([]));

    const searchUrlFactory = new SearchUrlFactory();

    const searchInMetaDataOptions = ['label', 'description', 'synonym', 'short_form',  'obo_id', 'annotations', 'iri'];
    
    // The check to see whether we are on an ontology page or not.
    const ontologyPageId = OntologyLib.getCurrentOntologyIdFromUrlPath();
    
    const ontologyIdsInUrl = SearchLib.getFilterAndAdvancedOntologyIdsFromUrl();



    async function loadTermsForSelection(query){   
        setLoadingResult(true);         
        if(query === ""){
            setTermListForSearchUnder([]);
            return true;
        }
        let inputQuery = {
            "searchQuery": query, 
            "types": "class,property", 
            "ontologyIds": ontologyIdsInUrl,
            "obsoletes": Toolkit.getObsoleteFlagValue()
        };
        if(ontologyPageId){
            // restrict the term search to the current opened ontology
            inputQuery['ontologyIds'] = [ontologyPageId];
        }
        let terms = await getJumpToResult(inputQuery, 20); 
        let options = [];
        for (let term of terms){
            let opt = {};
            opt['text'] = `${term['ontology_prefix']}:${term['label']} (${term['type']})`;
            opt['iri'] = term['iri'];
            options.push(opt);
        }
        setLoadingResult(false);
        setTermListForSearchUnder(options);
    }



    // async function loadOntologiesForSelection(query){
    //     let ontologyApi = new OntologyApi({});
    //     await ontologyApi.fetchOntologyList();
    //     let ontologyList = [];
    //     for (let ontology of ontologyApi.list){
    //         let opt = {};
    //         opt['text'] = ontology['ontologyId'];
    //         opt['id'] = ontology['ontologyId'];
    //         ontologyList.push(opt);
    //     }
    //     setOntologiesListForSelection(ontologyList);
    // }



    function handleSearchInMultiSelect(selectedList, selectedItem){        
        setSelectedMetaData(selectedList);        
    }



    function handleTermSelectionSearchUnder(selectedList, selectedItem){                
        setSelectedSearchUnderTerms(selectedList); 
    }



    function handleTermSelectionSearchUnderAll(selectedList, selectedItem){                
        setSelectedSearchUnderAllTerms(selectedList);          
    }



    // function handleOntologySelection(selectedList, selectedItem){        
    //     setSelectedOntologies(selectedList);  
    //     setPlaceHolderExtraText(createOntologyListForPlaceholder(selectedList));          
    // }



    function createOntologyListForPlaceholder(ontologyList){
        let selectedOntologyIdsText = (ontologyList.length !== 0 ? "in " : "");
        for(let ontology of ontologyList){                      
            selectedOntologyIdsText += (ontology['id'] + ",")
        }
        if(selectedOntologyIdsText !== ""){
            selectedOntologyIdsText = selectedOntologyIdsText.slice(0, -1);
        }
        return selectedOntologyIdsText;       
    }


    function reset(){
        setSelectedMetaData([]);
        setSelectedSearchUnderTerms([]);
        setSelectedSearchUnderAllTerms([]);
        // setSelectedOntologies([]);        
        setPlaceHolderExtraText("");
        searchUrlFactory.resetAdvancedSearchUrlParams();                          
    }

    
    
    function storeStateInLocalStorage(){
        const states = JSON.stringify({
            selectedMetaData,
            selectedSearchUnderTerms,
            selectedSearchUnderAllTerms,
            // selectedOntologies
        });
        
        localStorage.setItem("advancedSearchStates", states);
    }



    // useEffect(() => {
    //     if(!ontologyPageId){
    //         // Only load the list when we are NOT on an ontology page.
    //         loadOntologiesForSelection();
    //     }                       
    // }, []);


    useEffect(() => {
        if(!props.advSearchEnabled){
            searchUrlFactory.disableAdvancedSearchUrlParams();        
        }
        else{
            searchUrlFactory.updateAdvancedSearchUrl({
                searchInValues: selectedMetaData,
                searchUnderTerms: selectedSearchUnderTerms,
                searchUnderAllTerms: selectedSearchUnderAllTerms
            });
        }
    }, [props.advSearchEnabled]);


    useEffect(() => {
        storeStateInLocalStorage();
        props.advSearchEnabled && searchUrlFactory.updateAdvancedSearchUrl({
            searchInValues: selectedMetaData,
            searchUnderTerms: selectedSearchUnderTerms,
            searchUnderAllTerms: selectedSearchUnderAllTerms
        });
    }, [selectedMetaData, selectedSearchUnderTerms, selectedSearchUnderAllTerms]);



    if(process.env.REACT_APP_ADVANCED_SEARCH === "true"){
        return "";
    }

    return(
        <>            
            {props.advSearchEnabled &&
                <div className='row adv-search-container'>
                    <div className='col-sm-9'>
                    <br></br>
                    {/* {!ontologyPageId &&
                            // We do not want to show the ontology selection when the user is on an ontology page already
                            <>
                            <br></br>
                            <div className="row">
                                <div className="col-sm-11">
                                    <div className='row'>
                                        <div className='col-sm-3 adv-search-label-holder'>
                                            <label 
                                                for='adv-s-search-under-term' 
                                                title='You can restrict the search to one or multiple ontologies.'                                        
                                                >
                                                Search In Ontology
                                                <div className='tooltip-questionmark'>?</div>
                                            </label>
                                        </div>
                                        <div className='col-sm-9 adv-search-input-holder'>
                                            {ontologiesListForSelection.length !== 0 &&                                    
                                                <Multiselect
                                                    isObject={true}
                                                    options={ontologiesListForSelection}  
                                                    selectedValues={selectedOntologies}                       
                                                    onSelect={handleOntologySelection}
                                                    onRemove={handleOntologySelection}                            
                                                    displayValue={"text"}
                                                    avoidHighlightFirstOption={true}                                        
                                                    closeIcon={"cancel"}
                                                    id="adv-s-search-in-ontologies"
                                                    placeholder="Enter Ontology name ..."   
                                                    className='multiselect-container'                     
                                                />
                                            }
                                        </div>
                                    </div>                                                                        
                                </div>
                            </div>
                            </>
                        }
                        <br></br>                     */}
                        <div className="row">
                            <div className="col-sm-12">                            
                                <div className='row'>
                                    <div className='col-sm-11 adv-search-label-holder'>
                                        <label for='adv-s-search-in-select' title='Search based on specific Metadata such as label or description.'>
                                            Search In Metadata
                                            <i class="fa fa-question-circle tooltip-questionmark" aria-hidden="true"></i>
                                        </label>   
                                    </div>                                    
                                </div>
                                <div className='row'>
                                    <div className='col-sm-12 adv-search-input-holder'>
                                        <Multiselect
                                            isObject={false}
                                            options={searchInMetaDataOptions}  
                                            selectedValues={selectedMetaData}                       
                                            onSelect={handleSearchInMultiSelect}
                                            onRemove={handleSearchInMultiSelect}                        
                                            avoidHighlightFirstOption={true}                        
                                            closeIcon={"cancel"}
                                            id="adv-s-search-in-select"
                                            placeholder="label, description, ..."
                                        />
                                    </div>
                                </div>                                                                                
                            </div>
                        </div>
                        <br></br>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className='row'>
                                    <div className='col-sm-12 adv-search-label-holder'>
                                        <label for='adv-s-search-under-term' title='In this field, you can set the classes or properties that are supposed to be the parent(s) of the one you search for (Is-a relation).'>
                                            Search under parent  
                                            <i class="fa fa-question-circle tooltip-questionmark" aria-hidden="true"></i>
                                        </label>
                                    </div>                                    
                                </div>
                                <div className='row'>
                                    <div className='col-sm-12 adv-search-input-holder'>
                                        <Multiselect
                                            isObject={true}
                                            options={termListForSearchUnder}  
                                            selectedValues={selectedSearchUnderTerms}                       
                                            onSelect={handleTermSelectionSearchUnder}
                                            onRemove={handleTermSelectionSearchUnder}    
                                            onSearch={loadTermsForSelection}
                                            displayValue={"text"}
                                            avoidHighlightFirstOption={true}       
                                            loading={loadingResult}                 
                                            closeIcon={"cancel"}
                                            id="adv-s-search-under-term"
                                            placeholder={"class, property " + placeHolderExtraText}
                                        />
                                    </div>
                                </div>                                                                
                            </div>
                        </div>
                        <br></br>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className='row'>
                                    <div className='col-sm-12 adv-search-label-holder'>
                                        <label for='adv-s-search-under-term' title='Includes is-a, part-of, and develops-from relations.'>
                                            Search under all transitive parent                                         
                                            <i class="fa fa-question-circle tooltip-questionmark" aria-hidden="true"></i>                                                                                       
                                        </label>
                                    </div>                                    
                                </div>    
                                <div className='row'>
                                    <div className='col-sm-12 adv-search-input-holder'>
                                        <Multiselect
                                            isObject={true}
                                            options={termListForSearchUnder}  
                                            selectedValues={selectedSearchUnderAllTerms}                       
                                            onSelect={handleTermSelectionSearchUnderAll}
                                            onRemove={handleTermSelectionSearchUnderAll}    
                                            onSearch={loadTermsForSelection}
                                            displayValue={"text"}
                                            avoidHighlightFirstOption={true}       
                                            loading={loadingResult}                 
                                            closeIcon={"cancel"}
                                            id="adv-s-search-under-all-term"
                                            placeholder={"class, property " + placeHolderExtraText}
                                        />
                                    </div>
                                </div>                                                            
                            </div>
                        </div>
                        <br></br>                     
                        <div className='row'>
                            <div className='col-sm-12'>
                                <button className='btn btn-secondary' onClick={reset} >Reset</button>
                            </div>
                        </div>
                    </div>
                </div>                     
            }                
        </>
    );


}

export default AdvancedSearch;