import React from "react";
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import NoteCreation from "./NoteCreation";
import AuthTool from "../../User/Login/authTools";
import Pagination from "../../common/Pagination/Pagination";
import NoteDetail from "./NoteDetail";
import queryString from 'query-string'; 




class NoteList extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
           notesList: [],           
           listRenderContent: '',           
           noteDetailPage: false,
           noteSubmited: false,
           noteSubmitSeccuess: false,
           noteListPage: 1,
           notePageSize: 10,
           noteTotalPageCount: 0,
           selectedNoteId: -1,
           componentIsLoading: true,
           noteExist: true,
           targetArtifactIri: null
        });

        this.setComponentData = this.setComponentData.bind(this);
        this.createNotesList = this.createNotesList.bind(this);        
        this.selectNote = this.selectNote.bind(this);
        this.backToListClick = this.backToListClick.bind(this);      
        this.setNoteCreationResultStatus = this.setNoteCreationResultStatus.bind(this); 
        this.handlePagination = this.handlePagination.bind(this); 
        this.loadNoteList = this.loadNoteList.bind(this);
    }


    setComponentData(){
        let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);     
        let inputNoteIdFromUrl = targetQueryParams.noteId;
        let inputNoteId = !inputNoteIdFromUrl ? -1 : parseInt(inputNoteIdFromUrl);
        console.info(inputNoteId)

        if(inputNoteId !== -1 && inputNoteId !== this.state.selectedNoteId){
            this.setState({
                selectedNoteId: inputNoteId,
                noteDetailPage: true
            });            
        }
        else if(this.state.selectedNoteId === -1){
            this.loadNoteList();
        }
        
        return true;
    }


    loadNoteList(){
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});        
        let ontologyId = this.props.ontology.ontologyId;
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/notes_list?ontology=' + ontologyId;
        url += ('&page=' + this.state.noteListPage + '&size=' + this.state.notePageSize)
        if(this.props.targetArtifactIri){
            url += ('&artifact_iri=' + this.props.targetArtifactIri)
        }
                
        fetch(url, {headers:headers}).then((resp) => resp.json())
        .then((data) => {            
            let allNotes = data['_result']['notes'];
            let noteStats = data['_result']['stats'];                                  
            this.setState({
                notesList: allNotes,                
                noteDetailPage: false,                
                noteTotalPageCount: noteStats['totalPageCount'],
                targetArtifactIri: this.props.targetArtifactIri        
            });
        })
        .then(()=>{this.createNotesList()});
    }


 
    createNotesList(){
        let notes = this.state.notesList;
        let noteExist = true;
        let result = [];
        for(let note of notes){
            const searchParams = new URLSearchParams(window.location.search);
            let locationObject = window.location;
            searchParams.set('noteId', note['id']); 
            let noteUrl = locationObject.pathname + "?" +  searchParams.toString();
            result.push(
                <div className="row">
                    <div className="col-sm-12 note-list-card">
                        <Link to={noteUrl} className="note-list-title" value={note['id']} onClick={this.selectNote}>{note['title']}</Link>                        
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
            noteExist = false
            result = [
                <div className="row">
                    <div className="col-sm-12">                                    
                        <div class="alert alert-success">
                            No Note found.
                        </div>                                        
                    </div>
                </div>
            ];
        }

        this.setState({
            listRenderContent: result,
            componentIsLoading: false,
            noteExist: noteExist
        });

    }


    handlePagination (value) {
        this.setState({
          noteListPage: value,          
          tableBodyContent: ""    
        }, ()=> {
            this.setComponentData();
        })
    }



    selectNote(e){
        let noteId = e.target.attributes.value.nodeValue;       
        this.setState({            
            noteDetailPage: true,
            selectedNoteId: noteId
        });
    }



    backToListClick(){
        this.setState({
            selectedNoteId: -1,
            noteDetailPage: false
        });
    }



    setNoteCreationResultStatus(success){
        this.setState({
            noteSubmited: true,
            noteSubmitSeccuess: success
        });
        this.setComponentData();
    }



    componentDidMount(){            
        this.setComponentData();
    }


    componentDidUpdate(){
        let currentTargetArtifactIri = this.state.targetArtifactIri;        
        if(currentTargetArtifactIri !== this.props.targetArtifactIri){
            this.setComponentData();
        }
    }


    
    render(){
        return (
            <div className="tree-view-container notes-container">
                <div className="row">
                    {this.state.noteSubmited && this.state.noteSubmitSeccuess &&
                        <div className="row text-center">
                            <div className="col-sm-8">                                    
                                <div class="alert alert-success">
                                    Your Note is submitted successfully!                           
                                </div>                        
                            </div>
                        </div>
                    }
                    {this.state.noteSubmited && !this.state.noteSubmitSeccuess &&
                        <div className="row text-center">
                            <div className="col-sm-8">
                                <div class="alert alert-danger">
                                    Something went wrong. Please try again!
                                </div>  
                            </div>
                        </div>  
                    }
                </div>
                {!this.state.noteDetailPage && !this.state.componentIsLoading &&
                    <div className="row">                    
                        <div className="col-sm-8">
                            {this.state.noteExist &&  
                                <Pagination 
                                    clickHandler={this.handlePagination} 
                                    count={this.state.noteTotalPageCount}
                                    initialPageNumber={this.state.noteListPage}
                                />
                            }
                            {this.state.listRenderContent}
                        </div>
                        <div className="col-sm-4">
                            <NoteCreation 
                                targetArtifactLabel={this.props.targetArtifactLabel}  
                                targetArtifactType={this.props.targetArtifactType}
                                targetArtifactIri={this.props.targetArtifactIri}
                                ontologyId={this.props.ontology.ontologyId}                                
                                noteListSubmitStatusHandler={this.setNoteCreationResultStatus}
                            />
                        </div>                    
                    </div>
                }
                {this.state.noteDetailPage &&
                    <span>
                        <div className="row">
                            <div className="col-sm-12">
                                <Link 
                                    to={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + this.props.ontology.ontologyId + '/notes' } 
                                    onClick={this.backToListClick} 
                                    className="btn btn-primary">
                                    Back to Note List
                                </Link>
                            </div>
                        </div>
                        <NoteDetail noteId={this.state.selectedNoteId} />
                    </span>                    
                }
            </div>
        );
    }

}

export default withRouter(NoteList);