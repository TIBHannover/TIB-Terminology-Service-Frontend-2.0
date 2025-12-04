import { useState, useContext, useRef } from "react";
import AlertBox from "../common/Alerts/Alerts";
import Multiselect from "multiselect-react-dropdown";
import { AppContext } from "../../context/AppContext";
import { olsSearch } from "../../api/search";
import { SearchApiInput } from "../../api/types/searchApiTypes";
import TermLib from "../../Libs/TermLib";
import { updateTermset } from "../../api/term_set";
import TermApi from "../../api/term";
import Modal from "react-bootstrap/Modal";
import { AddTermModalComProps } from "./types";
import { BaseSearchSingleResult } from "../../api/types/searchApiTypes";


type MultiSelectOption = {
  text?: string;
  iri?: string;
  ontologyId?: string;
}

export const AddTermModal = (props: AddTermModalComProps) => {
  const { termset, modalId } = props;
  const appContext = useContext(AppContext);

  const [submited, setSubmited] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [termListOptions, setTermListOptions] = useState<MultiSelectOption[]>();
  const [selectedTerms, setSelectedTerms] = useState<MultiSelectOption[]>();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);


  const searchUnderRef = useRef(null);


  async function submitNewTermsToSet() {
    if (!selectedTerms || !termset) {
      return;
    }
    setSubmitLoading(true);
    let selectedTermsV2 = [];
    for (let term of selectedTerms) {
      let termApi = new TermApi(term['ontologyId'], term['iri']);
      await termApi.fetchTerm();
      selectedTermsV2.push(termApi.term);
    }
    termset.terms = [...termset.terms, ...selectedTermsV2];
    updateTermset(termset).then((updatedTermset) => {
      if (updatedTermset) {
        let userTermsets = [...appContext.userTermsets];
        let tsInex = userTermsets.findIndex(tset => tset.id === updatedTermset.id);
        userTermsets.splice(tsInex, 1);
        userTermsets.push(updatedTermset);
        appContext.setUserTermsets(userTermsets);
        setSubmited(true);
        setAddedSuccess(true);
      } else {
        setSubmited(true);
        setAddedSuccess(false);
      }
      setSubmitLoading(false);
    });
  }

  function onTermSelect(selectedTerms: MultiSelectOption[]) {
    setSelectedTerms(selectedTerms);
  }


  async function onSearchTermChange(query: string) {
    setLoading(true);
    if (!query) {
      setTermListOptions([]);
      return true;
    }
    let inputQuery: SearchApiInput = {
      searchQuery: query,
      selectedOntologies: [],
      selectedTypes: [],
      selectedCollections: [],
      obsoletes: false,
      exact: false,
      includeImported: false,
      isLeaf: false,
      searchInValues: ["label"],
      searchUnderIris: [],
      searchUnderAllIris: [],
      fromOntologyPage: false
    };
    if (appContext.userSettings.userCollectionEnabled) {
      inputQuery["selectedOntologies"] = appContext.userSettings.activeCollection.ontology_ids;
    }
    //@ts-ignore
    let searchRes = await olsSearch(inputQuery);
    let terms = !Array.isArray(searchRes) ? searchRes.elements : [];
    let options: MultiSelectOption[] = [];
    for (let term of terms) {
      let opt = { text: "", iri: "", ontologyId: "" };
      opt['text'] = `${term.ontologyId}:${term.label} (${term.type})`;
      opt['iri'] = term.iri;
      opt['ontologyId'] = term.ontologyId;
      options.push(opt);
    }
    setLoading(false);
    setTermListOptions(options);
  }


  function closeModal() {
    setAddedSuccess(false);
    setSubmited(false);
    setSelectedTerms([]);
    setShowModal(false);
  }


  return (
    <>
      <button
        className={"btn-secondary text-white borderless-btn"}
        aria-label="add this term to termset"
        onClick={() => {
          setShowModal(true)
        }}
      >
        <i className="bi bi-plus-square"></i>
        {" terms"}
      </button>
      <Modal show={showModal} id={"addToTermsetModal-" + modalId}>
        <Modal.Header className="row">
          <div className="col-6">
            <h5 className="modal-title"
              id={"addToTermsetModal-" + modalId}>{`Add terms to this set`}</h5>
          </div>
          <div className="col-6 text-end">
            {!submited &&
              <button onClick={closeModal} type="button" className="close bg-white" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            }
          </div>
        </Modal.Header>
        <Modal.Body>
          {!submited &&
            <Multiselect
              isObject={true}
              options={termListOptions}
              selectedValues={selectedTerms}
              onSelect={onTermSelect}
              onRemove={onTermSelect}
              onSearch={onSearchTermChange}
              displayValue={"text"}
              avoidHighlightFirstOption={true}
              loading={loading}
              closeIcon={"cancel"}
              id="search-terms"
              placeholder={"class, property, individual"}
              ref={searchUnderRef}
            />
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
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          {!submited &&
            <button
              type="button"
              className="btn btn-secondary"
              onClick={submitNewTermsToSet}>
              {"Add"}
              {submitLoading && <div className="isLoading-btn"></div>}
            </button>
          }
          {submited &&
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                closeModal();
                window.location.reload();
              }}
            >
              Close
            </button>
          }
        </Modal.Footer>
      </Modal>
    </>
  );
}
