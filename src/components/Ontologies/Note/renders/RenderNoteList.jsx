import {useEffect, useState} from "react";
import DropDown from "../../../common/DropDown/DropDown";
import Pagination from "../../../common/Pagination/Pagination";
import NoteDetail from "../NoteDetail";
import NoteCreation from "../NoteCreation";
import { Link } from 'react-router-dom';
import AlertBox from "../../../common/Alerts/Alerts";
import NoteCard from "../Cards";


const ALL_TYPE = 0
const ONTOLOGY_TYPE = 1
const CLASS_TYPE = 2
const PROPERTY_TYPE = 3
const INDIVIDUAL_TYPE = 4
const COMPONENT_TYPES_FOR_DROPDOWN = [
    {label: "All", value:ALL_TYPE},
    {label: "Ontology", value:ONTOLOGY_TYPE},
    {label: "Class", value:CLASS_TYPE},
    {label: "Property", value:PROPERTY_TYPE},
    {label: "Individual", value:INDIVIDUAL_TYPE}
];




export const RenderNoteList = (props) => {

    const [renderContent, setRenderContent] = useState("");


    function createNotesList(){
        let notes = props.notesList;
        let noteExist = true;
        let result = [];
        for(let note of notes){            
            result.push(<NoteCard note={note}  noteSelectionHandler={props.noteSelectHandler} />);
        }

        if(result.length === 0){
            noteExist = false
            result = [
                <span>
                    <br></br>
                    <AlertBox 
                        type="info"
                        alertColumnClass="col-sm-12"
                        message="This Ontology does not have any note yet."
                    />    
                </span>                            
            ];
        }

        setRenderContent(result);
        props.setNoteExistState(noteExist);        
    }



    useEffect(() => {
        createNotesList();
    }, [props.notesList]);



    return(
        <div className="tree-view-container list-container">                
                {props.noteSubmited && props.noteSubmitSeccuess &&
                    <AlertBox
                        type="success" 
                        message="Your Note is submitted successfully! "
                        alertColumnClass="col-sm-12"
                    />                    
                }
                {props.noteSubmited && !props.noteSubmitSeccuess &&
                    <AlertBox
                        type="danger"
                        message="Something went wrong. Please try again!"
                        alertColumnClass="col-sm-12"
                    />                   
                }                
                {!props.noteDetailPage && !props.componentIsLoading &&
                    <div className="row">                    
                        <div className="col-sm-12">
                            <div className="row">
                                <div className="col-sm-6">
                                    {typeof(props.targetArtifactType) === 'undefined' && 
                                        <DropDown 
                                            options={COMPONENT_TYPES_FOR_DROPDOWN}
                                            dropDownId="note-artifact-types-in-list"
                                            dropDownTitle="Type"
                                            dropDownValue={props.selectedArtifactType}
                                            dropDownChangeHandler={props.artifactDropDownHandler}
                                        /> 
                                    }
                                </div>
                                <div className="col-sm-4">
                                    {props.noteExist &&  
                                        <Pagination 
                                            clickHandler={props.handlePagination} 
                                            count={props.noteTotalPageCount}
                                            initialPageNumber={props.noteListPage}
                                        />
                                    }
                                </div>
                                <div className="col-sm-2">
                                    <NoteCreation 
                                        targetArtifactLabel={props.targetArtifactLabel}  
                                        targetArtifactType={props.targetArtifactType}
                                        targetArtifactIri={props.targetArtifactIri}
                                        ontologyId={props.ontologyId}                                
                                        noteListSubmitStatusHandler={props.setNoteCreationResultStatus}
                                        isGeneric={props.isGeneric}                                
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    {renderContent}
                                </div>
                            </div>                            
                        </div>                                          
                    </div>
                }
                {!props.noteDetailPage && props.componentIsLoading && 
                    <div className="is-loading-term-list isLoading"></div>
                }
                {props.noteDetailPage &&
                    <span>
                        <div className="row">
                            <div className="col-sm-12">
                                <Link 
                                    to={generateBackButton()} 
                                    onClick={props.backToListHandler} 
                                    className="btn btn-secondary">
                                    Back to Note List
                                </Link>
                            </div>
                        </div>
                        <br></br>
                        <NoteDetail noteId={props.selectedNoteId} />
                    </span>                    
                }                
            </div>
    );

}


function generateBackButton(){
    const searchParams = new URLSearchParams(window.location.search);        
    searchParams.delete('noteId');
    searchParams.delete('comment');  
    return window.location.pathname + "?" +  searchParams.toString();
}