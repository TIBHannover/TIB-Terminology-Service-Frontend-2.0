import { useState, useContext } from "react";
import { OntologyPageContext } from "../../../context/OntologyPageContext";
import Autosuggest from 'react-autosuggest';
import { getJumpToResult } from "../../../api/search";
import '../../layout/jumpTo.css';
import '../../layout/reactAutoSuggestLib.css';

type JumpToSuggestion = {
  iri: string;
  label: string;
};

type JumpToProps = {
  targetType: string;
  label?: string;
  handleJumtoSelection: (selectedTerm: JumpToSuggestion | { iri: null; label: null } | null) => void | Promise<void>;
  obsoletes?: boolean;
  initialInput?: string | null;
  id?: string;
};


const TYPE_MAPP = { "terms": "class", "properties": "property", "individuals": "individual" };


const JumpTo = (props: JumpToProps) => {

  const ontologyPageContext = useContext(OntologyPageContext);

  const [enteredTerm, setEnteredTerm] = useState(props.initialInput ? props.initialInput : "");
  const [resultList, setResultList] = useState<JumpToSuggestion[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<JumpToSuggestion | { iri: null; label: null }>({ "iri": null, "label": null });

  const getAutoCompleteValue = (suggestion: JumpToSuggestion) => suggestion.label;
  const rendetAutoCompleteItem = (suggestion: JumpToSuggestion) => (
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


  function onAutoCompleteTextBoxChange(event: unknown, { newValue }: { newValue: string }) {
    setEnteredTerm(newValue);
  }


  async function onAutoCompleteChange({ value }: { value: string }) {
    let enteredTerm = value;
    let type = TYPE_MAPP[props.targetType as keyof typeof TYPE_MAPP];
    if (enteredTerm.length > 0) {
      let inputForAutoComplete: any = {};
      inputForAutoComplete['searchQuery'] = value;
      inputForAutoComplete['ontologyIds'] = ontologyPageContext.ontology.ontologyId;
      inputForAutoComplete['types'] = type;
      inputForAutoComplete['obsoletes'] = props.obsoletes;
      let autoCompleteResult = await getJumpToResult(inputForAutoComplete, 10, ontologyPageContext.ontoLang);
      setResultList(autoCompleteResult as JumpToSuggestion[]);
    }
  }


  function clearAutoComplete() {
    setResultList([]);
    props.handleJumtoSelection(null);
  }


  function onAutoCompleteSelecteion(
    event: unknown,
    { suggestionIndex }: { suggestionIndex: number }
  ) {
    let autoCompleteSelectedTerm = { ...selectedTerm };
    autoCompleteSelectedTerm['iri'] = resultList[suggestionIndex]['iri'];
    autoCompleteSelectedTerm['label'] = resultList[suggestionIndex]['label'];
    setSelectedTerm(autoCompleteSelectedTerm);
    props.handleJumtoSelection(autoCompleteSelectedTerm);
  }



  return (
    <div className="row">
      <div className="col-sm-12 autosuggest-jumpto-container">
        {props.label && <label htmlFor="jumpto-autosuggest-box">{props.label}</label>}
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
