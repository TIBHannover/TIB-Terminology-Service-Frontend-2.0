import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import Multiselect from 'multiselect-react-dropdown';
import { getJumpToResult } from '../../../api/fetchData';
import SearchLib from '../../../Libs/searchLib';



const AdvancedSearch = (props) => {

    let currentUrlParams = new URL(window.location).searchParams;

    const [searchInSelectValue, setSearchInSelectValue] = useState(currentUrlParams.get('searchin') ? currentUrlParams.getAll('searchin') : []);
    const [searchUnderselectedTerms, setSearchUnderselectedTerms] = useState(SearchLib.getSearchUnderTermsFromUrl());
    const [termListForSearchUnder, setTermListForSearchUnder] = useState([]);
    const [searchUnderLoading, setSearchUnderLoading] = useState(true);

    const history = useHistory();


    const searchInMetaDataOptions = ['label', 'description', 'synonym', 'short_form',  'obo_id', 'annotations', 'iri'];



    function handleSearchInMultiSelect(selectedList, selectedItem){        
        setSearchInSelectValue(selectedList);
        let currentUrlParams = new URLSearchParams(window.location.search);  
        currentUrlParams.delete('searchin');
        for(let val of selectedList){
            currentUrlParams.append('searchin', val);
        }        
        history.push(window.location.pathname + "?" + currentUrlParams.toString());    
    }


    async function loadTermsForSelection(query){   
        setSearchUnderLoading(true);         
        if(query === ""){
            setTermListForSearchUnder([]);
            return true;
        }
        let inputQuery = {"searchQuery": query, "types": "class,property"};
        let terms = await getJumpToResult(inputQuery, 20); 
        let options = [];
        for (let term of terms){
            let opt = {};
            opt['text'] = `${term['ontology_prefix']}:${term['label']} (${term['type']})`;
            opt['iri'] = term['iri'];
            options.push(opt);
        }
        setSearchUnderLoading(false);
        setTermListForSearchUnder(options);
    }


    function handleTermSelection(selectedList, selectedItem){                
        setSearchUnderselectedTerms(selectedList);
        let currentUrlParams = new URLSearchParams(window.location.search);          
        currentUrlParams.delete('searchunder');        
        for(let term of selectedList){
            currentUrlParams.append('searchunder', encodeURIComponent(JSON.stringify(term)));            
        }  
        history.push(window.location.pathname + "?" + currentUrlParams.toString());    
    }




    return(
        <>
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
                    <label for='adv-s-search-under-term' title='In this field, you can set the classes or properties that are supposed to be the parent(s) of the one you search for.'>
                        Search Under
                        <div className='tooltip-questionmark'>?</div>
                    </label>
                    <Multiselect
                        isObject={true}
                        options={termListForSearchUnder}  
                        selectedValues={searchUnderselectedTerms}                       
                        onSelect={handleTermSelection}
                        onRemove={handleTermSelection}    
                        onSearch={loadTermsForSelection}
                        displayValue={"text"}
                        avoidHighlightFirstOption={true}       
                        loading={searchUnderLoading}                 
                        closeIcon={"cancel"}
                        id="adv-s-search-under-term"
                        placeholder="class, property, ..."                        
                    />
                </div>
            </div>
        </>
    );


}

export default AdvancedSearch;