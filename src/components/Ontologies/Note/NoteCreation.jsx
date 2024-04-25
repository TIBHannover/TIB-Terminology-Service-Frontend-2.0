import {useEffect, useState, useContext} from "react";
import {getTextEditorContent} from "../../common/TextEditor/TextEditor";
import * as constantsVars from './Constants';
import { submitNote } from "../../../api/tsMicroBackendCalls";
import { NoteCreationRender } from "./renders/NoteCreationRender";
import TermApi from "../../../api/term";
import { OntologyPageContext } from "../../../context/OntologyPageContext";
import { AppContext } from "../../../context/AppContext";
import { NoteContext } from "../../../context/NoteContext";
import Login from "../../User/Login/TS/Login";
import PropTypes from 'prop-types';




const NoteCreation = (props) => {
    /* 
        This component is responsible for rendering the note creation form.
        It uses the AppContext to get the user information.
        It uses the NoteContext.

    */

    const noteContext = useContext(NoteContext);
    const appContext = useContext(AppContext);

    let targetType = constantsVars.NOTE_COMPONENT_VALUES.indexOf(noteContext.selectedTermTypeInTree);
    targetType = targetType !== -1 ? targetType : 1;
    let selectedTerm = noteContext.selectedTermInTree 
        ? {"iri": noteContext.selectedTermInTree['iri'], "label": noteContext.selectedTermInTree['label']} 
        : {"iri": null, "label": null};

    const ontologyPageContext = useContext(OntologyPageContext);    

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
            selectedTargetTermIri = ontologyPageContext.ontology.ontologyId;
        }

        
        let targetType = constantsVars.NOTE_COMPONENT_VALUES[targetArtifactType];
        
        if(noteContext.selectedTermInTree){
            // Note creation for an specific term in from term detail tabel
            selectedTargetTermIri = noteContext.selectedTermInTree['iri'];
            targetType = props.targetArtifactType;
        }
                
        let data = new FormData();
        data.append("title", noteTitle);
        data.append("semantic_component_iri", selectedTargetTermIri);
        data.append("content", noteContent);
        data.append("ontology_id", ontologyPageContext.ontology.ontologyId);        
        data.append("semantic_component_type", targetType);
        data.append("visibility",  constantsVars.VISIBILITY_VALUES[visibility]);
        if(publishToParent && parentOntology){
            data.append("parentOntology", parentOntology);
        }
        submitNote(data).then((newNoteId) => {
            noteContext.setNoteCreationResultStatus(newNoteId);
            closeModal(newNoteId);
        });
    }


    async function handleJumtoSelection(selectedTerm){ 
        if(selectedTerm){
            document.getElementById("edit-note-modal" + noteIdForRender).getElementsByClassName('react-autosuggest__input')[0].style.border = '';
            let termApi = new TermApi(ontologyPageContext.ontology.ontologyId, selectedTerm['iri'], constantsVars.TERM_TYPES[targetArtifactType]);
            let parentOnto = await termApi.getClassOriginalOntology();
            setSelectedTermFromAutoComplete(selectedTerm);
            setParentOntology(parentOnto);
        }        
    }


    function handlePublishToParentCheckbox(e){
        setPublishToParent(e.target.checked);
    }


    useEffect(async() => {
        if(noteContext.selectedTermInTree){
            let termApi = new TermApi(ontologyPageContext.ontology.ontologyId, noteContext.selectedTermInTree['iri'], constantsVars.TERM_TYPES[targetArtifactType]);
            let parentOnto = await termApi.getClassOriginalOntology();            
            setParentOntology(parentOnto);
        }           
    }, [noteContext.selectedTermInTree]);


    if(process.env.REACT_APP_NOTE_FEATURE !== "true"){            
        return null;
    }
    if(!appContext.user){
        const loginModalId = "loginModalAddNote";
        const addNoteBtn = <div className="row float-right">
                                <div className="col-sm-12">
                                    <button type="button" 
                                        class="btn btn-secondary" 
                                        data-toggle="modal" 
                                        data-target="#loginModalAddNote"
                                        data-backdrop="static"
                                        data-keyboard="false"                                    
                                        >
                                        Add Note
                                    </button>
                                </div>
                            </div>   
        return (            
            <Login isModal={true}  customLoginBtn={addNoteBtn} customModalId={loginModalId} />
        );
    }

    return (
        <NoteCreationRender          
            key={"note-creation-render"}            
            closeModal={closeModal}            
            targetArtifact={targetArtifactType}
            changeArtifactType={changeArtifactType}            
            visibility={visibility}
            changeVisibility={changeVisibility}              
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


NoteCreation.propTypes = {
    targetArtifactType: PropTypes.string,
}

export default NoteCreation;