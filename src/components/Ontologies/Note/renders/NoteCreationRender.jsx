import { useEffect } from "react";
import DropDown from "../../../common/DropDown/DropDown";
import TextEditor from "../../../common/TextEditor/TextEditor";
import JumpTo from "../../../common/JumpTo/JumpTo";
import * as constantsVars from '../Constants';
import TermLib from "../../../../Libs/TermLib";



export const NoteCreationRender = (props) => { 
    
    useEffect(() => {
        if(props.parentOntology && props.mode !== "newNote"){
            document.getElementById("publish_note_to_parent_checkbox").checked = true;
        }
    }, []);

   
    return(
        <>            
            {props.mode === "newNote" && 
                <div className="row float-right">
                    <div className="col-sm-12">
                        <button type="button" 
                            class="btn btn-secondary" 
                            data-toggle="modal" 
                            data-target={"#edit-note-modal" + props.targetNoteId} 
                            data-backdrop="static"
                            data-keyboard="false"                                    
                            >
                            Add Note
                        </button>
                    </div>
                </div>    
            }        
                        
            <div class="modal" id={"edit-note-modal" + props.targetNoteId} key={"edit-note-modal" + props.targetNoteId}>
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">                    
                        <div class="modal-header">
                            <h4 class="modal-title">{"Add a Note"}</h4>
                            <button onClick={() => {props.closeModal()}} type="button" class="close close-mark-btn" data-dismiss="modal">&times;</button>
                        </div>
                        <br></br>                                                
                        <div class="modal-body"> 
                            <div className="row">
                                <div className="col-sm-8">
                                    {props.isGeneric && 
                                        <DropDown 
                                            options={constantsVars.COMPONENT_TYPES_FOR_DROPDOWN}
                                            dropDownId="note-artifact-types"
                                            dropDownTitle="Target Artifact"
                                            dropDownValue={props.targetArtifact}
                                            dropDownChangeHandler={props.changeArtifactType}
                                        /> 
                                    }
                                </div>
                            </div>
                            <br></br>
                            <div className="row">
                                <div className="col-sm-8">
                                    <DropDown 
                                        options={constantsVars.VISIBILITY_FOR_DROPDOWN}
                                        dropDownId="note_visibility_dropdown"
                                        dropDownTitle="Visibility"
                                        dropDownValue={props.visibility}
                                        dropDownChangeHandler={props.changeVisibility}
                                    />  
                                </div>
                            </div>
                            <br></br>
                            <div className="row">
                                <div className="col-sm-8">
                                    {parseInt(props.targetArtifact) === constantsVars.ONTOLOGY_COMPONENT_ID &&
                                        <p>About: <b>{props.ontologyId}</b></p>
                                    }
                                    {parseInt(props.targetArtifact) !== constantsVars.ONTOLOGY_COMPONENT_ID &&
                                        <div>
                                            <label className="required_input" for="noteIri">About</label>                                            
                                            <JumpTo
                                                targetType={props.componentIdentity}
                                                ontologyId={props.ontologyId}
                                                isSkos={false} 
                                                label={false}
                                                handleJumtoSelection={props.handleJumtoSelection}
                                                obsoletes={false}
                                                initialInput={props.selectedTerm['label']}                                                                               
                                            />
                                            <br></br>
                                        </div>
                                    } 
                                </div>
                            </div>  
                            <br></br>
                            {parseInt(props.targetArtifact) !== constantsVars.ONTOLOGY_COMPONENT_ID && props.parentOntology &&
                                <>
                                <div className="row">
                                    <div className="col-sm-10">
                                        <div class="form-group form-check">
                                                <input 
                                                    type="checkbox" 
                                                    class="form-check-input" 
                                                    id="publish_note_to_parent_checkbox" 
                                                    onChange={props.handlePublishToParentCheckbox}                                         
                                                />
                                            <label class="form-check-label" for="publish_note_to_parent_checkbox">
                                                {"Publish this note also for  "} 
                                                {TermLib.createTermUrlWithOntologyPrefix({
                                                    ontology_name:props.parentOntology,
                                                    termIri: props.selectedTerm['iri'],
                                                    termLabel: props.selectedTerm['label'],
                                                    type: props.componentIdentity
                                                })}
                                                {"  (parent ontology)"}
                                            </label>
                                        </div>
                                    </div>
                                </div>  
                                <br></br>
                                </>
                            }
                            <div className="row">                                
                                <div className="col-sm-10">                                                              
                                    <label className="required_input" for={"noteTitle" + props.targetNoteId}>Title</label>
                                    <input 
                                        type="text" 
                                        value={props.noteTitle} 
                                        onChange={() => {props.onTextInputChange()}}                                                 
                                        class="form-control" 
                                        id={"noteTitle" + props.targetNoteId}
                                        placeholder="Enter Title">
                                    </input>                                                                                                            
                                </div>
                            </div>
                            <br></br>
                            <div className="row">
                                <div className="col-sm-10">
                                    <TextEditor 
                                        editorState={props.editorState} 
                                        textChangeHandlerFunction={props.onTextAreaChange}
                                        wrapperClassName=""
                                        editorClassName=""
                                        placeholder="Note Content"
                                        textSizeOptions={['Normal', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code']}
                                    />                                         
                                </div>
                            </div>
                        </div>                        
                        <div class="modal-footer">                                
                            <button type="button" class="btn btn-secondary submit-term-request-modal-btn" onClick={props.submit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>                
        </>
    );

}