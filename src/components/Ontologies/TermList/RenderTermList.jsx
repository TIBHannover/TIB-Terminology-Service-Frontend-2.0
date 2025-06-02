import { useEffect, useState } from "react";
import Pagination from "../../common/Pagination/Pagination";
import JumpTo from "../../common/JumpTo/JumpTo";
import DropDown from "../../common/DropDown/DropDown";
import AlertBox from "../../common/Alerts/Alerts";
import TermLib from "../../../Libs/TermLib";
import TermTable from "../../common/TermTable/TermTable";



const PAGE_SIZES_FOR_DROPDOWN = [{ label: "20", value: 20 }, { label: "30", value: 30 }, { label: "40", value: 40 }, { label: "50", value: 50 }];
const LABEL_COL_NAME = "label";
const ID_COL_NAME = "id";
const DESCRIPTION_COL_NAME = "description";
const ALTERNATIVE_TERM_COL_NAME = "alternativeTerm";
const SUB_CLASS_OF_COL_NAME = "subClassOf";
const EQUIVALENT_TO_COL_NAME = "equivalentTo";
const EXAMPLE_OF_USAGE_COL_NAME = "exampleOfUsage";
const SEE_ALSO_COL_NAME = "seeAlso";
const CONTRIBUTOR_COL_NAME = "contributor";
const COMMENT_COL_NAME = "comment";




export const RenderTermList = (props) => {
  const [rowDataForTable, setRowDataForTable] = useState([]);
  const [columnDataForTable, _] = useState([
    { id: "shortForm", text: "ID" },
    { id: "label", text: "Label" },
    { id: "decs", text: "Description" },
    { id: "altTerm", text: "Alternative Term" },
    { id: "subclass", text: "SubClass Of" },
    { id: "eqto", text: "Equivalent to" },
    { id: "example", text: "Example of usage" },
    { id: "seealso", text: "See Also" },
    { id: "contrib", text: "Contributor" },
    { id: "comment", text: "Comment" },

  ]);
  const [noResultFlag, setNoResultFlag] = useState(false);



  async function createList() {
    let listOfterms = props.listOfTerms;
    let baseUrl = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/';
    let dataForTable = [];
    for (let term of listOfterms) {
      let termTreeUrl = baseUrl + encodeURIComponent(term['ontologyId']) + '/terms?iri=' + encodeURIComponent(term['iri']);
      let annotation = term['annotation'];
      let termMap = new Map();
      termMap.set("shortForm", { value: term["shortForm"], valueLink: "" });
      termMap.set("label", { value: term["label"], valueLink: termTreeUrl });
      termMap.set("decs", { value: TermLib.createTermDiscription(term) ?? annotation?.definition, valueLink: "" });
      termMap.set("altTerm", { value: annotation['alternative label'] ? annotation['alternative label'] : "N/A", valueLink: "" });
      termMap.set("subclass", { value: term.subclassOfText, valueLink: "" });
      termMap.set("eqto", { value: term.equivalentToText, valueLink: "" });
      termMap.set("example", { value: term['annotation']['example of usage'] ? term['annotation']['example of usage'] : "N/A", valueLink: "" });
      termMap.set("seealso", { value: term['annotation']['seeAlso'] ? term['annotation']['seeAlso'] : "N/A", valueLink: "" });
      termMap.set("contrib", { value: setContributorField(term), valueLink: "" });
      termMap.set("comment", { value: term['annotation']['comment'] ? term['annotation']['comment'] : "N/A", valueLink: "" });

      dataForTable.push(termMap);
    }
    setRowDataForTable(dataForTable);
    props.setTableIsLoading(false);
  }


  //function createTableBody(term, termTreeUrl, subclassOfText, equivalentToText) {
  //  let annotation = term['annotation'];
  //  if (Array.isArray(annotation['alternative label'])) {
  //    annotation['alternative label'] = annotation['alternative label'].join(", ");
  //  }
  //  return (
  //    <tr>
  //      {columnVisibility.label &&
  //        <td className="label-col text-break">
  //          <a className="table-list-label-anchor" href={termTreeUrl} target="_blank">
  //            {term['label']}
  //          </a>
  //        </td>
  //      }
  //      {columnVisibility.id && <td className="text-break">{term['shortForm']}</td>}
  //      {columnVisibility.description && <td className="text-break">{TermLib.createTermDiscription(term) ?? term?.annotation?.definition}</td>}
  //      {columnVisibility.alternativeTerm && <td className="text-break">{annotation['alternative label'] ? annotation['alternative label'] : "N/A"}</td>}
  //      {columnVisibility.subClassOf && <td className="text-break"><span dangerouslySetInnerHTML={{ __html: subclassOfText }} /></td>}
  //      {columnVisibility.equivalentTo && <td className="text-break"><span dangerouslySetInnerHTML={{ __html: equivalentToText }} /></td>}
  //      {columnVisibility.exampleOfUsage && <td className="text-break">{term['annotation']['example of usage'] ? term['annotation']['example of usage'] : "N/A"}</td>}
  //      {columnVisibility.seeAlso && <td className="text-break">{term['annotation']['seeAlso'] ? term['annotation']['seeAlso'] : "N/A"}</td>}
  //      {columnVisibility.contributor && <td className="text-break">{setContributorField(term)}</td>}
  //      {columnVisibility.comment && <td className="text-break">{term['annotation']['comment'] ? term['annotation']['comment'] : "N/A"}</td>}
  //    </tr>
  //  );
  //}
  //
  //
  //
  //function createClassListTableHeader() {
  //  return [
  //    <thead>
  //      <tr>
  //        {columnVisibility.label && <th scope="col">Label <a onClick={showHideTableColumn} value={LABEL_COL_NAME}><i className="fa fa-eye-slash hidden-fa stour-class-list-hide-column-icon"></i></a></th>}
  //        {columnVisibility.id && <th scope="col">ID <a onClick={showHideTableColumn} value={ID_COL_NAME}><i className="fa fa-eye-slash hidden-fa"></i></a></th>}
  //        {columnVisibility.description && <th scope="col">Description <a onClick={showHideTableColumn} value={DESCRIPTION_COL_NAME}><i className="fa fa-eye-slash hidden-fa"></i></a></th>}
  //        {columnVisibility.alternativeTerm && <th scope="col">Alternative Term <a onClick={showHideTableColumn} value={ALTERNATIVE_TERM_COL_NAME}><i className="fa fa-eye-slash hidden-fa"></i></a></th>}
  //        {columnVisibility.subClassOf && <th scope="col">SubClass Of <a onClick={showHideTableColumn} value={SUB_CLASS_OF_COL_NAME}><i className="fa fa-eye-slash hidden-fa"></i></a></th>}
  //        {columnVisibility.equivalentTo && <th scope="col">Equivalent to <a onClick={showHideTableColumn} value={EQUIVALENT_TO_COL_NAME}><i className="fa fa-eye-slash hidden-fa"></i></a></th>}
  //        {columnVisibility.exampleOfUsage && <th scope="col">Example of usage <a onClick={showHideTableColumn} value={EXAMPLE_OF_USAGE_COL_NAME}><i className="fa fa-eye-slash hidden-fa"></i></a></th>}
  //        {columnVisibility.seeAlso && <th scope="col">See Also <a onClick={showHideTableColumn} value={SEE_ALSO_COL_NAME}><i className="fa fa-eye-slash hidden-fa"></i></a></th>}
  //        {columnVisibility.contributor && <th scope="col">Contributor <a onClick={showHideTableColumn} value={CONTRIBUTOR_COL_NAME}><i className="fa fa-eye-slash hidden-fa"></i></a></th>}
  //        {columnVisibility.comment && <th scope="col">Comment <a onClick={showHideTableColumn} value={COMMENT_COL_NAME}><i className="fa fa-eye-slash hidden-fa"></i></a></th>}
  //      </tr>
  //    </thead>
  //  ];
  //}
  //
  //
  //
  //function createClassListTableHeaderForObsoletes() {
  //  return [
  //    <thead>
  //      <tr>
  //        {columnVisibility.label && <th scope="col">Label <a onClick={showHideTableColumn} value={LABEL_COL_NAME}><i className="fa fa-eye-slash hidden-fa stour-class-list-hide-column-icon"></i></a></th>}
  //        {columnVisibility.comment && <th scope="col">Comment <a onClick={showHideTableColumn} value={COMMENT_COL_NAME}><i className="fa fa-eye-slash hidden-fa"></i></a></th>}
  //        {columnVisibility.id && <th scope="col">ID <a onClick={showHideTableColumn} value={ID_COL_NAME}><i className="fa fa-eye-slash hidden-fa"></i></a></th>}
  //        {columnVisibility.description && <th scope="col">Description <a onClick={showHideTableColumn} value={DESCRIPTION_COL_NAME}><i className="fa fa-eye-slash hidden-fa"></i></a></th>}
  //        {columnVisibility.alternativeTerm && <th scope="col">Alternative Term <a onClick={showHideTableColumn} value={ALTERNATIVE_TERM_COL_NAME}><i className="fa fa-eye-slash hidden-fa"></i></a></th>}
  //        {columnVisibility.equivalentTo && <th scope="col">Equivalent to <a onClick={showHideTableColumn} value={EQUIVALENT_TO_COL_NAME}><i className="fa fa-eye-slash hidden-fa"></i></a></th>}
  //        {columnVisibility.exampleOfUsage && <th scope="col">Example of usage <a onClick={showHideTableColumn} value={EXAMPLE_OF_USAGE_COL_NAME}><i className="fa fa-eye-slash hidden-fa"></i></a></th>}
  //        {columnVisibility.seeAlso && <th scope="col">See Also <a onClick={showHideTableColumn} value={SEE_ALSO_COL_NAME}><i className="fa fa-eye-slash hidden-fa"></i></a></th>}
  //        {columnVisibility.contributor && <th scope="col">Contributor <a onClick={showHideTableColumn} value={CONTRIBUTOR_COL_NAME}><i className="fa fa-eye-slash hidden-fa"></i></a></th>}
  //      </tr>
  //    </thead>
  //  ];
  //}
  //
  //
  //
  //
  //
  //
  //
  //function createTableBodyForObsoletes(term, termTreeUrl, subclassOfText, equivalentToText) {
  //  return (
  //    <tr>
  //      {columnVisibility.label &&
  //        <td className="text-break">
  //          <a className="table-list-label-anchor" href={termTreeUrl} target="_blank">
  //            {term['label']}
  //          </a>
  //        </td>
  //      }
  //      {columnVisibility.comment && <td className="text-break">{term['annotation']['comment'] ? term['annotation']['comment'] : "N/A"}</td>}
  //      {columnVisibility.id && <td className="text-break">{term['short_form']}</td>}
  //      {columnVisibility.description && <td className="text-break">{term['description'] ? term['description'] : ""}</td>}
  //      {columnVisibility.alternativeTerm && <td className="text-break">{term['annotation']['alternative term'] ? term['annotation']['alternative term'] : "N/A"}</td>}
  //      {columnVisibility.equivalentTo && <td className="text-break"><span dangerouslySetInnerHTML={{ __html: equivalentToText }} /></td>}
  //      {columnVisibility.exampleOfUsage && <td className="text-break">{term['annotation']['example of usage'] ? term['annotation']['example of usage'] : "N/A"}</td>}
  //      {columnVisibility.seeAlso && <td className="text-break">{term['annotation']['seeAlso'] ? term['annotation']['seeAlso'] : "N/A"}</td>}
  //      {columnVisibility.contributor && <td className="text-break">{setContributorField(term)}</td>}
  //    </tr>
  //  );
  //}
  //
  //
  //
  //function createShowColumnsTags() {
  //  return [
  //    <span>
  //      {!columnVisibility.label && <div class="show-hidden-column" onClick={showHideTableColumn} value={LABEL_COL_NAME}>Label <i className="fa fa-eye"></i></div>}
  //      {!columnVisibility.id && <div class="show-hidden-column" onClick={showHideTableColumn} value={ID_COL_NAME}>ID <i className="fa fa-eye"></i></div>}
  //      {!columnVisibility.description && <div class="show-hidden-column" onClick={showHideTableColumn} value={DESCRIPTION_COL_NAME}>Description <i className="fa fa-eye"></i></div>}
  //      {!columnVisibility.alternativeTerm && <div class="show-hidden-column" onClick={showHideTableColumn} value={ALTERNATIVE_TERM_COL_NAME}>Alternative Term <i className="fa fa-eye"></i></div>}
  //      {!columnVisibility.subClassOf && <div class="show-hidden-column" onClick={showHideTableColumn} value={SUB_CLASS_OF_COL_NAME}>SubClass Of <i className="fa fa-eye"></i></div>}
  //      {!columnVisibility.equivalentTo && <div class="show-hidden-column" onClick={showHideTableColumn} value={EQUIVALENT_TO_COL_NAME}>Equivalent to <i className="fa fa-eye"></i></div>}
  //      {!columnVisibility.exampleOfUsage && <div class="show-hidden-column" onClick={showHideTableColumn} value={EXAMPLE_OF_USAGE_COL_NAME}>Example of usage <i className="fa fa-eye"></i></div>}
  //      {!columnVisibility.seeAlso && <div class="show-hidden-column" onClick={showHideTableColumn} value={SEE_ALSO_COL_NAME}>See Also <i className="fa fa-eye"></i></div>}
  //      {!columnVisibility.contributor && <div class="show-hidden-column" onClick={showHideTableColumn} value={CONTRIBUTOR_COL_NAME}>Contributor <i className="fa fa-eye"></i></div>}
  //      {!columnVisibility.comment && <div class="show-hidden-column" onClick={showHideTableColumn} value={COMMENT_COL_NAME}>Comment <i className="fa fa-eye"></i></div>}
  //    </span>
  //  ];
  //}
  //

  function setContributorField(term) {
    if (term['annotation']['contributor']) {
      return term['annotation']['contributor'];
    }
    else if (term['annotation']['term editor']) {
      return term['annotation']['term editor'];
    }
    else if (term['annotation']['creator']) {
      return term['annotation']['creator'];
    }
    else {
      return "N/A";
    }
  }



  //function showHideTableColumn(e) {
  //  try {
  //    props.setTableIsLoading(true);
  //    let colId = "";
  //    if (e.target.tagName === "I") {
  //      colId = e?.target?.parentNode?.attributes?.value?.value;
  //    } else {
  //      colId = e?.target?.attributes?.value?.value;
  //    }
  //    if (!colId) {
  //      props.setTableIsLoading(false);
  //      return true;
  //    }
  //    let columnVisibilityCopy = { ...columnVisibility };
  //    columnVisibilityCopy[colId] = !columnVisibilityCopy[colId];
  //    setColumnVisibility(columnVisibilityCopy);
  //  }
  //  catch (e) {
  //    props.setTableIsLoading(false);
  //    return true;
  //  }
  //}



  useEffect(() => {
    if (props.listOfTerms.length !== 0 && props.listOfTerms[0] !== "loading") {
      setNoResultFlag(false);
      createList();
    }
    else if (props.listOfTerms.length === 0) {
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
                  onChange={props.obsoletesCheckboxHandler}
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

    </div>
  );
}

