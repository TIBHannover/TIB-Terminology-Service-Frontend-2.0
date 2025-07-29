import {useEffect, useState, useContext} from "react";
import DropDown from "../../../common/DropDown/DropDown";
import Pagination from "../../../common/Pagination/Pagination";
import NoteDetail from "../NoteDetail";
import NoteCreation from "../NoteCreation";
import {Link} from 'react-router-dom';
import AlertBox from "../../../common/Alerts/Alerts";
import NoteCard from "../NoteCard";
import {NoteContext} from "../../../../context/NoteContext";
import NoteUrlFactory from "../../../../UrlFactory/NoteUrlFactory";


const ALL_TYPE = 0
const ONTOLOGY_TYPE = 1
const CLASS_TYPE = 2
const PROPERTY_TYPE = 3
const INDIVIDUAL_TYPE = 4
const COMPONENT_TYPES_FOR_DROPDOWN = [
  {label: "All", value: ALL_TYPE},
  {label: "Ontology", value: ONTOLOGY_TYPE},
  {label: "Class", value: CLASS_TYPE},
  {label: "Property", value: PROPERTY_TYPE},
  {label: "Individual", value: INDIVIDUAL_TYPE}
];


export const NoteListRender = (props) => {
  
  const noteContext = useContext(NoteContext);
  
  const [renderContent, setRenderContent] = useState("");
  
  const noteUrlFactory = new NoteUrlFactory();
  
  
  function createNotesList() {
    let notes = props.notesList;
    let noteExist = true;
    let result = [];
    for (let note of notes) {
      result.push(
        <NoteCard note={note}/>
      );
    }
    
    if (result.length === 0) {
      noteExist = false
      result = [
        <span>
          <br></br>
          <AlertBox
            type="info"
            alertColumnclassName="col-sm-12"
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
  
  
  return (
    <div className="tree-view-container list-container">
      {props.noteSubmited && props.noteSubmitSeccuess &&
        <AlertBox
          type="success"
          message="Your Note is submitted successfully! "
          alertColumnclassName="col-sm-12"
        />
      }
      {props.noteSubmited && !props.noteSubmitSeccuess &&
        <AlertBox
          type="danger"
          message="Something went wrong. Please try again!"
          alertColumnclassName="col-sm-12"
        />
      }
      {!props.noteDetailPage && !props.componentIsLoading &&
        <div className="row pe-3 ps-3">
          <div className="col-sm-12">
            <div className="row">
              <div className="col-sm-3 stour-onto-note-type-filter">
                {typeof (noteContext.selectedTermTypeInTree) === 'undefined' &&
                  <DropDown
                    options={COMPONENT_TYPES_FOR_DROPDOWN}
                    dropDownId="note-artifact-types-in-list"
                    dropDownTitle="Type"
                    dropDownValue={props.selectedArtifactType}
                    dropDownChangeHandler={props.artifactDropDownHandler}
                  />
                }
              </div>
              <div className="col-sm-4 pt-2 stour-onto-note-import-from-parent">
                <div className="form-group form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="note_list_sho_imported_notes_checkbox"
                    checked={props.onlyOntologyOriginalNotes}
                    onChange={props.handleOntologyOriginalNotesCheckbox}
                  />
                  <label className="form-check-label" htmlFor="note_list_sho_imported_notes_checkbox">
                    Without Imported Notes.
                  </label>
                </div>
              </div>
              <div className="col-sm-3">
                {props.noteExist &&
                  <Pagination
                    clickHandler={props.handlePagination}
                    count={props.noteTotalPageCount}
                    initialPageNumber={props.noteListPage}
                  />
                }
              </div>
              <div className="col-sm-2">
                <NoteCreation key={"note-creation-btn"}/>
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
                to={noteUrlFactory.getBAckToListLink()}
                onClick={props.backToListHandler}
                className="btn btn-secondary">
                Back to Note List
              </Link>
            </div>
          </div>
          <br></br>
          <NoteDetail/>
        </span>
      }
    </div>
  );
  
}
