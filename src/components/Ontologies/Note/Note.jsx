import React from "react";
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import NoteCreation from "./NoteCreation";
import AuthTool from "../../User/Login/authTools";





class OntologyNotes extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
           notesList: [],           
           listRenderContent: '',
           selectedNote: null,
           noteDetailPage: false,
           noteSubmited: false,
           noteSubmitSeccuess: false
        });

        this.getNotesForOntology = this.getNotesForOntology.bind(this);
        this.createNotesList = this.createNotesList.bind(this);                        
        this.createNoteDetailPage = this.createNoteDetailPage.bind(this);
        this.selectNote = this.selectNote.bind(this);
        this.backToListClick = this.backToListClick.bind(this);      
        this.setNoteCreationResultStatus = this.setNoteCreationResultStatus.bind(this);  
    }


    getNotesForOntology(inputNoteId=null){
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});        
        let ontologyId = this.props.ontology.ontologyId;
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/notes_list?ontology=' + ontologyId;
        
        fetch(url, {headers:headers}).then((resp) => resp.json())
        .then((data) => {
            let selectedNote = null;
            let allNotes = data['_result']['notes'];
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
                                <li>type: {note['semantic_component_type']}</li>
                                <li>iri: {note['semantic_component_iri']}</li>
                            </ul>                            
                        </small>
                        <div>
                            <small>
                                {" opened on " + note['created_at'] + " by " + note['created_by']}
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


    setNoteCreationResultStatus(success){
        this.setState({
            noteSubmited: true,
            noteSubmitSeccuess: success
        });
    }



    componentDidMount(){        
        let inputNoteId = this.props.targetNoteId;         
        this.getNotesForOntology(inputNoteId);
    }


    
    render(){
        return (
            <div className="tree-view-container notes-container">
                <div className="row">
                    {this.state.noteSubmited && this.state.noteSubmitSeccuess &&
                        <div className="row text-center">
                            <div className="col-sm-12">                                    
                                <div class="alert alert-success">
                                    Your Note is submitted successfully!                           
                                </div>                        
                            </div>
                        </div>
                    }
                    {this.state.noteSubmited && !this.state.noteSubmitSeccuess &&
                        <div className="row text-center">
                            <div className="col-sm-10">
                                <div class="alert alert-danger">
                                    Something went wrong. Please try again!
                                </div>  
                            </div>
                        </div>  
                    }
                </div>
                {!this.state.noteDetailPage && 
                    <div className="row">                    
                        <div className="col-sm-8">
                            {this.state.listRenderContent}
                        </div>
                        <div className="col-sm-4">
                            <NoteCreation 
                                targetArtifactLabel={this.props.ontology.config.title}  
                                targetArtifactType={"ontology"}
                                ontologyId={this.props.ontology.ontologyId}                                
                                noteListSubmitStatusHandler={this.setNoteCreationResultStatus}
                            />
                        </div>                    
                    </div>
                }
                {this.state.noteDetailPage && this.state.selectedNote && this.createNoteDetailPage()}
            </div>
        );
    }

}

export default withRouter(OntologyNotes);