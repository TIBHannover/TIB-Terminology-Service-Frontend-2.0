import React from "react";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import { stateFromMarkdown } from 'draft-js-import-markdown';
import draftToMarkdown from 'draftjs-to-markdown';



const ONTOLOGY_COMPONENT_ID = 1;
const CLASS_COMPONENT_ID = 2;
const PROPERTY_COMPONENT_ID = 3;
const INDIVIDUAL_COMPONENT_ID = 4;


class OntologyNotes extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
           notesList: [],
           editorState:  null,
        });

        this.getNotesForOntology = this.getNotesForOntology.bind(this);
        this.createNotesList = this.createNotesList.bind(this);
        this.changeArtifactType = this.changeArtifactType.bind(this);
        this.createComponentDropDown = this.createComponentDropDown.bind(this);
        this.onTextAreaChange = this.onTextAreaChange.bind(this);
    }


    getNotesForOntology(){
        let ontologyId = this.props.ontology;
        let url = process.env.REACT_APP_TEST_BACKEND_URL + '/getNotes/' + ontologyId;
        fetch(url).then((resp) => resp.json())
        .then((data) => {        
            this.setState({
                notesList: data['result'],
                targetArtifact: ONTOLOGY_COMPONENT_ID
            });
        });
    }


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

    onTextAreaChange = (newEditorState) => {
        this.setState({ editorState: newEditorState });
      };


    createNotesList(){
        let notes = this.state.notesList;
        let result = [];
        for(let note of notes){            
            result.push(
                <div className="row">
                    <div className="col-sm-12 note-list-card">
                        <a href='#' className="note-list-title">{note['title']}</a>                        
                        <br/>
                        <small>
                            <ul className="">
                                <li>type: {note['component']}</li>
                                <li>iri: {note['target_iri']}</li>
                            </ul>                            
                        </small>
                        <div>
                            <small>
                                {" opened on " + note['created_at'] + " by " + note['creator_user']}
                            </small>
                        </div>

                    </div>
                </div>
            );
        }

        if(result.length === 0){
            return [
                <div className="row">
                    <div className="col-sm-12">                                    
                        <div class="alert alert-success">
                            There is no Note for this Ontology.
                        </div>                                        
                    </div>
                </div>
            ];
        }

        return result;

    }

    changeArtifactType(e){                   
        this.setState({
            targetArtifact: e.target.value
        });
    }

    createComponentDropDown(){
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


    createAddNoteModal(){
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
                            <h4 class="modal-title">Add a New Note For this Ontology</h4>
                            <button type="button" class="close close-mark-btn" data-dismiss="modal">&times;</button>
                        </div>
                        <br></br>                                                
                        <div class="modal-body">                                    
                            <div className="row">
                                <div className="col-sm-8">
                                    {this.createComponentDropDown()}
                                    <label className="required_input" for="noteTitle">Title</label>
                                    <input type="text" class="form-control" id="noteTitle" placeholder="Enter Title"></input>
                                    <br></br>
                                    <label className="required_input" for="noteIri">Target Iri</label>
                                    <input type="text" class="form-control" id="noteIri" placeholder="Enter iri"></input>
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
                            <button type="button" class="btn btn-primary submit-term-request-modal-btn" onClick={this.submitIssueRequest}>Submit</button>                            
                        </div>
                    </div>
                </div>
            </div>
            </span>
        ];
    }



    componentDidMount(){
        this.getNotesForOntology();
    }



    render(){
        return (
            <div className="tree-view-container notes-container">
                <div className="row">
                    <div className="col-sm-8">
                        {this.createNotesList()}
                    </div>
                    <div className="col-sm-4">
                        {this.createAddNoteModal()}
                    </div>
                </div>
            </div>
        );
    }

}

export default OntologyNotes;