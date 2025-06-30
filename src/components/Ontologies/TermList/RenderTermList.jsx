import {useEffect, useState} from "react";
import Pagination from "../../common/Pagination/Pagination";
import JumpTo from "../../common/JumpTo/JumpTo";
import DropDown from "../../common/DropDown/DropDown";
import AlertBox from "../../common/Alerts/Alerts";
import TermLib from "../../../Libs/TermLib";
import TermTable from "../../common/TermTable/TermTable";
import {AddToTermsetModal, AddToTermsetModalBtn} from "../../TermSet/AddTermToSet";


const PAGE_SIZES_FOR_DROPDOWN = [{label: "20", value: 20}, {label: "30", value: 30}, {
  label: "40",
  value: 40
}, {label: "50", value: 50}];


export const RenderTermList = (props) => {
  const [rowDataForTable, setRowDataForTable] = useState([]);
  const [columnDataForTable, setColumnDataForTable] = useState();
  const [noResultFlag, setNoResultFlag] = useState(false);
  const [termsetModals, setTermsetModals] = useState([]);
  
  
  function setTableHeaders(isObsolete) {
    if (!isObsolete) {
      setColumnDataForTable(
        [
          {id: "action", value: ""},
          {id: "shortForm", text: "ID"},
          {id: "label", text: "Label"},
          {id: "decs", text: "Description"},
          {id: "altTerm", text: "Alternative Term"},
          {id: "subclass", text: "SubClass Of"},
          {id: "eqto", text: "Equivalent to"},
          {id: "example", text: "Example of usage"},
          {id: "seealso", text: "See Also"},
          {id: "contrib", text: "Contributor"},
          {id: "comment", text: "Comment"},
        ]
      );
      return;
    }
    setColumnDataForTable(
      [
        {id: "action", value: ""},
        {id: "label", text: "Label"},
        {id: "comment", text: "Comment"},
        {id: "shortForm", text: "ID"},
        {id: "decs", text: "Description"},
        {id: "altTerm", text: "Alternative Term"},
        {id: "eqto", text: "Equivalent to"},
        {id: "example", text: "Example of usage"},
        {id: "seealso", text: "See Also"},
        {id: "contrib", text: "Contributor"},
      ]
    );
  }
  
  
  async function createList() {
    let listOfterms = props.listOfTerms;
    let baseUrl = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/';
    let dataForTable = [];
    let modals = [];
    let id = 0;
    for (let term of listOfterms) {
      let termTreeUrl = baseUrl + encodeURIComponent(term['ontologyId']) + '/terms?iri=' + encodeURIComponent(term['iri']);
      let annotation = term['annotation'];
      let addToSetButton = <AddToTermsetModalBtn modalId={"term-in-tree-" + id} btnClass={"termset-btn"}/>;
      let addToSetModal = <AddToTermsetModal modalId={"term-in-tree-" + id} term={term}/>;
      id += 1;
      let termMap = new Map();
      termMap.set("shortForm", {value: term["shortForm"], valueLink: ""});
      termMap.set("label", {value: term["label"], valueLink: termTreeUrl});
      termMap.set("decs", {value: TermLib.createTermDiscription(term) ?? annotation?.definition, valueLink: ""});
      termMap.set("altTerm", {
        value: annotation['alternative label'] ? annotation['alternative label'] : "N/A",
        valueLink: ""
      });
      termMap.set("subclass", {value: term.subClassOf, valueLink: "", valueIsHtml: true});
      termMap.set("eqto", {value: term.eqAxiom, valueLink: "", valueIsHtml: true});
      termMap.set("example", {
        value: term['annotation']['example of usage'] ? term['annotation']['example of usage'] : "N/A",
        valueLink: ""
      });
      termMap.set("seealso", {
        value: term['annotation']['seeAlso'] ? term['annotation']['seeAlso'] : "N/A",
        valueLink: ""
      });
      termMap.set("contrib", {value: TermLib.getContributors(term), valueLink: ""});
      termMap.set("comment", {
        value: term['annotation']['comment'] ? term['annotation']['comment'] : "N/A",
        valueLink: ""
      });
      termMap.set("action", {value: addToSetButton, valueLink: ""});
      modals.push(addToSetModal);
      dataForTable.push(termMap);
    }
    setTermsetModals(modals);
    setRowDataForTable(dataForTable);
    props.setTableIsLoading(false);
  }
  
  useEffect(() => {
    setTableHeaders(props.isObsolete);
  }, []);
  
  
  useEffect(() => {
    if (props.listOfTerms.length !== 0 && props.listOfTerms[0] !== "loading") {
      setNoResultFlag(false);
      createList();
    } else if (props.listOfTerms.length === 0) {
      setNoResultFlag(true);
    }
  }, [props.listOfTerms]);
  
  
  return (
    <div className="tree-view-container list-container">
      <div className="row">
        <div className="col-sm-12 stour-class-list-jumpto-box">
          <JumpTo
            targetType={"terms"}
            label={"Jump to"}
            handleJumtoSelection={props.handleJumtoSelection}
            obsoletes={props.isObsolete}
          />
          <br></br>
        </div>
      </div>
      <div className="row">
        {!props.iri &&
          <div className="col-sm-3 mt-1">
            <div className="termlist-jumpto-container">
              <div className="form-group form-check stour-class-list-obsolete-checkbox">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="obsolte_check_term_list"
                  onChange={(e) => {
                    setTableHeaders(e.target.checked);
                    props.obsoletesCheckboxHandler(e);
                  }}
                />
                <label className="form-check-label" htmlFor="obsolte_check_term_list">Include obsoletes terms</label>
              </div>
            </div>
          </div>}
        <div className="col-sm-3">
          {!props.iri &&
            <DropDown
              options={PAGE_SIZES_FOR_DROPDOWN}
              dropDownId="list-result-per-page"
              containerClass="result-per-page-dropdown-container"
              dropDownTitle="Result Per Page"
              dropDownValue={props.pageSize}
              dropDownChangeHandler={props.handlePageSizeDropDownChange}
            />
          }
          {props.iri &&
            <button className='btn btn-secondary ml-2' onClick={props.resetList}>Show All Classes</button>
          }
        </div>
        <div className="col-sm-3 text-right mt-1">
          {!props.iri &&
            <b>{"Showing " + (props.pageNumber * props.pageSize + 1) + " - " + ((props.pageNumber + 1) * props.pageSize) + " of " + props.totalNumberOfTerms + " Classes"}</b>
          }
        </div>
        <div className="col-sm-3">
          {!props.iri &&
            <Pagination
              clickHandler={props.handlePagination}
              count={props.pageCount()}
              initialPageNumber={props.pageNumber + 1}
            />
          }
        </div>
      </div>
      <div className="row class-list-tablle-holder">
        {!noResultFlag &&
          <TermTable
            columns={columnDataForTable}
            terms={rowDataForTable}
            tableIsLoading={props.tableIsLoading}
            setTableIsLoading={props.setTableIsLoading}
          />
        }
      </div>
      {noResultFlag &&
        <AlertBox
          type="info"
          message="No Class Found! "
          alertColumnClass="col-sm-12"
        />
      }
      {termsetModals}
    
    </div>
  );
}

