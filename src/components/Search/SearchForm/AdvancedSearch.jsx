import { useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import { getJumpToResult } from '../../../api/fetchData';



const AdvancedSearch = (props) => {

    const [searchInSelectValue, setSearchInSelectValue] = useState([]);
    const [selectedTerms, setSelectedTerms] = useState([]);
    const [termListForSelection, setTermListForSelection] = useState([]);


    const searchInMetaDataOptions = ['label', 'description', 'synonym', 'short_form',  'obo_id', 'annotations', 'iri'];



    function handleSearchInMultiSelect(selectedList, selectedItem){        
        setSearchInSelectValue(selectedList)
    }


    async function loadTermsForSelection(query){            
        if(query === ""){
            setTermListForSelection([]);
            return true;
        }
        let inputQuery = {"searchQuery": query, "types": "class,property"};
        let terms = await getJumpToResult(inputQuery, 20); 
        let options = [];
        for (let term of terms){
            let opt = {};
            opt['text'] = term['ontology_prefix'] + ":" + term['label'];
            opt['iri'] = term['iri'];
            options.push(opt);
        }          
        setTermListForSelection(options);
    }


    function handleTermSelection(selectedList, selectedItem){
        setSelectedTerms(selectedList);
    }



    return(
        <>
            <br></br>
            <br></br>
            <h5  className='text-center'><b>Advanced Search Options</b></h5>
            <div className="row">
                <div className="col-sm-11">
                    <label for='adv-s-search-in-select'>Search In (Metadata)</label>
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
            <div className="row">
                <div className="col-sm-11">
                    <label for='adv-s-search-under-term'>Search Under</label>
                    <Multiselect
                        isObject={true}
                        options={termListForSelection}  
                        selectedValues={selectedTerms}                       
                        onSelect={handleTermSelection}
                        onRemove={handleTermSelection}    
                        onSearch={loadTermsForSelection}
                        displayValue={"text"}
                        avoidHighlightFirstOption={true}                        
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