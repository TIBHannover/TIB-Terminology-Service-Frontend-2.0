import { useState, useContext } from "react";
import AlertBox from "../common/Alerts/Alerts";
import Multiselect from "multiselect-react-dropdown";
import { AppContext } from "../../context/AppContext";
import TermLib from "../../Libs/TermLib";


export const AddToTermsetModalBtn = (props) => {
  const { modalId } = props;
  return (
    <button type="button"
      className={"btn btn-primary btn-sm borderless-btn"}
      data-toggle="modal"
      data-target={"#addToTermsetModal-" + modalId}
      data-backdrop="static"
    >
      {"Add to set"}
    </button>
  );
}


export const AddToTermsetModal = (props) => {
  const { modalId, term } = props;
  const appContext = useContext(AppContext);

  const [submited, setSubmited] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [selectedTermsetIds, setSelectedTermsetIds] = useState([]);
  const [termsets, _] = useState(() => {
    let options = [];
    for (let tset of appContext.userTermsets) {
      options.push({ "text": tset.name, "id": tset.id });
    }
    return options;
  });

  return (
    <div>
      <div className="modal fade" id={"addToTermsetModal-" + modalId} tabIndex={-1} role="dialog" aria-labelledby={"addToTermsetModal-" + modalId} aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={"addToTermsetModal-" + modalId}>{`Add "${TermLib.extractLabel(term)}" to Termset`}</h5>
              {!submited &&
                <button type="button" className="close close-btn-message-modal" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              }
            </div>
            <div className="modal-body">
              {!submited &&
                <>
                  <h5>
                    Please select or create a set to add this term.
                  </h5>
                  {createMode &&
                    <>
                      <div className="row">
                        <div className="col-sm-12">
                          <label className="required_input" htmlFor={"termsetTitle" + modalId}>Termset Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id={"termsetTitle" + modalId}
                            placeholder="Enter a Name"
                          >
                          </input>
                        </div>
                      </div>
                      <br></br>
                      <div className="row">
                        <div className="col-sm-12">
                          <label htmlFor={"termsetDescription" + modalId}>Description (optional)</label>
                          <textarea
                            className="form-control"
                            id={"termsetDescription" + modalId}
                            rows="5"
                            placeholder="Enter a Description">
                          </textarea>
                        </div>
                      </div>
                    </>
                  }
                  {!createMode &&
                    <Multiselect
                      isObject={true}
                      options={termsets}
                      selectedValues={selectedTermsetIds}
                      onSelect={() => { }}
                      onRemove={() => { }}
                      displayValue={"text"}
                      avoidHighlightFirstOption={true}
                      closeIcon={"cancel"}
                      id={"selected-termsets-" + term["iri"]}
                      placeholder="Enter termset name ..."
                      className='multiselect-container'
                    />
                  }
                  <br />
                  <button className="btn btn-primary btn-sm" onClick={() => { setCreateMode(!createMode) }}>
                    {createMode ? "Back to selection" : "I want to create a new set"}
                  </button>
                </>
              }
              {submited && addedSuccess &&
                <AlertBox
                  type="success"
                  message="Added successfully!"
                  alertColumnClass="col-sm-12"
                />
              }
              {submited && !addedSuccess &&
                <AlertBox
                  type="danger"
                  message="Something went wrong. Please try again!"
                  alertColumnClass="col-sm-12"
                />
              }
            </div>
            <div className="modal-footer justify-content-center">
              {!submited && <button type="button" className="btn btn-secondary" onClick={() => { }}>
                {createMode ? "Create and add" : "Add"}
              </button>
              }
              {submited && <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
