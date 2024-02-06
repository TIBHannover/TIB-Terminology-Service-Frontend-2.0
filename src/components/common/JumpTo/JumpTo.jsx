import { useState, useEffect } from "react";
import Autosuggest from 'react-autosuggest';
import { getJumpToResult } from "../../../api/fetchData";
import '../../layout/jumpTo.css';
import '../../layout/reactAutoSuggestLib.css';



const TYPE_MAPP = {"terms": "class", "properties": "property", "individuals": "individual"};


const JumpTo = (props) => {
    const [enteredTerm, setEnteredTerm] = useState(props.initialInput ? props.initialInput : "");
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
        let type = TYPE_MAPP[props.targetType];        
        if(type === "class" && props.isSkos){
            type = "individual"; 
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
                {props.label && <label for="jumpto-autosuggest-box">{props.label}</label>}
                <Autosuggest
                    suggestions={resultList}
                    onSuggestionsFetchRequested={onAutoCompleteChange}
                    onSuggestionsClearRequested={clearAutoComplete}
                    getSuggestionValue={getAutoCompleteValue}
                    renderSuggestion={rendetAutoCompleteItem}
                    onSuggestionSelected={onAutoCompleteSelecteion}
                    inputProps={inputPropsAutoSuggest}
                    id={props.id ? props.id : "jumpto_auto_suggest"}
                />
            </div>
        </div>
    );
}


export default JumpTo;