import DropDown from "../../../common/DropDown/DropDown";
import Autosuggest from 'react-autosuggest';
import TextEditor from "../../../common/TextEditor/TextEditor";
import * as constantsVars from '../Constants';



export const NoteCreationRender = (props) => {

    const value = props.enteredTermInAutoComplete
    const inputPropsAutoSuggest = {
        placeholder: 'Type your target term',
        value,
        onChange: props.onAutoCompleteTextBoxChange
    };

    return(
        <span>            
            <div className="row float-right">
                <div className="col-sm-12">
                    <button type="button" 
                        class="btn btn-secondary" 
                        data-toggle="modal" 
                        data-target="#add-note-modal" 
                        data-backdrop="static"
                        data-keyboard="false" 
                        onClick={() => {props.openModal()}}           
                        >
                        Add Note
                    </button>
                </div>
            </div>            
            
            {props.modalIsOpen && 
                <div class="modal" id="add-note-modal">
                    <div class="modal-dialog modal-xl">
                        <div class="modal-content">                    
                            <div class="modal-header">
                                <h4 class="modal-title">{"Add a Note"}</h4>
                                <button onClick={props.closeModal} type="button" class="close close-mark-btn" data-dismiss="modal">&times;</button>
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
                                        <DropDown 
                                            options={constantsVars.VISIBILITY_FOR_DROPDOWN}
                                            dropDownId="note_visibility_dropdown"
                                            dropDownTitle="Visibility"
                                            dropDownValue={props.visibility}
                                            dropDownChangeHandler={props.changeVisibility}
                                        /> 
                                        {props.isGeneric && parseInt(props.targetArtifact) === constantsVars.ONTOLOGY_COMPONENT_ID &&
                                            <p>About: <b>{props.ontologyId}</b></p>
                                        }
                                        {props.isGeneric && parseInt(props.targetArtifact) !== constantsVars.ONTOLOGY_COMPONENT_ID &&
                                            <div>
                                                <label className="required_input" for="noteIri">About</label>                                            
                                                <Autosuggest
                                                    suggestions={props.autoCompleteSuggestionsList}
                                                    onSuggestionsFetchRequested={props.onAutoCompleteChange}
                                                    onSuggestionsClearRequested={props.clearAutoComplete}
                                                    getSuggestionValue={constantsVars.getAutoCompleteValue}
                                                    renderSuggestion={constantsVars.rendetAutoCompleteItem}
                                                    onSuggestionSelected={props.onAutoCompleteSelecteion}
                                                    inputProps={inputPropsAutoSuggest}
                                                />
                                                <br></br>
                                            </div>
                                        }
                                        {!props.isGeneric && 
                                            <p>About: <b>{props.targetArtifactLabel}</b></p>
                                        }
                                        <label className="required_input" for="noteTitle">Title</label>
                                        <input type="text" value={props.noteTitle} onChange={() => {props.onTextInputChange()}} class="form-control" id="noteTitle" placeholder="Enter Title"></input>                                                                                                            
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
                }
            </span>
    );

}