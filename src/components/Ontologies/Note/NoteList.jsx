import React from "react";
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import NoteCreation from "./NoteCreation";
import AuthTool from "../../User/Login/authTools";
import Pagination from "../../common/Pagination/Pagination";
import NoteDetail from "./NoteDetail";
import queryString from 'query-string'; 
import Toolkit from "../../common/Toolkit";
import {AlertBox} from "../../common/Alerts/Alerts";
import NoteCard from "./Cards";



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
        this.updateURL = this.updateURL.bind(this);
    }


    setComponentData(){
        let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);     
        let inputNoteIdFromUrl = targetQueryParams.noteId;
        let inputNoteId = !inputNoteIdFromUrl ? -1 : parseInt(inputNoteIdFromUrl);        

        if(inputNoteId !== -1 && inputNoteId !== this.state.selectedNoteId){            
            this.setState({
                selectedNoteId: inputNoteId,
                noteDetailPage: true,
                componentIsLoading: false
            });            
        }
        else if(inputNoteId === -1){
            this.loadNoteList();
        }
        
        return true;
    }


    loadNoteList(){
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});        
        let ontologyId = this.props.ontology.ontologyId;
        let currentUrlParams = new URL(window.location).searchParams;                      
        let pageNumber = currentUrlParams.get('page') ? currentUrlParams.get('page') : DEFAULT_PAGE_NUMBER;
        let pageSize = currentUrlParams.get('size') ? currentUrlParams.get('size') : DEFAULT_PAGE_SIZE; 
        let type = currentUrlParams.get('type') ? currentUrlParams.get('type') : TYPES_VALUES[this.state.selectedArtifactType]
        let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/notes_list?ontology=' + ontologyId;
        url += ('&page=' + pageNumber + '&size=' + pageSize)
        if(this.props.targetArtifactIri){
            url += ('&artifact_iri=' + this.props.targetArtifactIri)
        }
        if(type !== TYPES_VALUES[ALL_TYPE]){
            url += ('&artifact_type=' + type);
        }
                
        fetch(url, {headers:headers}).then((resp) => resp.json())
        .then((data) => {            
            let allNotes = data['_result']['notes'];
            let noteStats = data['_result']['stats'];                                  
            this.setState({
                notesList: allNotes,                
                noteDetailPage: false,                
                noteTotalPageCount: noteStats['totalPageCount'],
                targetArtifactIri: this.props.targetArtifactIri,
                noteListPage: parseInt(pageNumber),
                notePageSize: parseInt(pageSize),
                selectedArtifactType: TYPES_VALUES.indexOf(type),
                componentIsLoading: false      
            });
        })
        .then(()=>{this.createNotesList()});
    }



    updateURL(pageNumber, pageSize, type=ALL_TYPE){
        let currentUrlParams = new URLSearchParams();
        currentUrlParams.set('type', TYPES_VALUES[parseInt(type)]);
        currentUrlParams.set('page', pageNumber);
        currentUrlParams.set('size', pageSize);                
        this.props.history.push(window.location.pathname + "?" + currentUrlParams.toString());
        this.setComponentData();
    }


 
    createNotesList(){
        let notes = this.state.notesList;
        let noteExist = true;
        let result = [];
        for(let note of notes){            
            result.push(
                <NoteCard 
                    note={note}
                    noteSelectionHandler={this.selectNote}
                />
            );
        }

        if(result.length === 0){
            noteExist = false
            result = [
                <AlertBox 
                    type="info"
                    message="This Ontology does not have any note yet."
                    alertColumnClass="col-sm-12"
                />                
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
            noteSubmited: false,
            componentIsLoading: true      
        }, () =>{                        
            this.updateURL(this.state.noteListPage, this.state.notePageSize, this.state.selectedArtifactType)
        });
    }


    handlePagination (value) {
        this.setState({
          noteListPage: value,          
          tableBodyContent: "" ,
          componentIsLoading: true   
        }, ()=> {            
            this.updateURL(value, this.state.notePageSize, this.state.selectedArtifactType);
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
            noteDetailPage: false,
            noteSubmited: false,
            componentIsLoading: true
        }, () => {
            this.setComponentData();
        });
    }


    generateBackButton(){
        const searchParams = new URLSearchParams(window.location.search);
        let locationObject = window.location;
        searchParams.delete('noteId'); 
        return locationObject.pathname + "?" +  searchParams.toString();
    }



    setNoteCreationResultStatus(success, newNoteId=-1){        
        if(newNoteId !== -1){            
            let newUrl = Toolkit.setParamInUrl('noteId', newNoteId);
            this.props.history.push(newUrl);
        }
        
        this.setState({
            noteSubmited: true,
            noteSubmitSeccuess: success            
        }, () => {
            this.setComponentData();
        });
        
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
                {this.state.noteSubmited && this.state.noteSubmitSeccuess &&
                    <AlertBox
                        type="success" 
                        message="Your Note is submitted successfully! "
                        alertColumnClass="col-sm-8"
                    />                    
                }
                {this.state.noteSubmited && !this.state.noteSubmitSeccuess &&
                    <AlertBox
                        type="danger"
                        message="Something went wrong. Please try again!"
                        alertColumnClass="col-sm-8"
                    />                   
                }                
                {!this.state.noteDetailPage && !this.state.componentIsLoading &&
                    <div className="row">                    
                        <div className="col-sm-9">
                            <div className="row">
                                <div className="col-sm-6">
                                    {this.state.noteExist && typeof(this.props.targetArtifactType) === 'undefined' && 
                                        this.createArtifactTypeFilter()
                                    }
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
                {!this.state.noteDetailPage && this.state.componentIsLoading && 
                    <div className="is-loading-term-list isLoading"></div>
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
                        <br></br>
                        <NoteDetail noteId={this.state.selectedNoteId} />
                    </span>                    
                }                
            </div>
        );
    }

}

export default withRouter(NoteList);