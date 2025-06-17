import {useState, useEffect} from "react";
import {getTermset} from "../../api/term_set";
import {useQuery} from "@tanstack/react-query";
import TermTable from "../common/TermTable/TermTable";
import TermLib from "../../Libs/TermLib";
import {Link} from 'react-router-dom';
import DropDown from "../common/DropDown/DropDown";
import Pagination from "../common/Pagination/Pagination";
import {AddTermModal, AddTermModalBtn} from "./AddTermModal";
import Toolkit from "../../Libs/Toolkit";


const PAGE_SIZES_FOR_DROPDOWN = [{label: "10", value: 10}, {label: "20", value: 20}, {
  label: "30",
  value: 30
}, {label: "40", value: 40}, {label: "50", value: 50}];
const DEFAUTL_ROWS_COUNT = 10;


const TermSetPage = (props) => {
  const termsetId = props.match.params.termsetId;
  
  const [dataLoaded, setDataLoaded] = useState(false);
  const [rowDataForTable, setRowDataForTable] = useState([]);
  const [tableColumns, _] = useState(
    [
      {id: "shortForm", text: "ID"},
      {id: "label", text: "Label"},
      {id: "decs", text: "Description"},
      {id: "altTerm", text: "Alternative Term"},
      //{ id: "subclass", text: "SubClass Of" },
      //{ id: "eqto", text: "Equivalent to" },
      {id: "example", text: "Example of usage"},
      {id: "seealso", text: "See Also"},
      {id: "contrib", text: "Contributor"},
      {id: "comment", text: "Comment"},
    ]);
  const [size, setSize] = useState(DEFAUTL_ROWS_COUNT);
  const [page, setPage] = useState(0);
  const [totalTermsCount, setTotalTermsCount] = useState(0);
  
  const {data, loading, error} = useQuery({
    queryKey: ["termset", termsetId],
    queryFn: () => getTermset(termsetId),
  });
  
  function createTermListForTable(listOfterms) {
    let baseUrl = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/';
    let dataForTable = [];
    listOfterms = listOfterms.slice(page * size, page * size + size);
    for (let termWrapper of listOfterms) {
      let term = termWrapper.json;
      let termTreeUrl = baseUrl + encodeURIComponent(term['ontologyId']) + '/terms?iri=' + encodeURIComponent(term['iri']);
      let annotation = TermLib.getAnnotations(term);
      term["annotation"] = annotation;
      let termMap = new Map();
      termMap.set("shortForm", {value: term["shortForm"], valueLink: ""});
      termMap.set("label", {value: TermLib.extractLabel(term), valueLink: termTreeUrl});
      termMap.set("decs", {value: TermLib.createTermDiscription(term) ?? annotation?.definition, valueLink: ""});
      termMap.set("altTerm", {
        value: annotation['alternative label'] ? annotation['alternative label'] : "N/A",
        valueLink: ""
      });
      //termMap.set("subclass", { value: term.subClassOf, valueLink: "", valueIsHtml: true });
      //termMap.set("eqto", { value: term.eqAxiom, valueLink: "", valueIsHtml: true });
      termMap.set("example", {
        value: annotation['example of usage'] ? annotation['example of usage'] : "N/A",
        valueLink: ""
      });
      termMap.set("seealso", {value: annotation['seeAlso'] ? annotation['seeAlso'] : "N/A", valueLink: ""});
      termMap.set("contrib", {value: TermLib.getContributors(term), valueLink: ""});
      termMap.set("comment", {value: annotation['comment'] ? annotation['comment'] : "N/A", valueLink: ""});
      
      dataForTable.push(termMap);
    }
    setRowDataForTable(dataForTable);
    //props.setTableIsLoading(false);
  }
  
  
  function searchInputChangeHandler(e) {
    let query = e.target.value;
    if (query) {
      let selectedTerms = data.terms.filter((term) => {
        let label = TermLib.extractLabel(term.json);
        if (label.toLowerCase().includes(query.toLowerCase())) {
          return true;
        }
        return false;
      })
      createTermListForTable(selectedTerms);
      setTotalTermsCount(selectedTerms.length);
    } else {
      createTermListForTable(data.terms);
      setTotalTermsCount(data.terms.length);
    }
  }
  
  async function downloadJsonOnClick() {
    if (!data) {
      return;
    }
    let termList = [];
    for (let term of data.terms) {
      termList.push(term.json);
    }
    const jsonFile = JSON.stringify(termList);
    await Toolkit.downloadJsonFile(data.name + "_terms.json", jsonFile);
  }
  
  async function downloadCsvOnClick() {
    if (!data) {
      return;
    }
    let rows = [];
    rows.push(tableColumns.map(column => column.text));
    for (let termWrapper of data.terms) {
      let term = termWrapper.json;
      let annotation = TermLib.getAnnotations(term);
      let row = [];
      console.log(TermLib.createTermDiscription(term) ?? annotation?.definition)
      row.push(escapeCSV(term["shortForm"]));
      row.push(escapeCSV(TermLib.extractLabel(term)));
      row.push(escapeCSV(TermLib.createTermDiscription(term) ?? annotation?.definition));
      row.push(escapeCSV(annotation['alternative label'] ? annotation['alternative label'] : "N/A"));
      row.push(escapeCSV(annotation['example of usage'] ? annotation['example of usage'] : "N/A"));
      row.push(escapeCSV(annotation['seeAlso'] ? annotation['seeAlso'] : "N/A"));
      row.push(escapeCSV(TermLib.getContributors(term)));
      row.push(escapeCSV(annotation['comment'] ? annotation['comment'] : "N/A"));
      rows.push(row);
    }
    let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", data.name + "_terms.csv");
    document.body.appendChild(link);
    link.click();
    
  }
  
  function escapeCSV(value) {
    if (value == null) return ''; // handle null/undefined
    const str = String(value);
    if (/[,"\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }
  
  
  useEffect(() => {
    if (dataLoaded) {
      return;
    }
    if (data) {
      setDataLoaded(true);
      createTermListForTable(data.terms);
      setTotalTermsCount(data.terms.length);
    }
  }, [data]);
  
  
  if (error) {
    return ("error!")
  }
  
  return (
    <div className="justify-content-center ontology-page-container">
      <div className="tree-view-container list-container">
        <div className="row">
          <div className="col-12">
            <Link className="btn-sm btn-secondary"
                  to={process.env.REACT_APP_PROJECT_SUB_PATH + "/mytermsets"}>
              <i className="bi bi-arrow-left mr-1"></i>
              My termset list
            </Link>
          </div>
        </div>
        <br/>
        <div className="row">
          <div className="col-sm-12 text-center">
            <h2><b>{data ? data.name : ""}</b></h2>
          </div>
        </div>
        <br/><br/>
        <div className="row" id="termset-page-action-bar">
          <div className="col-sm-2 mt-1">
            <button className="btn btn-sm btn-secondary mr-2" onClick={downloadJsonOnClick}>
              <i className="bi bi-download ml-1"></i>
              JSON
            </button>
            <button className="btn btn-sm btn-secondary" onClick={downloadCsvOnClick}>
              <i className="bi bi-download ml-1"></i>
              CSV
            </button>
          </div>
          <div className="col-sm-3 mt-1">
            <label for="search-input-for-termset" className={"inline-label"}>
              Search
              <i className="bi bi-question-circle-fill mr-1 ml-1"
                 title="Search the table based on term label"></i>
            </label>
            <input
              className={"form-control search-input-termset"}
              type={"text"}
              id={"search-input-for-termset"}
              onChange={searchInputChangeHandler}
              placeholder="type a label ..."
            />
          </div>
          <div className="col-sm-2">
            <DropDown
              options={PAGE_SIZES_FOR_DROPDOWN}
              dropDownId="list-result-per-page"
              containerClass="result-per-page-dropdown-container"
              dropDownTitle="size"
              dropDownValue={size}
              dropDownChangeHandler={(e) => {
                setSize(e.target.value)
              }}
            />
          </div>
          <div className="col-sm-2 text-right mt-1">
            <Pagination
              clickHandler={setPage}
              count={Math.ceil(totalTermsCount / size)}
              initialPageNumber={page + 1}
            />
          </div>
          <div className="col-sm-3 text-end mt-2">
            <AddTermModalBtn modalId={"add-term-modal"}></AddTermModalBtn>
            <AddTermModal modalId={"add-term-modal"}></AddTermModal>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 pl-4">
            <b>
              {
                (totalTermsCount !== 0 ? page * size + 1 : 0)
                + " - "
                + ((page + 1) * size < totalTermsCount ? (page + 1) * size : totalTermsCount)
                + " of "
                + totalTermsCount
                + " terms"
              }
            </b>
          </div>
        </div>
        <div className="row class-list-tablle-holder">
          <TermTable
            columns={tableColumns}
            terms={rowDataForTable}
            tableIsLoading={loading}
            setTableIsLoading={() => {
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default TermSetPage;
