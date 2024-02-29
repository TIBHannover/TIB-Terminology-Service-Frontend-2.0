import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import Multiselect from 'multiselect-react-dropdown';
import { getJumpToResult } from '../../../api/fetchData';
import SearchLib from '../../../Libs/searchLib';
import OntologyApi from '../../../api/ontology';
import Toolkit from '../../../Libs/Toolkit';
import OntologyLib from '../../../Libs/OntologyLib';



const AdvancedSearch = (props) => {

    let currentUrlParams = new URL(window.location).searchParams;

    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [exact, setExact] = useState(currentUrlParams.get('exact') === "true" ? true : false);
    const [isLeaf, setIsLeaf] = useState(currentUrlParams.get('isleaf') === "true" ? true : false);
    const [searchInSelectValue, setSearchInSelectValue] = useState(currentUrlParams.get('searchin') ? currentUrlParams.getAll('searchin') : []);
    const [searchUnderselectedTerms, setSearchUnderselectedTerms] = useState(SearchLib.getSearchUnderTermsFromUrl());
    const [searchUnderAllselectedTerms, setSearchUnderAllselectedTerms] = useState(SearchLib.getSearchUnderAllTermsFromUrl());
    const [selectedOntologies, setSelectedOntologies] = useState(SearchLib.getOntologIdsFromUrl());
    const [termListForSearchUnder, setTermListForSearchUnder] = useState([]);
    const [ontologiesListForSelection, setOntologiesListForSelection] = useState([]);
    const [loadingResult, setLoadingResult] = useState(true);

    const history = useHistory();


    const searchInMetaDataOptions = ['label', 'description', 'synonym', 'short_form',  'obo_id', 'annotations', 'iri'];
    
    // The check to see whether we are on an ontology page or not.
    const ontologyId = OntologyLib.getCurrentOntologyIdFromUrlPath();



    async function loadTermsForSelection(query){   
        setLoadingResult(true);         
        if(query === ""){
            setTermListForSearchUnder([]);
            return true;
        }
        let inputQuery = {"searchQuery": query, "types": "class,property"};
        if(ontologyId){
            // restrict the term search to the current opened ontology
            inputQuery['ontologyIds'] = [ontologyId];
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



    async function loadOntologiesForSelection(query){
        let ontologyApi = new OntologyApi({});
        await ontologyApi.fetchOntologyList();
        let ontologyList = [];
        for (let ontology of ontologyApi.list){
            let opt = {};
            opt['text'] = ontology['ontologyId'];
            opt['id'] = ontology['ontologyId'];
            ontologyList.push(opt);
        }
        setOntologiesListForSelection(ontologyList);
    }



    function handleSearchInMultiSelect(selectedList, selectedItem){        
        setSearchInSelectValue(selectedList);
        let currentUrlParams = new URLSearchParams(window.location.search);  
        currentUrlParams.delete('searchin');
        for(let val of selectedList){
            currentUrlParams.append('searchin', val);
        }        
        history.push(window.location.pathname + "?" + currentUrlParams.toString());    
    }



    function handleTermSelectionSearchUnder(selectedList, selectedItem){                
        setSearchUnderselectedTerms(selectedList);
        let currentUrlParams = new URLSearchParams(window.location.search);          
        currentUrlParams.delete('searchunder');        
        for(let term of selectedList){
            currentUrlParams.append('searchunder', encodeURIComponent(JSON.stringify(term)));            
        }  
        history.push(window.location.pathname + "?" + currentUrlParams.toString());    
    }



    function handleTermSelectionSearchUnderAll(selectedList, selectedItem){                
        setSearchUnderAllselectedTerms(selectedList);
        let currentUrlParams = new URLSearchParams(window.location.search);          
        currentUrlParams.delete('searchunderall');        
        for(let term of selectedList){
            currentUrlParams.append('searchunderall', encodeURIComponent(JSON.stringify(term)));            
        }  
        history.push(window.location.pathname + "?" + currentUrlParams.toString());    
    }



    function handleOntologySelection(selectedList, selectedItem){                        
        setSelectedOntologies(selectedList);
        let currentUrlParams = new URLSearchParams(window.location.search);          
        currentUrlParams.delete('ontology');        
        for(let ontology of selectedList){
            currentUrlParams.append('ontology', ontology['id']);            
        }  
        history.push(window.location.pathname + "?" + currentUrlParams.toString());    
    }



    function handleExactCheckboxClick(e){
        let searchUrl = new URL(window.location);
        setExact(e.target.checked);
        searchUrl.searchParams.set('exact', e.target.checked); 
        history.replace({...history.location, search: searchUrl.searchParams.toString()});
    }
    
    
    
    function handleObsoletesCheckboxClick(e){        
        let newUrl = Toolkit.setObsoleteAndReturnNewUrl(e.target.checked);                
        history.push(newUrl);
    }


    function handleIsLeafCheckboxClick(e){
        let searchUrl = new URL(window.location);
        setIsLeaf(e.target.checked);
        searchUrl.searchParams.set('isleaf', e.target.checked); 
        history.replace({...history.location, search: searchUrl.searchParams.toString()});
    }


    function handleAdvancedSearchShowHide(){
        setShowAdvancedSearch(!showAdvancedSearch);
    }



    useEffect(() => {
        if(!ontologyId){
            // Only load the list when we are NOT on an ontology page.
            loadOntologiesForSelection();
        }        
        if(Toolkit.getObsoleteFlagValue()){ document.getElementById("obsoletes-checkbox").checked = true;}   
        if(exact){ document.getElementById("exact-checkbox").checked = true;}
        if(isLeaf){ document.getElementById("isLeaf-checkbox").checked = true;}
    }, []);



    return(
        <>
            <div className='row site-header-search-filters-container'>
              <div className='col-lg-2 col-sm-3'>
                <input type="checkbox" className='form-check-input' id="exact-checkbox" value="exact match" onClick={handleExactCheckboxClick}/><label className="exact-label">Exact Match</label> 
              </div>
              <div className='col-lg-2 col-sm-3'>
                <input type="checkbox" className='form-check-input' id="obsoletes-checkbox" value="Obsolete results" onClick={handleObsoletesCheckboxClick}/><label className="exact-label">Obsolete terms</label>
              </div>
              <div className='col-lg-2 col-sm-3'>
                <input type="checkbox" className='form-check-input' id="isLeaf-checkbox" value="Obsolete results" onClick={handleIsLeafCheckboxClick} /><label className="exact-label">Only Leafs</label>
              </div>
              <div className="col-lg-4 col-sm-3">
                <a onClick={handleAdvancedSearchShowHide}>
                  {!showAdvancedSearch && <i className='fa fa-angle-double-down adv-search-btn'>More Search Options</i>}
                  {showAdvancedSearch && <i className='fa fa-angle-double-up adv-search-btn'>Hide Search Options</i>}
                </a>
              </div>
            </div>
            {showAdvancedSearch &&
                <div className='row adv-search-container'>
                <div className='col-sm-10'>
                <br></br>
                    <br></br>
                    <h5  className='text-center'><b>Advanced Search Options</b></h5>
                    <div className="row">
                        <div className="col-sm-11">
                            <label for='adv-s-search-in-select' title='Search based on specific Metadata such as label or description.'>
                                Search In (Metadata)
                                <div className='tooltip-questionmark'>?</div>
                            </label>                    
                            <Multiselect
                                isObject={false}
                                options={searchInMetaDataOptions}  
                                selectedValues={searchInSelectValue}                       
                                onSelect={handleSearchInMultiSelect}
                                onRemove={handleSearchInMultiSelect}                        
                                avoidHighlightFirstOption={true}                        
                                closeIcon={"cancel"}
                                id="adv-s-search-in-select"
                                placeholder="label, description, ..."
                            />
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-sm-11">
                            <label for='adv-s-search-under-term' title='In this field, you can set the classes or properties that are supposed to be the parent(s) of the one you search for (Is-a relation).'>
                                Search Under
                                <div className='tooltip-questionmark'>?</div>
                            </label>
                            <Multiselect
                                isObject={true}
                                options={termListForSearchUnder}  
                                selectedValues={searchUnderselectedTerms}                       
                                onSelect={handleTermSelectionSearchUnder}
                                onRemove={handleTermSelectionSearchUnder}    
                                onSearch={loadTermsForSelection}
                                displayValue={"text"}
                                avoidHighlightFirstOption={true}       
                                loading={loadingResult}                 
                                closeIcon={"cancel"}
                                id="adv-s-search-under-term"
                                placeholder="class, property, ..."                        
                            />
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-sm-11">
                            <label for='adv-s-search-under-term' title='You can restrict a search to all children of a given term, meaning to search under (subclassOf/is-a plus any hierarchical/transitive properties like ‘part of’ or ‘develops from’)'>
                                Search Under All
                                <div className='tooltip-questionmark'>?</div>
                            </label>
                            <Multiselect
                                isObject={true}
                                options={termListForSearchUnder}  
                                selectedValues={searchUnderAllselectedTerms}                       
                                onSelect={handleTermSelectionSearchUnderAll}
                                onRemove={handleTermSelectionSearchUnderAll}    
                                onSearch={loadTermsForSelection}
                                displayValue={"text"}
                                avoidHighlightFirstOption={true}       
                                loading={loadingResult}                 
                                closeIcon={"cancel"}
                                id="adv-s-search-under-all-term"
                                placeholder="class, property, ..."                        
                            />
                        </div>
                    </div>
                    {!ontologyId &&
                        // We do not want to show the ontology selection when the user is on an ontology page already
                        <>
                        <br></br>
                        <div className="row">
                            <div className="col-sm-11">
                                <label for='adv-s-search-under-term' title='You can restrict the search to one or multiple ontologies.'>
                                    Search In Ontology
                                    <div className='tooltip-questionmark'>?</div>
                                </label>
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
                                    />
                                }
                            </div>
                        </div>
                        </>
                    }
                </div>
                </div>                     
            }                
        </>
    );


}

export default AdvancedSearch;