import React from "react";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import ReactMarkdown from 'react-markdown'
import draftToMarkdown from 'draftjs-to-markdown';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';




const ONTOLOGY_COMPONENT_ID = 1;
const CLASS_COMPONENT_ID = 2;
const PROPERTY_COMPONENT_ID = 3;
const INDIVIDUAL_COMPONENT_ID = 4;
const COMPONENT_VALUES = ['', 'ontology', 'class', 'property', 'individual']


class NodeNotes extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
           notesList: [],
           targetArtifact: ONTOLOGY_COMPONENT_ID,
           editorState:  null,
           username: "TS User",
           noteSubmited: false,
           submitSeccuess: false,
           listRenderContent: '',
           selectedNote: null,
           noteDetailPage: false
        });

        this.getNotesForOntology = this.getNotesForOntology.bind(this);
        this.createNotesList = this.createNotesList.bind(this);
        this.changeArtifactType = this.changeArtifactType.bind(this);
        this.createComponentDropDown = this.createComponentDropDown.bind(this);
        this.onTextAreaChange = this.onTextAreaChange.bind(this);
        this.submitNote = this.submitNote.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.createNoteDetailPage = this.createNoteDetailPage.bind(this);
        this.selectNote = this.selectNote.bind(this);
        this.backToListClick = this.backToListClick.bind(this);
    }


    getNotesForOntology(inputNoteId=null){
        let ontologyId = this.props.ontology;
        let url = process.env.REACT_APP_TEST_BACKEND_URL + '/getNotes/' + ontologyId;
        fetch(url).then((resp) => resp.json())
        .then((data) => {
            let selectedNote = null;
            let allNotes = data['result'];
            let showNoteDetail = false;
            for(let note of allNotes){            
                if (note['id'] === parseInt(inputNoteId)){
                    selectedNote = note; 
                    showNoteDetail = true;
                }
            }     
            this.setState({
                notesList: allNotes,
                selectedNote: selectedNote,
                noteDetailPage: showNoteDetail               
            });
        })
        .then(()=>{this.createNotesList()});
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
                        <Link to={'notes/' + note['id']} className="note-list-title" value={note['id']} onClick={this.selectNote}>{note['title']}</Link>                        
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
            result = [
                <div className="row">
                    <div className="col-sm-12">                                    
                        <div class="alert alert-success">
                            There is no Note for this Ontology.
                        </div>                                        
                    </div>
                </div>
            ];
        }

        this.setState({listRenderContent: result});

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


    closeModal(){        
        this.setState({
            editorState:  null,
            targetArtifact: ONTOLOGY_COMPONENT_ID,            
        });
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteIri').value = '';
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
                            <button type="button" class="btn btn-primary submit-term-request-modal-btn" data-dismiss="modal" onClick={this.submitNote}>Submit</button>                            
                        </div>
                    </div>
                </div>
            </div>
            </span>
        ];
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
        data.append("ontologyId", this.props.ontology);
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


    selectNote(e){
        let noteId = e.target.attributes.value.nodeValue;       
        let selctedNote = null;
        let allNotes = this.state.notesList;
        for(let note of allNotes){            
            if (note['id'] === parseInt(noteId)){
                selctedNote = note; 
            }
        }
        this.setState({
            selectedNote: selctedNote,
            noteDetailPage: true
        });
    }



    backToListClick(){
        this.setState({
            selectedNoteId: null,
            noteDetailPage: false
        });
    }


    createNoteDetailPage(){
        return [
            <span>
                <div className="row">
                    <div className="col-sm-12">
                        <Link 
                            to={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + this.props.ontology + '/notes' } 
                            onClick={this.backToListClick} 
                            className="btn btn-primary">
                            Back to Note List
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <br></br>  
                        <h2>{this.state.selectedNote['title']}</h2>                      
                        <small>{" opened on " + this.state.selectedNote['created_at'] + " by " + this.state.selectedNote['creator_user']}</small>
                        <br></br>
                        <br></br>
                        <span>
                            <ReactMarkdown>{this.state.selectedNote['content']}</ReactMarkdown>
                        </span>
                    
                    </div>
                </div>
            </span>           
        ];
    }



    componentDidMount(){        
        let inputNoteId = this.props.targetNoteId;         
        this.getNotesForOntology(inputNoteId);
    }





    render(){
        return (
            <div className="tree-view-container notes-container">
                {!this.state.noteDetailPage && 
                    <div className="row">                    
                        <div className="col-sm-8">
                            {this.state.listRenderContent}
                        </div>
                        <div className="col-sm-4">
                            {this.createAddNoteModal()}
                        </div>                    
                    </div>
                }
                {this.state.noteDetailPage && this.state.selectedNote && this.createNoteDetailPage()}
            </div>
        );
    }

}

export default withRouter(NodeNotes);