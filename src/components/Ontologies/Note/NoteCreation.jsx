import React from "react";
import {getAutoCompleteResult} from "../../../api/fetchData";
import Autosuggest from 'react-autosuggest';
import AuthTool from "../../User/Login/authTools";
import TextEditor, {getTextEditorContent} from "../../common/TextEditor/TextEditor";
import DropDown from "../../common/DropDown/DropDown";
import * as constantsVars from './Constants';
import { submitNote } from "../../../api/tsMicroBackendCalls";




class NoteCreation extends React.Component{
    constructor(props){
        super(props);
        this.state = ({           
           targetArtifact: constantsVars.ONTOLOGY_COMPONENT_ID,
           visibility: constantsVars.VISIBILITY_ONLY_ME,
           editorState:  null,           
           autoCompleteSuggestionsList: [],
           enteredTermInAutoComplete: "",
           selectedTermFromAutoComplete: {"iri": null, "label": null},
           modalIsOpen: false
        });
        
        this.changeArtifactType = this.changeArtifactType.bind(this);
        this.onTextAreaChange = this.onTextAreaChange.bind(this);
        this.submit = this.submit.bind(this);
        this.closeModal = this.closeModal.bind(this);
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
            targetArtifact: constantsVars.ONTOLOGY_COMPONENT_ID,
            autoCompleteSuggestionsList: [],
            enteredTermInAutoComplete: "",
            selectedTermFromAutoComplete: {"iri": null, "label": null},
            modalIsOpen: false     
        });            
    }


   

    submit(){
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
            noteContent = getTextEditorContent(this.state.editorState);
        }

        if(!noteTitle || noteTitle === ""){
            document.getElementById('noteTitle').style.borderColor = 'red';
            formIsValid = false;
        }
        
        if(!noteContent || noteContent.trim() === ""){
            document.getElementsByClassName('rdw-editor-main')[0].style.border = '1px solid red';
            formIsValid = false;
        }

        if(parseInt(targetArtifactId) !== constantsVars.ONTOLOGY_COMPONENT_ID && !selectedTargetTermIri){
            document.getElementsByClassName('react-autosuggest__input')[0].style.border = '1px solid red';
            formIsValid = false;
        }
        
        if(!formIsValid){
            return;
        }

        if(parseInt(targetArtifactId) === constantsVars.ONTOLOGY_COMPONENT_ID){
            selectedTargetTermIri = this.props.ontologyId;
        }

        
        let targetArtifactType = constantsVars.NOTE_COMPONENT_VALUES[targetArtifactId];
        
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
        data.append("visibility",  constantsVars.VISIBILITY_VALUES[this.state.visibility]);
        submitNote(data).then((newNoteId) => {
            this.props.noteListSubmitStatusHandler(newNoteId);
            this.closeModal();
        });
    }


    async onAutoCompleteChange({value}){   
        let enteredTerm = value;                  
        let type = constantsVars.NOTE_COMPONENT_VALUES[this.state.targetArtifact];        
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
        if(process.env.REACT_APP_NOTE_FEATURE !== "true"){            
            return null;
        }
        if(!localStorage.getItem('isLoginInTs') || localStorage.getItem('isLoginInTs') !== "true"){
            return "";
        }
        const value = this.state.enteredTermInAutoComplete
        const inputPropsAutoSuggest = {
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
                                        {this.props.isGeneric && 
                                            <DropDown 
                                                options={constantsVars.COMPONENT_TYPES_FOR_DROPDOWN}
                                                dropDownId="note-artifact-types"
                                                dropDownTitle="Target Artifact"
                                                dropDownValue={this.state.targetArtifact}
                                                dropDownChangeHandler={this.changeArtifactType}
                                            /> 
                                        }
                                        <DropDown 
                                            options={constantsVars.VISIBILITY_FOR_DROPDOWN}
                                            dropDownId="note_visibility_dropdown"
                                            dropDownTitle="Visibility"
                                            dropDownValue={this.state.visibility}
                                            dropDownChangeHandler={this.changeVisibility}
                                        /> 
                                        {this.props.isGeneric && parseInt(this.state.targetArtifact) === constantsVars.ONTOLOGY_COMPONENT_ID &&
                                            <p>About: <b>{this.props.ontologyId}</b></p>
                                        }
                                        {this.props.isGeneric && parseInt(this.state.targetArtifact) !== constantsVars.ONTOLOGY_COMPONENT_ID &&
                                            <div>
                                                <label className="required_input" for="noteIri">About</label>                                            
                                                <Autosuggest
                                                    suggestions={this.state.autoCompleteSuggestionsList}
                                                    onSuggestionsFetchRequested={this.onAutoCompleteChange}
                                                    onSuggestionsClearRequested={this.clearAutoComplete}
                                                    getSuggestionValue={constantsVars.getAutoCompleteValue}
                                                    renderSuggestion={constantsVars.rendetAutoCompleteItem}
                                                    onSuggestionSelected={this.onAutoCompleteSelecteion}
                                                    inputProps={inputPropsAutoSuggest}
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
                                <button type="button" class="btn btn-primary submit-term-request-modal-btn" onClick={this.submit}>Submit</button>
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