import { useState, useContext, useEffect } from "react";
import AlertBox from "../common/Alerts/Alerts";
import Multiselect from "multiselect-react-dropdown";
import { AppContext } from "../../context/AppContext";
import TermLib from "../../Libs/TermLib";
import DropDown from "../common/DropDown/DropDown";
import { createTermset } from "../../api/term_set";


const VISIBILITY_ONLY_ME = 1;
const VISIBILITY_TS_USRES = 2;
const VISIBILITY_PUBLIC = 3;
const VISIBILITY_VALUES = ['', 'me', 'internal', 'public']
const VISIBILITY_FOR_DROPDOWN = [
  { label: "Me (only you can visit this temset)", value: VISIBILITY_ONLY_ME },
  { label: "Internal (only TS users (not guests) can visit this termset)", value: VISIBILITY_TS_USRES },
  { label: "Public (open for everyone)", value: VISIBILITY_PUBLIC }
];



export const AddToTermsetModalBtn = (props) => {
  const { modalId } = props;
  return (
    <a
      className={"btn btn-secondary btn-sm borderless-btn"}
      data-toggle="modal"
      data-target={"#addToTermsetModal-" + modalId}
      data-backdrop="static"
    >
      <i class="bi bi-plus-square"></i>
      {" set"}
    </a>
  );
}


export const AddToTermsetModal = (props) => {
  const { modalId, term } = props;
  const appContext = useContext(AppContext);

  const [submited, setSubmited] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [selectedTermsetIds, setSelectedTermsetIds] = useState([]);
  const [termsets, setTermSets] = useState();
  const [newTermsetVisibility, setNewTermsetVisibility] = useState(VISIBILITY_ONLY_ME);
  const [termExistingSets, setTermExistingSets] = useState("");


  function submitNewTermset() {
    let name = document.getElementById("termsetTitle" + modalId).value;
    let description = document.getElementById("termsetDescription" + modalId).value;
    if (!name) {
      return;
    }
    let data = {
      name: name,
      visibility: VISIBILITY_VALUES[newTermsetVisibility],
      description: description,
      terms: [props.term]
    };

    createTermset(data).then((newTermset) => {
      if (newTermset) {
        let userTermsets = [...appContext.userTermsets];
        userTermsets.push(newTermset);
        appContext.setUserTermsets(userTermsets);
        setSubmited(true);
        setAddedSuccess(true);
        return true;
      }
      setSubmited(true);
      setAddedSuccess(false);
    });

  }


  function closeModal() {
    setAddedSuccess(false);
    setSubmited(false);
    setCreateMode(false);
    setSelectedTermsetIds([]);
    setNewTermsetVisibility(VISIBILITY_ONLY_ME);
  }


  useEffect(() => {
    let options = [];
    let existingSets = [];
    for (let tset of appContext.userTermsets) {
      if (!tset.terms.find((tsetTerm) => tsetTerm.iri === term.iri)) {
        options.push({ "text": tset.name, "id": tset.id });
      } else {
        existingSets.push(tset.name);
      }
    }
    setTermExistingSets(existingSets.length !== 0 ? existingSets.join(", ") : "")
    setTermSets(options);
  }, [term]);


  return (
    <div>
      <div className="modal fade" id={"addToTermsetModal-" + modalId} tabIndex={-1} role="dialog" aria-labelledby={"addToTermsetModal-" + modalId} aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={"addToTermsetModal-" + modalId}>{`Add "${TermLib.extractLabel(term)}" to Termset`}</h5>
              {!submited &&
                <button onClick={closeModal} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              }
            </div>
            <div className="modal-body">
              {!submited &&
                <>
                  {termExistingSets && <AlertBox message={`Selected term is already part of these sets: ${termExistingSets}`} type="warning" />}
                  <h6>
                    Please select or create a set to add this term.
                  </h6>
                  <br></br>
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
                          <DropDown
                            options={VISIBILITY_FOR_DROPDOWN}
                            dropDownId="termset_visibility_dropdown"
                            dropDownTitle="Visibility"
                            dropDownChangeHandler={(e) => { setNewTermsetVisibility(e.target.value) }}
                          />
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
                  <button className="btn btn-secondary btn-sm" onClick={() => { setCreateMode(!createMode) }}>
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
              {!submited && <button type="button" className="btn btn-secondary" onClick={submitNewTermset}>
                {createMode ? "Create and add" : "Add"}
              </button>
              }
              {submited && <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={closeModal}>Close</button>}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
