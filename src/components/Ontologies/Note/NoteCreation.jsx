import {useState} from "react";
import {getJumpToResult} from "../../../api/fetchData";
import {getTextEditorContent} from "../../common/TextEditor/TextEditor";
import * as constantsVars from './Constants';
import { submitNote } from "../../../api/tsMicroBackendCalls";
import { NoteCreationRender } from "./renders/NoteCreationRender";




const NoteCreation = (props) => {
    let targetArtifactType = constantsVars.NOTE_COMPONENT_VALUES.indexOf(props.targetArtifactType);
    targetArtifactType = targetArtifactType !== -1 ? targetArtifactType : 1;    
    const [targetArtifact, setTargetArtifact] = useState(targetArtifactType);
    const [visibility, setVisibility] = useState(constantsVars.VISIBILITY_ONLY_ME);
    const [editorState, setEditorState] = useState(null);
    const [autoCompleteSuggestionsList, setAutoCompleteSuggestionsList] = useState([]);
    const [enteredTermInAutoComplete, setEnteredTermInAutoComplete] = useState(props.targetArtifactLabel);
    const [selectedTermFromAutoComplete, setSelectedTermFromAutoComplete] = useState({"iri": null, "label": null});    
    const [noteTitle, setNoteTitle] = useState("");
    const noteIdForRender = "-add-note";


    function onTextInputChange(){        
        document.getElementById("noteTitle" + noteIdForRender).style.borderColor = '';
        setNoteTitle(document.getElementById('noteTitle' + noteIdForRender).value);        
    }



    function onTextAreaChange (newEditorState){
        document.getElementsByClassName('rdw-editor-main')[0].style.border = '';
        setEditorState(newEditorState);                
    };


    function changeArtifactType(e){                   
        setTargetArtifact(e.target.value);
        setAutoCompleteSuggestionsList([]);
        setEnteredTermInAutoComplete("");       
    }


    function changeVisibility(e){                   
        setVisibility(e.target.value);        
    }


    function closeModal(newNoteId=true){                
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
    }


    function submit(){
        let formIsValid = true;
        let noteTitle = document.getElementById('noteTitle' + noteIdForRender).value;
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
            document.getElementById('noteTitle' + noteIdForRender).style.borderColor = 'red';
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
            selectedTargetTermIri = props.ontologyId;
        }

        
        let targetArtifactType = constantsVars.NOTE_COMPONENT_VALUES[targetArtifact];
        
        if(props.targetArtifactType){
            selectedTargetTermIri = props.targetArtifactIri;
            targetArtifactType = props.targetArtifactType;
        }
                
        let data = new FormData();
        data.append("title", noteTitle);
        data.append("semantic_component_iri", selectedTargetTermIri);
        data.append("content", noteContent);
        data.append("ontology_id", props.ontologyId);        
        data.append("semantic_component_type", targetArtifactType);
        data.append("visibility",  constantsVars.VISIBILITY_VALUES[visibility]);
        submitNote(data).then((newNoteId) => {
            props.noteListSubmitStatusHandler(newNoteId);
            closeModal(newNoteId);
        });
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
            inputForAutoComplete['ontologyIds'] = props.ontologyId;
            inputForAutoComplete['types'] = type;            
            let autoCompleteResult = await getJumpToResult(inputForAutoComplete);
            setAutoCompleteSuggestionsList(autoCompleteResult);                                  
        }       
    }


    function clearAutoComplete(){
        document.getElementsByClassName('react-autosuggest__input')[0].style.border = '';
        setAutoCompleteSuggestionsList([]);        
    }


    function onAutoCompleteTextBoxChange (event, { newValue }){
        document.getElementsByClassName('react-autosuggest__input')[0].style.border = '';
        setEnteredTermInAutoComplete(newValue);        
    }
    

    
    function onAutoCompleteSelecteion(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }){
            let autoCompleteSelectedTerm = selectedTermFromAutoComplete;
            autoCompleteSelectedTerm['iri'] = autoCompleteSuggestionsList[suggestionIndex]['iri'];
            autoCompleteSelectedTerm['label'] = autoCompleteSuggestionsList[suggestionIndex]['label'];
            setSelectedTermFromAutoComplete(autoCompleteSelectedTerm);        
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
            ontologyId={props.ontologyId}
            autoCompleteSuggestionsList={autoCompleteSuggestionsList}
            onAutoCompleteChange={onAutoCompleteChange}
            clearAutoComplete={clearAutoComplete}
            onAutoCompleteSelecteion={onAutoCompleteSelecteion}
            targetArtifactLabel={props.targetArtifactLabel}
            noteTitle={noteTitle}
            onTextInputChange={onTextInputChange}
            editorState={editorState}
            onTextAreaChange={onTextAreaChange}
            submit={submit}
            targetNoteId={noteIdForRender}
            mode={"newNote"}
            isGeneric={props.isGeneric}
        />
    );

}


export default NoteCreation;