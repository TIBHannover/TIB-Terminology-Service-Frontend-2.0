import React from "react";
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import NoteCreation from "./NoteCreation";
import AuthTool from "../../User/Login/authTools";
import Pagination from "../../common/Pagination/Pagination";
import NoteDetail from "./NoteDetail";
import queryString from 'query-string'; 


const ALL_TYPE = 0
const ONTOLOGY_TYPE = 1
const CLASS_TYPE = 2
const PROPERTY_TYPE = 3
const INDIVIDUAL_TYPE = 4
const TYPES_VALUES = ['all', 'ontology', 'class', 'property', 'individual']

const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_SIZE = 10



class NoteList extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
           notesList: [],           
           listRenderContent: '',           
           noteDetailPage: false,
           noteSubmited: false,
           noteSubmitSeccuess: false,
           noteListPage: DEFAULT_PAGE_NUMBER,
           notePageSize: DEFAULT_PAGE_SIZE,
           noteTotalPageCount: 0,
           selectedNoteId: -1,
           componentIsLoading: true,
           noteExist: true,
           targetArtifactIri: null,
           selectedArtifactType: ALL_TYPE
        });

        this.setComponentData = this.setComponentData.bind(this);
        this.createNotesList = this.createNotesList.bind(this);        
        this.selectNote = this.selectNote.bind(this);
        this.backToListClick = this.backToListClick.bind(this);      
        this.setNoteCreationResultStatus = this.setNoteCreationResultStatus.bind(this); 
        this.handlePagination = this.handlePagination.bind(this); 
        this.loadNoteList = this.loadNoteList.bind(this);
        this.changeArtifactTypeFilter = this.changeArtifactTypeFilter.bind(this);
        this.createArtifactTypeFilter = this.createArtifactTypeFilter.bind(this);
    }


    setComponentData(){
        let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);     
        let inputNoteIdFromUrl = targetQueryParams.noteId;
        let inputNoteId = !inputNoteIdFromUrl ? -1 : parseInt(inputNoteIdFromUrl);        

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
        if(parseInt(this.state.selectedArtifactType) !== ALL_TYPE){
            url += ('&artifact_type=' + TYPES_VALUES[this.state.selectedArtifactType])
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
                                {" opened on " + note['created_at'] + " by " + AuthTool.getUserName(note['created_by'])}
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


    createArtifactTypeFilter(){
        return [            
            <div class="form-group">
                <label for="artifact-types" className='col-form-label'>Type</label>
                <select className='site-dropdown-menu list-result-per-page-dropdown-menu' id="artifact-types" value={this.state.selectedArtifactType} onChange={this.changeArtifactTypeFilter}>
                    <option value={ALL_TYPE} key={ALL_TYPE}>All</option>
                    <option value={ONTOLOGY_TYPE} key={ONTOLOGY_TYPE}>Ontology</option>
                    <option value={CLASS_TYPE} key={CLASS_TYPE}>Class</option>
                    <option value={PROPERTY_TYPE} key={PROPERTY_TYPE}>Property</option>
                    <option value={INDIVIDUAL_TYPE} key={INDIVIDUAL_TYPE}>Individual</option>
                </select>  
            </div>            
        ];
    }


    changeArtifactTypeFilter(e){                   
        this.setState({
            selectedArtifactType: e.target.value,
            noteListPage: DEFAULT_PAGE_NUMBER,
            notePageSize: DEFAULT_PAGE_SIZE,
            noteSubmited: false           
        }, () =>{
            this.setComponentData();
        });
    }


    handlePagination (value) {
        this.setState({
          noteListPage: value,          
          tableBodyContent: ""    
        }, ()=> {
            this.setComponentData();
        });
    }



    selectNote(e){
        let noteId = e.target.attributes.value.nodeValue;       
        this.setState({            
            noteDetailPage: true,
            selectedNoteId: noteId,
            noteSubmited: false
        });
    }



    backToListClick(){
        this.setState({
            selectedNoteId: -1,
            noteDetailPage: false
        });
    }


    generateBackButton(){
        const searchParams = new URLSearchParams(window.location.search);
        let locationObject = window.location;
        searchParams.delete('noteId'); 
        return locationObject.pathname + "?" +  searchParams.toString();
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
                        <div className="col-sm-10">
                            <div className="row">
                                <div className="col-sm-6">
                                    {typeof(this.props.targetArtifactType) === 'undefined' && this.createArtifactTypeFilter()}
                                </div>
                                <div className="col-sm-6">
                                    {this.state.noteExist &&  
                                        <Pagination 
                                            clickHandler={this.handlePagination} 
                                            count={this.state.noteTotalPageCount}
                                            initialPageNumber={this.state.noteListPage}
                                        />
                                    }
                                </div>                                
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    {this.state.listRenderContent}
                                </div>
                            </div>                            
                        </div>
                        <div className="col-sm-2">
                            <NoteCreation 
                                targetArtifactLabel={this.props.targetArtifactLabel}  
                                targetArtifactType={this.props.targetArtifactType}
                                targetArtifactIri={this.props.targetArtifactIri}
                                ontologyId={this.props.ontology.ontologyId}                                
                                noteListSubmitStatusHandler={this.setNoteCreationResultStatus}
                                isGeneric={this.props.isGeneric}
                            />
                        </div>                    
                    </div>
                }
                {this.state.noteDetailPage &&
                    <span>
                        <div className="row">
                            <div className="col-sm-12">
                                <Link 
                                    to={this.generateBackButton()} 
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