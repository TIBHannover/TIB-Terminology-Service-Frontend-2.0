import React from "react";
import { convertToRaw } from 'draft-js';
import draftToMarkdown from 'draftjs-to-markdown';
import {getAutoCompleteResult} from "../../../api/fetchData";
import Autosuggest from 'react-autosuggest';
import AuthTool from "../../User/Login/authTools";
import TextEditor from "../../common/TextEditor/TextEditor";



const ONTOLOGY_COMPONENT_ID = 1;
const CLASS_COMPONENT_ID = 2;
const PROPERTY_COMPONENT_ID = 3;
const INDIVIDUAL_COMPONENT_ID = 4;
const COMPONENT_VALUES = ['', 'ontology', 'class', 'property', 'individual']

const VISIBILITY_ONLY_ME = 1;
const VISIBILITY_TS_USRES = 2;
const VISIBILITY_PUBLIC = 3;
const VISIBILITY_VALUES = ['', 'me', 'internal', 'public']

const getAutoCompleteValue = suggestion => suggestion.label;

const rendetAutoCompleteItem = suggestion => (
    <div>
      {suggestion.label}
    </div>
);




class NoteCreation extends React.Component{
    constructor(props){
        super(props);
        this.state = ({           
           targetArtifact: ONTOLOGY_COMPONENT_ID,
           visibility: VISIBILITY_ONLY_ME,
           editorState:  null,           
           autoCompleteSuggestionsList: [],
           enteredTermInAutoComplete: "",
           selectedTermFromAutoComplete: {"iri": null, "label": null},
           modalIsOpen: false
        });
        
        this.changeArtifactType = this.changeArtifactType.bind(this);
        this.createTypeDropDown = this.createTypeDropDown.bind(this);
        this.onTextAreaChange = this.onTextAreaChange.bind(this);
        this.submitNote = this.submitNote.bind(this);
        this.closeModal = this.closeModal.bind(this);        
        this.createVisibilityDropDown = this.createVisibilityDropDown.bind(this);
        this.changeVisibility = this.changeVisibility.bind(this);
        this.onAutoCompleteChange = this.onAutoCompleteChange.bind(this);
        this.clearAutoComplete = this.clearAutoComplete.bind(this);
        this.onAutoCompleteTextBoxChange = this.onAutoCompleteTextBoxChange.bind(this);
        this.onAutoCompleteSelecteion = this.onAutoCompleteSelecteion.bind(this);
        this.openModal = this.openModal.bind(this);
    }


    onTextInputChange(){       
        document.getElementById('noteTitle').style.borderColor = '';
    }


    onTextAreaChange = (newEditorState) => {
        document.getElementsByClassName('rdw-editor-main')[0].style.border = '';
        this.setState({ editorState: newEditorState });        
    };


    changeArtifactType(e){                   
        this.setState({
            targetArtifact: e.target.value,
            autoCompleteSuggestionsList: [],
            enteredTermInAutoComplete: ""
        });
    }


    changeVisibility(e){                   
        this.setState({
            visibility: e.target.value
        });
    }


    createTypeDropDown(){
        return [            
            <div class="form-group">
                <label for="artifact-types" className='col-form-label'>Target Artifact</label>
                <select className='site-dropdown-menu list-result-per-page-dropdown-menu' id="artifact-types" value={this.state.targetArtifact} onChange={this.changeArtifactType}>
                    <option value={ONTOLOGY_COMPONENT_ID} key={ONTOLOGY_COMPONENT_ID}>Ontology</option>
                    <option value={CLASS_COMPONENT_ID} key={CLASS_COMPONENT_ID}>Class</option>
                    <option value={PROPERTY_COMPONENT_ID} key={PROPERTY_COMPONENT_ID}>Property</option>
                    <option value={INDIVIDUAL_COMPONENT_ID} key={INDIVIDUAL_COMPONENT_ID}>Individual</option>
                </select>  
            </div>            
        ];
    }


    createVisibilityDropDown(){
        return [            
            <div class="form-group">
                <label for="note_visibility" className='col-form-label'>Visibility</label>
                <select className='site-dropdown-menu list-result-per-page-dropdown-menu' id="note_visibility" value={this.state.visibility} onChange={this.changeVisibility}>
                    <option value={VISIBILITY_ONLY_ME} key={VISIBILITY_ONLY_ME}>Only me</option>
                    <option value={VISIBILITY_TS_USRES} key={VISIBILITY_TS_USRES}>Only Terminology Service Users</option>
                    <option value={VISIBILITY_PUBLIC} key={VISIBILITY_PUBLIC}>Everyone</option>                    
                </select>  
            </div>            
        ];
    }


    openModal(){
        this.setState({modalIsOpen: true})
    }


    closeModal(){                
        let modalBackDrop = document.getElementsByClassName('modal-backdrop');
        document.body.classList.remove('modal-open');
        if(modalBackDrop.length === 1){
            modalBackDrop[0].remove();
        }
        this.setState({
            editorState:  null,
            targetArtifact: ONTOLOGY_COMPONENT_ID,
            autoCompleteSuggestionsList: [],
            enteredTermInAutoComplete: "",
            selectedTermFromAutoComplete: {"iri": null, "label": null},
            modalIsOpen: false     
        });            
    }


   

    submitNote(){
        let formIsValid = true;
        let noteTitle = document.getElementById('noteTitle').value;
        let selectedTargetTermIri = this.state.selectedTermFromAutoComplete['iri'];        
        let noteContent = "";
        let targetArtifactId = this.state.targetArtifact;
        if(!this.state.editorState){            
            document.getElementsByClassName('rdw-editor-main')[0].style.border = '1px solid red';
            formIsValid = false;
        }
        else{
            noteContent = this.state.editorState.getCurrentContent();        
            noteContent = draftToMarkdown(convertToRaw(noteContent));  
        }

        if(!noteTitle || noteTitle === ""){
            document.getElementById('noteTitle').style.borderColor = 'red';
            formIsValid = false;
        }
        
        if(!noteContent || noteContent.trim() === ""){
            document.getElementsByClassName('rdw-editor-main')[0].style.border = '1px solid red';
            formIsValid = false;
        }

        if(parseInt(targetArtifactId) !== ONTOLOGY_COMPONENT_ID && !selectedTargetTermIri){
            document.getElementsByClassName('react-autosuggest__input')[0].style.border = '1px solid red';
            formIsValid = false;
        }
        
        if(!formIsValid){
            return;
        }

        if(parseInt(targetArtifactId) === ONTOLOGY_COMPONENT_ID){
            selectedTargetTermIri = this.props.ontologyId;
        }

        
        let targetArtifactType = COMPONENT_VALUES[targetArtifactId];
        
        if(this.props.targetArtifactType){
            selectedTargetTermIri = this.props.targetArtifactIri;
            targetArtifactType = this.props.targetArtifactType;
        }
        
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});       
        let data = new FormData();
        data.append("title", noteTitle);
        data.append("semantic_component_iri", selectedTargetTermIri);
        data.append("content", noteContent);
        data.append("ontology_id", this.props.ontologyId);        
        data.append("semantic_component_type", targetArtifactType);
        data.append("visibility",  VISIBILITY_VALUES[this.state.visibility]);
        fetch(process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/create_note', {method: 'POST',  headers:headers, body: data})
            .then((response) => response.json())
            .then((data) => {
                if(data['_result']){
                    let newNoteId = data['_result']['note_created']['id'];
                    this.props.noteListSubmitStatusHandler(true, newNoteId);                                        
                    this.closeModal();
                }
                else{
                    this.props.noteListSubmitStatusHandler(false);
                    this.closeModal();          
                }
            })
            .catch((error) => {                
                this.props.noteListSubmitStatusHandler(false);
                this.closeModal();               
            });
    }


    async onAutoCompleteChange({value}){   
        let enteredTerm = value;                  
        let type = COMPONENT_VALUES[this.state.targetArtifact];        
        if(type !== "property" && type !== "individual"){
            type = this.props.isSkos ? "individual" : "class"; 
        }       
        if (enteredTerm.length > 0){
            let autoCompleteResult = await getAutoCompleteResult(enteredTerm, this.props.ontologyId, type);
            this.setState({
                autoCompleteSuggestionsList: autoCompleteResult
            });                        
        }       
    }


    clearAutoComplete(){
        document.getElementsByClassName('react-autosuggest__input')[0].style.border = '';
        this.setState({
            autoCompleteSuggestionsList: []
        });
    }


    onAutoCompleteTextBoxChange = (event, { newValue }) => {
        document.getElementsByClassName('react-autosuggest__input')[0].style.border = '';
        this.setState({
          enteredTermInAutoComplete: newValue
        });
      };
    

    
    onAutoCompleteSelecteion(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }){
            let autoCompleteSelectedTerm = this.state.selectedTermFromAutoComplete;
            autoCompleteSelectedTerm['iri'] = this.state.autoCompleteSuggestionsList[suggestionIndex]['iri'];
            autoCompleteSelectedTerm['label'] = this.state.autoCompleteSuggestionsList[suggestionIndex]['label'];
            this.setState({
                selectedTermFromAutoComplete: autoCompleteSelectedTerm
            });
        
    }



    render(){
        if(!localStorage.getItem('isLoginInTs') || localStorage.getItem('isLoginInTs') !== "true"){
            return "";
        }
        const value = this.state.enteredTermInAutoComplete
        const inputProps = {
            placeholder: 'Type your target term',
            value,
            onChange: this.onAutoCompleteTextBoxChange
        };

        return [
            <span>
            <div className="row">
                <div className="col-sm-12 text-center">
                    <button type="button" 
                        class="btn btn-primary" 
                        data-toggle="modal" 
                        data-target="#add-note-modal" 
                        data-backdrop="static"
                        data-keyboard="false" 
                        onClick={() => {this.openModal()}}               
                        >
                        +Add New Note
                    </button>
                </div>
            </div>
            
            {this.state.modalIsOpen && 
                <div class="modal" id="add-note-modal">
                    <div class="modal-dialog modal-xl">
                        <div class="modal-content">                    
                            <div class="modal-header">
                                <h4 class="modal-title">{"Add a New Note"}</h4>
                                <button type="button" class="close close-mark-btn" data-dismiss="modal">&times;</button>
                            </div>
                            <br></br>                                                
                            <div class="modal-body">                                    
                                <div className="row">                                
                                    <div className="col-sm-8">
                                        {this.props.isGeneric && this.createTypeDropDown()}
                                        {this.createVisibilityDropDown()}
                                        {this.props.isGeneric && parseInt(this.state.targetArtifact) === ONTOLOGY_COMPONENT_ID &&
                                            <p>About: <b>{this.props.ontologyId}</b></p>
                                        }
                                        {this.props.isGeneric && parseInt(this.state.targetArtifact) !== ONTOLOGY_COMPONENT_ID &&
                                            <div>
                                                <label className="required_input" for="noteIri">About</label>                                            
                                                <Autosuggest
                                                    suggestions={this.state.autoCompleteSuggestionsList}
                                                    onSuggestionsFetchRequested={this.onAutoCompleteChange}
                                                    onSuggestionsClearRequested={this.clearAutoComplete}
                                                    getSuggestionValue={getAutoCompleteValue}
                                                    renderSuggestion={rendetAutoCompleteItem}
                                                    onSuggestionSelected={this.onAutoCompleteSelecteion}
                                                    inputProps={inputProps}
                                                />
                                                <br></br>
                                            </div>
                                        }
                                        {!this.props.isGeneric && 
                                            <p>About: <b>{this.props.targetArtifactLabel}</b></p>
                                        }
                                        <label className="required_input" for="noteTitle">Title</label>
                                        <input type="text" onChange={() => {this.onTextInputChange()}} class="form-control" id="noteTitle" placeholder="Enter Title"></input>                                                                                                            
                                    </div>
                                </div>
                                <br></br>
                                <div className="row">
                                    <div className="col-sm-10">
                                        <TextEditor 
                                            editorState={this.state.editorState} 
                                            textChangeHandlerFunction={this.onTextAreaChange}
                                            wrapperClassName=""
                                            editorClassName=""
                                            placeholder="Note Content"
                                        />                                         
                                    </div>
                                </div>

                            </div>                        
                            <div class="modal-footer">                            
                                <button type="button" id="noteCreationCloseModal" class="btn btn-secondary close-term-request-modal-btn mr-auto" data-dismiss="modal" onClick={this.closeModal}>Close</button>                            
                                <button type="button" class="btn btn-primary submit-term-request-modal-btn" onClick={this.submitNote}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
                }
            </span>
        ];
    }

}

export default NoteCreation;