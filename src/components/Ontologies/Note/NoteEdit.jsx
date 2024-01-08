import {useState} from "react";
import {getAutoCompleteResult} from "../../../api/fetchData";
import {getTextEditorContent, createTextEditorStateFromJson}  from "../../common/TextEditor/TextEditor";
import * as constantsVars from './Constants';
import { submitNote } from "../../../api/tsMicroBackendCalls";
import { NoteCreationRender } from "./renders/NoteCreationRender";



const NoteEdit = (props) => {    
    const [targetArtifact, setTargetArtifact] = useState(constantsVars.NOTE_COMPONENT_VALUES.indexOf(props.note['semantic_component_type']));
    const [visibility, setVisibility] = useState(constantsVars.VISIBILITY_VALUES.indexOf(props.note['visibility']));
    const [editorState, setEditorState] = useState(createTextEditorStateFromJson(props.note['content']));
    const [autoCompleteSuggestionsList, setAutoCompleteSuggestionsList] = useState([]);
    const [enteredTermInAutoComplete, setEnteredTermInAutoComplete] = useState(props.note['semantic_component_label']);
    const [selectedTermFromAutoComplete, setSelectedTermFromAutoComplete] = useState({"iri": props.note['semantic_component_iri'], "label": props.note['semantic_component_label']});    
    const [noteTitle, setNoteTitle] = useState(props.note['title']);

       
    function onTextInputChange(e){        
        document.getElementById("noteTitle" + props.note['id']).style.borderColor = '';
        setNoteTitle(document.getElementById('noteTitle' + props.note['id']).value);         
    }

    
    function onTextAreaChange (newEditorState){
        document.getElementsByClassName('rdw-editor-main')[0].style.border = '';
        setEditorState(newEditorState);                
    };


    function changeArtifactType(e){                   
        setTargetArtifact( e.target.value);
        setAutoCompleteSuggestionsList([]);
        setEnteredTermInAutoComplete("");       
    }

    
    function changeVisibility(e){                   
        setVisibility(e.target.value);        
    }


    function edit(){
        let formIsValid = true;
        let noteTitle = document.getElementById("noteTitle" + props.note['id']).value;
        let selectedTargetTermIri = selectedTermFromAutoComplete['iri'];        
        let noteContent = "";        
        if(!editorState){            
            document.getElementsByClassName('rdw-editor-main')[0].style.border = '1px solid red';
            formIsValid = false;
        }
        else{
            noteContent = getTextEditorContent(editorState);             
        }

        if(!noteTitle || noteTitle === ""){
            document.getElementById("noteTitle" + props.note['id']).style.borderColor = 'red';
            formIsValid = false;
        }
        
        if(!noteContent || noteContent.trim() === ""){
            document.getElementsByClassName('rdw-editor-main')[0].style.border = '1px solid red';
            formIsValid = false;
        }

        if(parseInt(targetArtifact) !== constantsVars.ONTOLOGY_COMPONENT_ID && !selectedTargetTermIri){
            document.getElementsByClassName('react-autosuggest__input')[0].style.border = '1px solid red';
            formIsValid = false;
        }
        
        if(!formIsValid){
            return;
        }

        if(parseInt(targetArtifact) === constantsVars.ONTOLOGY_COMPONENT_ID){
            selectedTargetTermIri = props.note['ontology_id'];
        }

        
        let targetArtifactType = constantsVars.NOTE_COMPONENT_VALUES[targetArtifact];
        
        if(props.targetArtifactType){
            selectedTargetTermIri = props.targetArtifactIri;
            targetArtifactType = props.targetArtifactType;
        }
                
        let data = new FormData();
        data.append("noteId", props.note['id']);
        data.append("title", noteTitle);
        data.append("semantic_component_iri", selectedTargetTermIri);
        data.append("content", noteContent);
        data.append("ontology_id", props.note['ontology_id']);
        data.append("semantic_component_type", targetArtifactType);
        data.append("visibility",  constantsVars.VISIBILITY_VALUES[visibility]);
        submitNote(data, true).then((updatedNoteId) => {closeModal(true);});
    }


    async function onAutoCompleteChange({value}){   
        
        let enteredTerm = value;                  
        let type = constantsVars.NOTE_COMPONENT_VALUES[targetArtifact];        
        if(type !== "property" && type !== "individual"){
            type = props.isSkos ? "individual" : "class"; 
        }       
        if (enteredTerm.length > 0){
            let inputForAutoComplete = {}; 
            inputForAutoComplete['searchQuery'] = value;
            inputForAutoComplete['ontologyIds'] = props.note['ontology_id'];
            inputForAutoComplete['types'] = type; 
            let autoCompleteResult = await getAutoCompleteResult(inputForAutoComplete);
            setAutoCompleteSuggestionsList(autoCompleteResult);                                  
        }       
    }


    function clearAutoComplete(){        
        setAutoCompleteSuggestionsList([]);        
    }


    function onAutoCompleteTextBoxChange (event, { newValue }){       
        setEnteredTermInAutoComplete(newValue);        
    }


    function onAutoCompleteSelecteion(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }){
        let autoCompleteSelectedTerm = selectedTermFromAutoComplete;
        autoCompleteSelectedTerm['iri'] = autoCompleteSuggestionsList[suggestionIndex]['iri'];
        autoCompleteSelectedTerm['label'] = autoCompleteSuggestionsList[suggestionIndex]['label'];
        setSelectedTermFromAutoComplete(autoCompleteSelectedTerm);        
    }


    function closeModal(reloadPage=false){   
        console.log(reloadPage)             
        let modalBackDrop = document.getElementsByClassName('modal-backdrop');
        document.body.classList.remove('modal-open');
        if(modalBackDrop.length === 1){
            modalBackDrop[0].remove();
        }
        setEditorState(null);
        setTargetArtifact(constantsVars.ONTOLOGY_COMPONENT_ID);
        setAutoCompleteSuggestionsList([]);
        setEnteredTermInAutoComplete("");
        setSelectedTermFromAutoComplete({"iri": null, "label": null});     
        if(reloadPage){
            let searchParams = new URLSearchParams(window.location.search);
            let locationObject = window.location;        
            window.location.replace(locationObject.pathname + "?" +  searchParams.toString());
        }
    }


    if(process.env.REACT_APP_NOTE_FEATURE !== "true"){            
        return null;
    }    
    if(!localStorage.getItem('isLoginInTs') || localStorage.getItem('isLoginInTs') !== "true"){
        return "";
    }

    return (
        <NoteCreationRender 
            enteredTermInAutoComplete={enteredTermInAutoComplete}
            onAutoCompleteTextBoxChange={onAutoCompleteTextBoxChange}            
            closeModal={closeModal}
            isGeneric={props.isGeneric}
            targetArtifact={targetArtifact}
            changeArtifactType={changeArtifactType}
            visibility={visibility}
            changeVisibility={changeVisibility}
            ontologyId={props.note['ontology_id']}
            autoCompleteSuggestionsList={autoCompleteSuggestionsList}
            onAutoCompleteChange={onAutoCompleteChange}
            clearAutoComplete={clearAutoComplete}
            onAutoCompleteSelecteion={onAutoCompleteSelecteion}
            targetArtifactLabel={props.targetArtifactLabel}
            noteTitle={noteTitle}
            onTextInputChange={onTextInputChange}
            editorState={editorState}
            onTextAreaChange={onTextAreaChange}
            submit={edit}
            targetNoteId={props.note['id']}
        />
    );
}


export default NoteEdit;