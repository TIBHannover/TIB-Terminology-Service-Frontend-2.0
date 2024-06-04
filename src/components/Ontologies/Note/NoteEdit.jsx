import {useEffect, useState, useContext} from "react";
import {getTextEditorContent, createTextEditorStateFromJson}  from "../../common/TextEditor/TextEditor";
import * as constantsVars from './Constants';
import { submitNote } from "../../../api/note";
import { NoteCreationRender } from "./renders/NoteCreationRender";
import TermApi from "../../../api/term";
import { AppContext } from "../../../context/AppContext";
import { OntologyPageContext } from "../../../context/OntologyPageContext";
import PropTypes from 'prop-types';



const NoteEdit = (props) => {

    /* 
        This component is responsible for rendering the note edit form.
        It uses the AppContext to get the user information.
        It uses the OntologyPageContext to get the ontology information.
        It uses the submitNote function to submit the note to the backend.
    */
    
    const appContext = useContext(AppContext);
    const ontologyPageContext = useContext(OntologyPageContext);

    const [targetArtifact, setTargetArtifact] = useState(constantsVars.NOTE_COMPONENT_VALUES.indexOf(props.note['semantic_component_type']));
    const [visibility, setVisibility] = useState(constantsVars.VISIBILITY_VALUES.indexOf(props.note['visibility']));
    const [editorState, setEditorState] = useState(createTextEditorStateFromJson(props.note['content']));        
    const [selectedTermFromAutoComplete, setSelectedTermFromAutoComplete] = useState({"iri": props.note['semantic_component_iri'], "label": props.note['semantic_component_label']});    
    const [noteTitle, setNoteTitle] = useState(props.note['title']);
    const [parentOntology, setParentOntology] = useState(props.note['parent_ontology'] ? props.note['parent_ontology'] : null);
    const [publishToParent, setPublishToParent] = useState(props.note['parent_ontology'] ? true : false); 
    
       
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
        let selectedTargetTermLabel = selectedTermFromAutoComplete['label'];        
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
            selectedTargetTermLabel = props.note['ontology_id'];
        }

        
        let targetArtifactType = constantsVars.NOTE_COMPONENT_VALUES[targetArtifact];
                
        let data = {};
        data["noteId"] = props.note['id'];
        data["title"] = noteTitle;
        data["semantic_component_iri"] = selectedTargetTermIri;
        data["content"] = noteContent;
        data["ontology_id"] = props.note['ontology_id'];
        data["semantic_component_type"] = targetArtifactType;
        data["semantic_component_label"] = selectedTargetTermLabel;
        data["visibility"] = constantsVars.VISIBILITY_VALUES[visibility];
        if(publishToParent && parentOntology){
            data["parentOntology"] = parentOntology;
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
        setSelectedTermFromAutoComplete({"iri": null, "label": null});     
        if(reloadPage){
            let searchParams = new URLSearchParams(window.location.search);
            let locationObject = window.location;        
            window.location.replace(locationObject.pathname + "?" +  searchParams.toString());
        }
    }

    async function handleJumtoSelection(selectedTerm){ 
        if(selectedTerm){
            let termApi = new TermApi(ontologyPageContext.ontology.ontologyId, selectedTerm['iri'], constantsVars.TERM_TYPES[targetArtifact]);
            let parentOnto = await termApi.getClassOriginalOntology();
            setSelectedTermFromAutoComplete(selectedTerm);
            setParentOntology(parentOnto);
        }                       
    }


    function handlePublishToParentCheckbox(e){
        setPublishToParent(e.target.checked);
    }


    useEffect(async() => {
        let termApi = new TermApi(props.note['ontology_id'], props.note['semantic_component_iri'], constantsVars.TERM_TYPES[targetArtifact]);
        let parentOnto = await termApi.getClassOriginalOntology();        
        setParentOntology(parentOnto);
        setSelectedTermFromAutoComplete({"iri": props.note['semantic_component_iri'], "label": props.note['semantic_component_label']});
    }, []);


    if(process.env.REACT_APP_NOTE_FEATURE !== "true"){            
        return null;
    }    
    if(!appContext.user){
        return "";
    }

    return (
        <NoteCreationRender           
            key={"note-edit-render-" + props.note['id']}                   
            closeModal={closeModal}            
            targetArtifact={targetArtifact}
            term={{"iri": props.note['semantic_component_iri'], "label": props.note['semantic_component_label']}}
            changeArtifactType={changeArtifactType}
            visibility={visibility}
            changeVisibility={changeVisibility}
            ontologyId={props.note['ontology_id']}                                 
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

NoteEdit.propTypes = {
    note: PropTypes.object.isRequired,
    term: PropTypes.string.isRequired
};


export default NoteEdit;