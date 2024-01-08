import { useState } from "react";
import Autosuggest from 'react-autosuggest';
import { getJumpToResult } from "../../../api/fetchData";



const JumpTo = (props) => {
    const [enteredTerm, setEnteredTerm] = useState("");
    const [resultList, setResultList] = useState([]);
    const [selectedTerm, setSelectedTerm] = useState( {"iri": null, "label": null});

    const getAutoCompleteValue = suggestion => suggestion.label;
    const rendetAutoCompleteItem = suggestion => (
        <div>
            {suggestion.label}
        </div>
    );

    const value = enteredTerm;
    const inputPropsAutoSuggest = {
        placeholder: 'type your target term ...',
        value,
        onChange: onAutoCompleteTextBoxChange
    };


    function onAutoCompleteTextBoxChange(event, { newValue }){        
        setEnteredTerm(newValue);       
    }


    async function onAutoCompleteChange({value}){   
        let enteredTerm = value;                  
        let type = props.targetType;        
        if(type !== "property" && type !== "individual"){
            type = props.isSkos ? "individual" : "class"; 
        }       
        if (enteredTerm.length > 0){
            let inputForAutoComplete = {};    
            inputForAutoComplete['searchQuery'] = value;
            inputForAutoComplete['ontologyIds'] = props.ontologyId;
            inputForAutoComplete['types'] = type;
            inputForAutoComplete['obsoletes'] = props.obsoletes;
            let autoCompleteResult = await getJumpToResult(inputForAutoComplete);
            setResultList(autoCompleteResult);                                  
        }       
    }


    function clearAutoComplete(){        
        setResultList([]);
        props.handleJumtoSelection(null);
    }


    function onAutoCompleteSelecteion(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }){
        let autoCompleteSelectedTerm = selectedTerm;
        autoCompleteSelectedTerm['iri'] = resultList[suggestionIndex]['iri'];
        autoCompleteSelectedTerm['label'] = resultList[suggestionIndex]['label'];
        setSelectedTerm(autoCompleteSelectedTerm);
        props.handleJumtoSelection(autoCompleteSelectedTerm);   
    }



    return(
        <div className="row">
            <div className="col-sm-12 autosuggest-jumpto-container">
                <label for="jumpto-autosuggest-box">{props.label}</label>                                            
                <Autosuggest
                    suggestions={resultList}
                    onSuggestionsFetchRequested={onAutoCompleteChange}
                    onSuggestionsClearRequested={clearAutoComplete}
                    getSuggestionValue={getAutoCompleteValue}
                    renderSuggestion={rendetAutoCompleteItem}
                    onSuggestionSelected={onAutoCompleteSelecteion}
                    inputProps={inputPropsAutoSuggest}
                    id="jumpto-autosuggest-box"
                />
            </div>
        </div>
    );
}


export default JumpTo;