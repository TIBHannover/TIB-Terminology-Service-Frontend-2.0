import React from "react";
import {getAutoCompleteResult} from "../../../api/fetchData";
import Autosuggest from 'react-autosuggest';
import AuthTool from "../../User/Login/authTools";
import TextEditor, {getTextEditorContent, createTextEditorStateFromJson}  from "../../common/TextEditor/TextEditor";
import DropDown from "../../common/DropDown/DropDown";
import * as constantsVars from './Constants';
import { submitNote } from "../../../api/tsMicroBackendCalls";




class NoteEdit extends React.Component{
    constructor(props){
        super(props);
        this.state = ({           
           targetArtifact: constantsVars.ONTOLOGY_COMPONENT_ID,
           visibility: constantsVars.VISIBILITY_ONLY_ME,
           editorState:  null,           
           autoCompleteSuggestionsList: [],
           enteredTermInAutoComplete: "",
           selectedTermFromAutoComplete: {"iri": null, "label": null},
           noteEditId: -1,
           noteTitle: "",
           modalIsOpen: false
        });
        
        this.changeArtifactType = this.changeArtifactType.bind(this);        
        this.onTextAreaChange = this.onTextAreaChange.bind(this);
        this.edit = this.edit.bind(this);
        this.closeModal = this.closeModal.bind(this);        
        this.changeVisibility = this.changeVisibility.bind(this);
        this.onAutoCompleteChange = this.onAutoCompleteChange.bind(this);
        this.clearAutoComplete = this.clearAutoComplete.bind(this);
        this.onAutoCompleteTextBoxChange = this.onAutoCompleteTextBoxChange.bind(this);
        this.onAutoCompleteSelecteion = this.onAutoCompleteSelecteion.bind(this);        
        this.onTextInputChange = this.onTextInputChange.bind(this);
        this.setComponentData = this.setComponentData.bind(this);
    }


    setComponentData(){
        let editorState = createTextEditorStateFromJson(this.props.note['content']);    
        this.setState({
            noteEditId: this.props.note['id'],
            targetArtifact: constantsVars.NOTE_COMPONENT_VALUES.indexOf(this.props.note['semantic_component_type']),
            visibility: constantsVars.VISIBILITY_VALUES.indexOf(this.props.note['visibility']),
            editorState: editorState,
            noteTitle: this.props.note['title'],
            enteredTermInAutoComplete: this.props.note['semantic_component_label'],
            selectedTermFromAutoComplete: {"iri":  this.props.note['semantic_component_iri'], "label":  this.props.note['semantic_component_label']}
        });
    }


    onTextInputChange(e){        
        document.getElementById("noteTitle" + this.props.note['id']).style.borderColor = '';
        this.setState({noteTitle: e.target.value})
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
        let searchParams = new URLSearchParams(window.location.search);
        let locationObject = window.location;        
        window.location.replace(locationObject.pathname + "?" +  searchParams.toString());
    }


   

    edit(){
        let formIsValid = true;
        let noteTitle = document.getElementById("noteTitle" + this.props.note['id']).value;
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
            document.getElementById("noteTitle" + this.props.note['id']).style.borderColor = 'red';
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
            selectedTargetTermIri = this.props.note['ontology_id'];
        }

        
        let targetArtifactType = constantsVars.NOTE_COMPONENT_VALUES[targetArtifactId];
        
        if(this.props.targetArtifactType){
            selectedTargetTermIri = this.props.targetArtifactIri;
            targetArtifactType = this.props.targetArtifactType;
        }
        
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});       
        let data = new FormData();
        data.append("noteId", this.props.note['id']);
        data.append("title", noteTitle);
        data.append("semantic_component_iri", selectedTargetTermIri);
        data.append("content", noteContent);
        data.append("ontology_id", this.props.note['ontology_id']);
        data.append("semantic_component_type", targetArtifactType);
        data.append("visibility",  constantsVars.VISIBILITY_VALUES[this.state.visibility]);
        submitNote(data, true).then((updatedNoteId) => {this.closeModal();});
    }



    async onAutoCompleteChange({value}){   
        let enteredTerm = value;                  
        let type = constantsVars.NOTE_COMPONENT_VALUES[this.state.targetArtifact];        
        if(type !== "property" && type !== "individual"){
            type = this.props.isSkos ? "individual" : "class"; 
        }       
        if (enteredTerm.length > 0){
            let autoCompleteResult = await getAutoCompleteResult(enteredTerm, this.props.note['ontology_id'], type);
            this.setState({
                autoCompleteSuggestionsList: autoCompleteResult
            });                        
        }       
    }


    clearAutoComplete(){
        // document.getElementsByClassName('react-autosuggest__input')[0].style.border = '';
        this.setState({
            autoCompleteSuggestionsList: []
        });
    }


    onAutoCompleteTextBoxChange = (event, { newValue }) => {
        // document.getElementsByClassName('react-autosuggest__input')[0].style.border = '';
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



    componentDidMount(){
        if(this.props.note['id']){
            this.setComponentData();
        }        
    }



    componentDidUpdate(){        
        if(this.props.note['id'] && this.props.note['id'] !== this.state.noteEditId){
            this.setComponentData();
        }
    }



    render(){
        if(process.env.REACT_APP_NOTE_FEATURE !== "true"){            
            return null;
        }
        let targetNote = this.props.note;
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
                <div class="modal" id={"edit-note-modal" + targetNote['id']} key={"edit-note-modal" + targetNote['id']}>
                    <div class="modal-dialog modal-xl">
                        <div class="modal-content">                    
                            <div class="modal-header">
                                <h4 class="modal-title">{"Edit This Note"}</h4>
                                <button type="button" class="close close-mark-btn" data-dismiss="modal">&times;</button>
                            </div>
                            <br></br>                                                
                            <div class="modal-body">                                    
                                <div className="row">                                
                                    <div className="col-sm-8">
                                        <DropDown 
                                            options={constantsVars.COMPONENT_TYPES_FOR_DROPDOWN}
                                            dropDownId="note-artifact-types"
                                            dropDownTitle="Target Artifact"
                                            dropDownValue={this.state.targetArtifact}
                                            dropDownChangeHandler={this.changeArtifactType}
                                        />
                                         <DropDown 
                                            options={constantsVars.VISIBILITY_FOR_DROPDOWN}
                                            dropDownId="note_visibility_dropdown"
                                            dropDownTitle="Visibility"
                                            dropDownValue={this.state.visibility}
                                            dropDownChangeHandler={this.changeVisibility}
                                        /> 
                                        {parseInt(this.state.targetArtifact) === constantsVars.ONTOLOGY_COMPONENT_ID &&
                                            <p>About: <b>{this.props.note['ontology_id']}</b></p>
                                        }
                                        {parseInt(this.state.targetArtifact) !== constantsVars.ONTOLOGY_COMPONENT_ID &&
                                            <div>
                                                <label className="required_input">About</label>                                            
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
                                        <label className="required_input" for={"noteTitle" + targetNote['id']}>Title</label>
                                        <input 
                                            type="text"
                                            value={this.state.noteTitle} 
                                            onChange={this.onTextInputChange} 
                                            class="form-control" 
                                            id={"noteTitle" + targetNote['id']}
                                            placeholder="Enter Title">                                            
                                        </input>                                                                                          
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
                                {/* <button type="button" id={"noteCreationCloseModal" + targetNote['id']} class="btn btn-secondary close-term-request-modal-btn mr-auto" data-dismiss="modal" >Close</button> */}
                                <button type="button" class="btn btn-secondary submit-term-request-modal-btn" onClick={this.edit}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>                
            </span>
        ];
    }

}

export default NoteEdit;