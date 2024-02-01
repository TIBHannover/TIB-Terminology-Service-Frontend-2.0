import {useState} from "react";
import {getTextEditorContent, createTextEditorStateFromJson}  from "../../common/TextEditor/TextEditor";
import * as constantsVars from './Constants';
import { submitNote } from "../../../api/tsMicroBackendCalls";
import { NoteCreationRender } from "./renders/NoteCreationRender";
import TermApi from "../../../api/term";



const NoteEdit = (props) => {    
    const [targetArtifact, setTargetArtifact] = useState(constantsVars.NOTE_COMPONENT_VALUES.indexOf(props.note['semantic_component_type']));
    const [visibility, setVisibility] = useState(constantsVars.VISIBILITY_VALUES.indexOf(props.note['visibility']));
    const [editorState, setEditorState] = useState(createTextEditorStateFromJson(props.note['content']));        
    const [selectedTermFromAutoComplete, setSelectedTermFromAutoComplete] = useState({"iri": props.note['semantic_component_iri'], "label": props.note['semantic_component_label']});    
    const [noteTitle, setNoteTitle] = useState(props.note['title']);
    const [parentOntology, setParentOntology] = useState(null);
    const [publishToParent, setPublishToParent] = useState(false); 

       
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
        if(publishToParent && parentOntology){
            data.append("parentOntology", parentOntology);
        }
        else{
            data.append("parentOntology", null);
        }
        submitNote(data, true).then((updatedNoteId) => {closeModal(true);});
    }


    function closeModal(reloadPage=false){                  
        let modalBackDrop = document.getElementsByClassName('modal-backdrop');
        document.body.classList.remove('modal-open');
        if(modalBackDrop.length === 1){
            modalBackDrop[0].remove();
        }
        setEditorState(null);
        setTargetArtifact(constantsVars.ONTOLOGY_COMPONENT_ID);                
        setSelectedTermFromAutoComplete({"iri": null, "label": null});     
        if(reloadPage){
            let searchParams = new URLSearchParams(window.location.search);
            let locationObject = window.location;        
            window.location.replace(locationObject.pathname + "?" +  searchParams.toString());
        }
    }

    async function handleJumtoSelection(selectedTerm){ 
        if(selectedTerm){
            let termApi = new TermApi(props.ontologyId, selectedTerm['iri'], constantsVars.TERM_TYPES[targetArtifact]);
            let parentOnto = await termApi.getClassOriginalOntology();
            setSelectedTermFromAutoComplete(selectedTerm);
            setParentOntology(parentOnto);
        }                       
    }


    function handlePublishToParentCheckbox(e){
        setPublishToParent(e.target.checked);
    }


    if(process.env.REACT_APP_NOTE_FEATURE !== "true"){            
        return null;
    }    
    if(!localStorage.getItem('isLoginInTs') || localStorage.getItem('isLoginInTs') !== "true"){
        return "";
    }

    return (
        <NoteCreationRender                              
            closeModal={closeModal}
            isGeneric={props.isGeneric}
            targetArtifact={targetArtifact}
            changeArtifactType={changeArtifactType}
            visibility={visibility}
            changeVisibility={changeVisibility}
            ontologyId={props.note['ontology_id']}                     
            targetArtifactLabel={props.targetArtifactLabel}
            noteTitle={noteTitle}
            onTextInputChange={onTextInputChange}
            editorState={editorState}
            onTextAreaChange={onTextAreaChange}
            submit={edit}
            targetNoteId={props.note['id']}
            handleJumtoSelection={handleJumtoSelection}
            componentIdentity={constantsVars.TERM_TYPES[targetArtifact]}
            parentOntology={parentOntology}
            selectedTerm={selectedTermFromAutoComplete}
            handlePublishToParentCheckbox={handlePublishToParentCheckbox}
        />
    );
}


export default NoteEdit;