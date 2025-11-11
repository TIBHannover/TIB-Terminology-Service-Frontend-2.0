import { useState, useContext, useEffect } from "react";
import AlertBox from "../common/Alerts/Alerts";
import Multiselect from "multiselect-react-dropdown";
import { AppContext } from "../../context/AppContext";
import TermLib from "../../Libs/TermLib";
import DropDown from "../common/DropDown/DropDown";
import { createTermset, addTermToMultipleSets, removeTermFromSet } from "../../api/term_set";
import FormLib from "../../Libs/FormLib";
import Login from "../User/Login/TS/Login";
import Modal from "react-bootstrap/Modal";
import { AddToTermsetModalComProps } from "./types";
import { TsTermset } from "../../concepts";
import { OntologyTermDataV2 } from "../../api/types/ontologyTypes";


const VISIBILITY_ONLY_ME = 1;
const VISIBILITY_TS_USRES = 2;
const VISIBILITY_PUBLIC = 3;
const VISIBILITY_VALUES = ['', 'me', 'internal', 'public']
const VISIBILITY_FOR_DROPDOWN = [
  { label: "Me (only you can visit this temset)", value: VISIBILITY_ONLY_ME },
  { label: "Internal (only TS users (not guests) can visit this termset)", value: VISIBILITY_TS_USRES },
  { label: "Public (open for everyone)", value: VISIBILITY_PUBLIC }
];


export const AddToTermsetModal = (props: AddToTermsetModalComProps) => {
  const { modalId, term, btnClass } = props;
  const appContext = useContext(AppContext);

  const [submited, setSubmited] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [selectedTermsetIds, setSelectedTermsetIds] = useState<TsTermset[]>([]);
  const [termsets, setTermSets] = useState<{ text: string, id: string }[]>();
  const [newTermsetVisibility, setNewTermsetVisibility] = useState(VISIBILITY_ONLY_ME);
  const [termExistingSets, setTermExistingSets] = useState<{ name: string, id: string }[]>([]);
  const [termsetNameNotValid, setTermsetNameNotValid] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(new Map());
  const [showModal, setShowModal] = useState(false);


  function submitNewTermset() {
    if (!term) {
      return;
    }
    let name = FormLib.getFieldByIdIfValid("termsetTitle" + modalId);
    let description = document.getElementById("termsetDescription" + modalId) as HTMLInputElement;
    if (!name) {
      return;
    }
    if (appContext.userTermsets.find((tset) => tset.name === name)) {
      setTermsetNameNotValid(true);
      return;
    }
    let data = {
      name: name,
      visibility: VISIBILITY_VALUES[newTermsetVisibility],
      description: description ? description.value : "",
      terms: [term.term]
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


  function addTermToSet() {
    if (!term) {
      return;
    }
    let selectedTermsetsContainer = document.getElementById("selected-termsets-" + term?.iri);
    if (selectedTermsetIds.length === 0 && selectedTermsetsContainer?.style?.border) {
      selectedTermsetsContainer.style.border = '1px solid red';
      return;
    }
    const setIds = selectedTermsetIds.map((tset) => tset.id);
    addTermToMultipleSets(setIds, term.term).then((success) => {
      if (success) {
        let userTermsets = [...appContext.userTermsets];
        userTermsets.forEach((tset) => {
          if (setIds.includes(tset.id)) {
            tset.terms.push(term.term)
          }
        });
        appContext.setUserTermsets(userTermsets);
      }
      setSubmited(true);
      setAddedSuccess(success);
    });
  }


  function removeTerm(e: React.MouseEvent<HTMLElement>) {
    try {
      if (!term) {
        return;
      }
      let removeLoadingMap = new Map(removeLoading);
      let termsetId = e.currentTarget.dataset.tsetid;
      if (!termsetId) {
        return;
      }
      removeLoadingMap.set(termsetId, true);
      setRemoveLoading(removeLoadingMap);
      removeTermFromSet(termsetId, term.iri).then((removed) => {
        if (removed) {
          let deletedSet = document.getElementById("termCurrentSetsLi-" + termsetId);
          if (deletedSet) {
            let existingSetsList = [...termExistingSets];
            let userTermsets = [...appContext.userTermsets];
            let setToRemoveIndex = existingSetsList.findIndex(tset => tset.id === termsetId);
            if (setToRemoveIndex !== -1) {
              existingSetsList.splice(setToRemoveIndex, 1);
              setTermExistingSets(existingSetsList);
            }
            let targetSetIndex = userTermsets.findIndex(tset => tset.id === termsetId);
            let termToRemoveIdex = userTermsets[targetSetIndex].terms.findIndex((tsetTerm: OntologyTermDataV2) => tsetTerm.iri === term.iri);
            if (termToRemoveIdex !== -1) {
              userTermsets[targetSetIndex].terms.splice(termToRemoveIdex, 1);
              appContext.setUserTermsets(userTermsets);
            }
          }
        }
        removeLoadingMap.set(termsetId, false);
        setRemoveLoading(removeLoadingMap);
      })
    } catch {
      return;
    }
  }


  function renderTermsetCreateSection() {
    if (!appContext.user) {
      return "";
    }
    return [
      <>
        <div className="row">
          <div className="col-sm-12">
            <label className="required_input" htmlFor={"termsetTitle" + modalId}>Termset Name</label>
            <input
              type="text"
              className="form-control"
              id={"termsetTitle" + modalId}
              placeholder="Enter a Name"
              onClick={(e) => {
                setTermsetNameNotValid(false);
                e.currentTarget.style.borderColor = "";
              }}
            >
            </input>
            {termsetNameNotValid &&
              <small className="text-danger">Termset already exist.</small>
            }
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-sm-12">
            <DropDown
              options={VISIBILITY_FOR_DROPDOWN}
              dropDownId="termset_visibility_dropdown"
              dropDownTitle="Visibility"
              dropDownChangeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setNewTermsetVisibility(parseInt(e.currentTarget.value || "1"))
              }}
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
              rows={5}
              placeholder="Enter a Description">
            </textarea>
          </div>
        </div>
        <br></br>
        <button className="btn btn-secondary btn-sm" onClick={() => {
          setCreateMode(false)
        }}>
          Back to selection
        </button>
      </>
    ];
  }

  function renderTermsetAddingSection() {
    if (!appContext.user) {
      return <div className="row">
        <div className="col-sm-12">
          <AlertBox type="info"
            message={"Would you like to create your own term set? Log in to get started!"}></AlertBox>
          <Login isModal={false} ignoreMessage={true}></Login>
        </div>
      </div>;
    }
    return [
      <>
        <h6>
          Please select or create a set to add this term.
        </h6>
        <br></br>
        <Multiselect
          isObject={true}
          options={termsets}
          selectedValues={selectedTermsetIds}
          onSelect={(selectedList, _) => {
            document.getElementById("selected-termsets-" + term?.iri)!.style.border = '';
            setSelectedTermsetIds(selectedList);
          }}
          onRemove={(selectedList, _) => {
            document.getElementById("selected-termsets-" + term?.iri)!.style.border = '';
            setSelectedTermsetIds(selectedList);
          }}
          displayValue={"text"}
          avoidHighlightFirstOption={true}
          closeIcon={"cancel"}
          id={"selected-termsets-" + term?.iri}
          placeholder="Enter termset name ..."
          className='multiselect-container'
        />
        <br />
        <button className="btn btn-secondary btn-sm" onClick={() => {
          setCreateMode(true)
        }}>
          I want to create a new set
        </button>
      </>
    ];
  }

  function renderTermsetList() {
    if (termExistingSets.length === 0) {
      return [
        <>
          <div className="row">
            <div className="col-sm-12">
              <b>The term is not associated with any set.</b>
            </div>
          </div>
          <br />
          <br />
        </>
      ];
    }
    let result = [
      <div className="row">
        <div className="col-sm-12">
          <b>Term exists in these sets:</b>
          <ul>
            {termExistingSets.map((tset) => {
              return (
                <li id={"termCurrentSetsLi-" + tset.id}>
                  <a href={process.env.REACT_APP_PROJECT_SUB_PATH + "/termsets/" + tset.id}
                    target={"_blank"} rel={"noreferrer"}>
                    {tset.name}
                  </a>
                  {appContext.user && removeLoading.get(tset.id) && <div className="isLoading-inline-small"></div>}
                  {appContext.user &&
                    <span className="">
                      <i className="bi bi-file-minus-fill" title="remove from this termset"
                        data-tsetid={tset.id} onClick={removeTerm}>
                      </i>
                    </span>
                  }
                </li>)
            })

            }
          </ul>
        </div>
      </div>
    ];
    return result;
  }


  function closeModal() {
    setAddedSuccess(false);
    setSubmited(false);
    setCreateMode(false);
    setSelectedTermsetIds([]);
    setNewTermsetVisibility(VISIBILITY_ONLY_ME);
    setShowModal(false);
  }


  useEffect(() => {
    let options = [];
    let existingSets = [];
    let removeLoadingMap = new Map(removeLoading);
    for (let tset of appContext.userTermsets) {
      if (!tset.terms.find((tsetTerm: OntologyTermDataV2) => tsetTerm.iri === term?.iri)) {
        options.push({ "text": tset.name, "id": tset.id });
      } else {
        removeLoadingMap.set(tset.id, false);
        existingSets.push({ name: tset.name, id: tset.id });
      }
    }
    setTermExistingSets(existingSets)
    setRemoveLoading(removeLoadingMap);
    setTermSets(options);
  }, [term, appContext.userTermsets]);

  if (process.env.REACT_APP_TERMSET_FEATURE !== "true") {
    return <></>;
  }

  let modalTitle = `Add "${TermLib.extractLabel(term)}" to Termset`;
  if (!appContext.user) {
    modalTitle = `Termsets for "${TermLib.extractLabel(term)}"`;
  }


  let title = "Add this term to your termsets. Check the existing termsets for this term.";
  if (!appContext.user) {
    title = "Check the existing termsets for this term.";
  }

  return (
    <>
      <button
        className={"btn btn-secondary borderless-btn " + (btnClass ?? "")}
        aria-label="add this term to termsets"
        title={title}
        onClick={() => setShowModal(true)}
      >
        {appContext.user && <i className="bi bi-plus-square"></i>}
        {!appContext.user && <i className="bi bi-bookmark"></i>}
        {" set"}
      </button>
      <Modal show={showModal} id={"addToTermsetModal-" + modalId}>
        <Modal.Header className="row">
          <div className="col-sm-10">
            <h5 className="modal-title"
              id={"addToTermsetModal-" + modalId}>{modalTitle}</h5>
          </div>
          <div className="col-sm-2 text-end">
            {!submited &&
              <button onClick={closeModal} type="button" className="close bg-white" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            }
          </div>
        </Modal.Header>
        <Modal.Body>
          {!submited && renderTermsetList()}
          {!submited && !createMode && renderTermsetAddingSection()}
          {!submited && createMode && renderTermsetCreateSection()}
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
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          {!submited && appContext.user &&
            <button type="button" className="btn btn-secondary"
              onClick={() => {
                if (createMode) {
                  submitNewTermset();
                } else {
                  addTermToSet();
                }
              }}>
              {createMode ? "Create and add" : "Add"}
            </button>
          }
          {submited && <button type="button" className="btn btn-secondary"
            onClick={closeModal}>Close</button>}
        </Modal.Footer>
      </Modal>
    </>
  );
}
