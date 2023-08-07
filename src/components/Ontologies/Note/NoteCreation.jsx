import React from "react";
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw } from 'draft-js';
import draftToMarkdown from 'draftjs-to-markdown';
import {getAutoCompleteResult} from "../../../api/fetchData";
import Autosuggest from 'react-autosuggest';



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
           noteSubmited: false,
           submitSeccuess: false,
           autoCompleteSuggestionsList: [],
           enteredTermInAutoComplete: ""
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
    }


    onTextAreaChange = (newEditorState) => {
        this.setState({ editorState: newEditorState });
    };


    createGenericIssueFields(){
        return [
            <Editor
                editorState={this.state.editorState}
                onEditorStateChange={this.onTextAreaChange}
                toolbar={{
                    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link'],
                    inline: {
                    options: ['bold', 'italic', 'underline', 'strikethrough'],
                    },
                    blockType: {
                    inDropdown: true,
                    options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
                    },
                    list: {
                    inDropdown: true,
                    options: ['unordered', 'ordered'],
                    },
                }}
            />
        ];
    }



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


    closeModal(){        
        this.setState({
            editorState:  null,
            targetArtifact: ONTOLOGY_COMPONENT_ID,            
        });
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteIri').value = '';
    }


    submitNote(){
        let noteTitle = document.getElementById('noteTitle').value;
        let noteIri = document.getElementById('noteIri').value;
        let noteContent = this.state.editorState.getCurrentContent();        
        noteContent = draftToMarkdown(convertToRaw(noteContent));
        let data = new FormData();
        data.append("title", noteTitle);
        data.append("targetIri", noteIri);
        data.append("content", noteContent);
        data.append("ontologyId", this.props.ontologyId);
        data.append("userName", this.state.username);
        data.append("component", COMPONENT_VALUES[this.state.targetArtifact]);
        fetch(process.env.REACT_APP_TEST_BACKEND_URL + '/createNote', {method: 'POST', body: data})
            .then((response) => response.json())
            .then((data) => {
                if(data['result']){
                    this.setState({
                        submitSeccuess: true,
                        noteSubmited: true
                    });
                    this.getNotesForOntology();
                }
                else{
                    this.setState({
                        submitSeccuess: false,
                        noteSubmited: true
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    submitSeccuess: false,
                    noteSubmited: true
                });
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
        this.setState({
            autoCompleteSuggestionsList: []
        });
    }


    onAutoCompleteTextBoxChange = (event, { newValue }) => {
        this.setState({
          enteredTermInAutoComplete: newValue
        });
      };


    render(){
        const value = this.state.enteredTermInAutoComplete
        const inputProps = {
            placeholder: 'Type your target term',
            value,
            onChange: this.onAutoCompleteTextBoxChange
        };


        return [
            <span>
            <button type="button" 
                class="btn btn-primary" 
                data-toggle="modal" 
                data-target="#add-note-modal" 
                data-backdrop="static"
                data-keyboard="false"                
                >
                +Add New Note
            </button>
            
            <div class="modal" id="add-note-modal">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">                    
                        <div class="modal-header">
                            <h4 class="modal-title">{"Add a New Note For " + this.props.targetArtifactLabel}</h4>
                            <button type="button" class="close close-mark-btn" data-dismiss="modal">&times;</button>
                        </div>
                        <br></br>                                                
                        <div class="modal-body">                                    
                            <div className="row">
                                <div className="col-sm-8">
                                    {this.props.targetArtifactType === "ontology" && this.createTypeDropDown()}
                                    {this.createVisibilityDropDown()}
                                    {parseInt(this.state.targetArtifact) === ONTOLOGY_COMPONENT_ID &&
                                        <p>About: <strong>{this.props.targetArtifactLabel}</strong></p>
                                    }
                                    {parseInt(this.state.targetArtifact) !== ONTOLOGY_COMPONENT_ID &&
                                        <div>
                                            <label className="required_input" for="noteIri">About</label>
                                            {/* <input type="text" class="form-control" id="noteIri" placeholder="Enter iri"></input> */}
                                            <Autosuggest
                                                suggestions={this.state.autoCompleteSuggestionsList}
                                                onSuggestionsFetchRequested={this.onAutoCompleteChange}
                                                onSuggestionsClearRequested={this.clearAutoComplete}
                                                getSuggestionValue={getAutoCompleteValue}
                                                renderSuggestion={rendetAutoCompleteItem}
                                                inputProps={inputProps}
                                            />
                                            <br></br>
                                        </div>
                                    }
                                    <label className="required_input" for="noteTitle">Title</label>
                                    <input type="text" class="form-control" id="noteTitle" placeholder="Enter Title"></input>                                                                                                            
                                </div>
                            </div>
                            <br></br>
                            <div className="row">
                                <div className="col-sm-10">
                                    {this.createGenericIssueFields()}    
                                </div>
                            </div>

                        </div>                        
                        <div class="modal-footer">                            
                            <button type="button" class="btn btn-secondary close-term-request-modal-btn mr-auto" data-dismiss="modal" onClick={this.closeModal}>Close</button>                            
                            <button type="button" class="btn btn-primary submit-term-request-modal-btn" data-dismiss="modal" onClick={this.submitNote}>Submit</button>                            
                        </div>
                    </div>
                </div>
            </div>
            </span>
        ];
    }

}

export default NoteCreation;