import { useEffect, useContext, useState } from "react";
import DropDown from "../../../common/DropDown/DropDown";
import TextEditor from "../../../common/TextEditor/TextEditor";
import JumpTo from "../../../common/JumpTo/JumpTo";
import * as constantsVars from '../Constants';
import TermLib from "../../../../Libs/TermLib";
import { OntologyPageContext } from "../../../../context/OntologyPageContext";
import { NoteContext } from "../../../../context/NoteContext";
import Modal from "react-bootstrap/Modal";
import Login from "../../../User/Login/TS/Login";
import { AppContext } from "../../../../context/AppContext";


export const NoteCreationRender = (props) => {

  const ontologyPageContext = useContext(OntologyPageContext);
  const noteContext = useContext(NoteContext);
  const appContext = useContext(AppContext);

  const [showModal, setShowModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  useEffect(() => {
    if (props.parentOntology && props.mode !== "newNote" && document.getElementById("publish_note_to_parent_checkbox")) {
      document.getElementById("publish_note_to_parent_checkbox").checked = true;
    }
  }, []);


  return (
    <>
      <div className="row">
        <div className={"col-sm-12 " + (props.mode === "newNote" ? "text-end" : "")}>
          <button type="button"
            className={props.mode === "newNote"
              ? "btn btn-secondary stour-onto-note-add-btn"
              : "btn btn-sm borderless-btn note-action-menu-btn"
            }
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              }
              if (appContext.user) {
                setShowModal(true);
              } else {
                setLoginModal(true);
                setTimeout(() => setLoginModal(false), 1000);
              }
            }}
          >
            {props.mode === "newNote" ? "Add Note" : "Edit"}
          </button>
        </div>
      </div>
      <Login isModal={true} showModal={loginModal} withoutButton={true} />
      <Modal show={showModal} fullscreen={true} id={"edit-note-modal" + props.targetNoteId}
        key={"edit-note-modal" + props.targetNoteId}>
        <Modal.Header className="row">
          <div className="col-sm-12">
            <div className="row">
              <div className="col-sm-6">
                <h4>{"Add a Note"}</h4>
              </div>
              <div className="col-sm-6">
                <button onClick={() => {
                  props.closeModal();
                  setShowModal(false);
                }} type="button" className="bg-white float-end">&times;</button>
              </div>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-sm-8">
              {!noteContext.selectedTermInTree &&
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
                <p>About: <b>{ontologyPageContext.ontology.ontologyId}</b></p>
              }
              {parseInt(props.targetArtifact) !== constantsVars.ONTOLOGY_COMPONENT_ID &&
                <div>
                  <JumpTo
                    targetType={props.componentIdentity}
                    label={"About *"}
                    handleJumtoSelection={props.handleJumtoSelection}
                    obsoletes={false}
                    initialInput={noteContext.selectedTermInTree ? noteContext.selectedTermInTree['label'] : props.selectedTerm['label']}
                    id="note_creation_auto_suggest"
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
                  <div className="form-group form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="publish_note_to_parent_checkbox"
                      onChange={props.handlePublishToParentCheckbox}
                    />
                    <label className="form-check-label" htmlFor="publish_note_to_parent_checkbox">
                      {"Publish this note also for  "}
                      {TermLib.createTermUrlWithOntologyPrefix({
                        ontology_name: props.parentOntology,
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
              <label className="required_input" htmlFor={"noteTitle" + props.targetNoteId}>Title</label>
              <input
                type="text"
                value={props.noteTitle}
                onChange={() => {
                  props.onTextInputChange()
                }}
                className="form-control"
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
                textSizeOptions={['Normal', 'Blockquote', 'Code']}
                wrapperId={"noteContent" + props.targetNoteId}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-secondary submit-term-request-modal-btn"
            onClick={() => {
              props.submit();
            }}>Submit
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
  
}