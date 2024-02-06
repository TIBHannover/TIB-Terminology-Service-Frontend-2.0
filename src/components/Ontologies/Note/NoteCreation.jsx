import {useEffect, useState} from "react";
import {getTextEditorContent} from "../../common/TextEditor/TextEditor";
import * as constantsVars from './Constants';
import { submitNote } from "../../../api/tsMicroBackendCalls";
import { NoteCreationRender } from "./renders/NoteCreationRender";
import TermApi from "../../../api/term";




const NoteCreation = (props) => {
    let targetType = constantsVars.NOTE_COMPONENT_VALUES.indexOf(props.targetArtifactType);
    targetType = targetType !== -1 ? targetType : 1;
    let selectedTerm = props.term ? {"iri": props.term['iri'], "label": props.term['label']} : {"iri": null, "label": null};
    const [targetArtifactType, setTargetArtifactType] = useState(targetType);
    const [visibility, setVisibility] = useState(constantsVars.VISIBILITY_ONLY_ME);
    const [editorState, setEditorState] = useState(null);        
    const [selectedTermFromAutoComplete, setSelectedTermFromAutoComplete] = useState(selectedTerm);    
    const [parentOntology, setParentOntology] = useState(null);
    const [publishToParent, setPublishToParent] = useState(false);    
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
        setTargetArtifactType(e.target.value);                
        setParentOntology(null);
        setSelectedTermFromAutoComplete({"iri": null, "label": null});        
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
        // setTargetArtifactType(!props.term constantsVars.ONTOLOGY_COMPONENT_ID);                
        setSelectedTermFromAutoComplete({"iri": null, "label": null});   
        setParentOntology(null);         
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

        if(parseInt(targetArtifactType) !== constantsVars.ONTOLOGY_COMPONENT_ID && !selectedTargetTermIri){                        
            document.getElementById("edit-note-modal" + noteIdForRender).getElementsByClassName('react-autosuggest__input')[0].style.border = '1px solid red';
            formIsValid = false;
        }
        
        if(!formIsValid){
            return;
        }

        if(parseInt(targetArtifactType) === constantsVars.ONTOLOGY_COMPONENT_ID){
            selectedTargetTermIri = props.ontologyId;
        }

        
        let targetType = constantsVars.NOTE_COMPONENT_VALUES[targetArtifactType];
        
        if(props.term){
            // Note creation fro an specific term in from term detail tabel
            selectedTargetTermIri = props.term['iri'];
            targetType = props.targetArtifactType;
        }
                
        let data = new FormData();
        data.append("title", noteTitle);
        data.append("semantic_component_iri", selectedTargetTermIri);
        data.append("content", noteContent);
        data.append("ontology_id", props.ontologyId);        
        data.append("semantic_component_type", targetType);
        data.append("visibility",  constantsVars.VISIBILITY_VALUES[visibility]);
        if(publishToParent && parentOntology){
            data.append("parentOntology", parentOntology);
        }
        submitNote(data).then((newNoteId) => {
            props.noteListSubmitStatusHandler(newNoteId);
            closeModal(newNoteId);
        });
    }


    async function handleJumtoSelection(selectedTerm){ 
        if(selectedTerm){
            document.getElementById("edit-note-modal" + noteIdForRender).getElementsByClassName('react-autosuggest__input')[0].style.border = '';
            let termApi = new TermApi(props.ontologyId, selectedTerm['iri'], constantsVars.TERM_TYPES[targetArtifactType]);
            let parentOnto = await termApi.getClassOriginalOntology();
            setSelectedTermFromAutoComplete(selectedTerm);
            setParentOntology(parentOnto);
        }        
    }


    function handlePublishToParentCheckbox(e){
        setPublishToParent(e.target.checked);
    }


    useEffect(async() => {
        if(props.term){
            let termApi = new TermApi(props.ontologyId, props.term['iri'], constantsVars.TERM_TYPES[targetArtifactType]);
            let parentOnto = await termApi.getClassOriginalOntology();            
            setParentOntology(parentOnto);
        }           
    }, [props.term]);


    if(process.env.REACT_APP_NOTE_FEATURE !== "true"){            
        return null;
    }
    if(!localStorage.getItem('isLoginInTs') || localStorage.getItem('isLoginInTs') !== "true"){
        return "";
    }

    return (
        <NoteCreationRender          
            key={"note-creation-render"}            
            closeModal={closeModal}            
            targetArtifactType={targetArtifactType}
            changeArtifactType={changeArtifactType}
            term={props.term}
            visibility={visibility}
            changeVisibility={changeVisibility}
            ontologyId={props.ontologyId}            
            noteTitle={noteTitle}
            onTextInputChange={onTextInputChange}
            editorState={editorState}
            onTextAreaChange={onTextAreaChange}
            submit={submit}
            targetNoteId={noteIdForRender}
            mode={"newNote"}            
            handleJumtoSelection={handleJumtoSelection}
            componentIdentity={constantsVars.TERM_TYPES[targetArtifactType]}
            parentOntology={parentOntology}
            selectedTerm={selectedTermFromAutoComplete}
            handlePublishToParentCheckbox={handlePublishToParentCheckbox}
        />
    );

}


export default NoteCreation;