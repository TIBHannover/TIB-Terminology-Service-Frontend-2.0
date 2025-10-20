import { useState, useEffect, useContext } from "react";
import { getTermset } from "../../api/term_set";
import { useQuery } from "@tanstack/react-query";
import TermTable from "../common/TermTable/TermTable";
import TermLib from "../../Libs/TermLib";
import { Link } from 'react-router-dom';
import DropDown from "../common/DropDown/DropDown";
import Pagination from "../common/Pagination/Pagination";
import { AddTermModal } from "./AddTermModal";
import Toolkit from "../../Libs/Toolkit";
import { removeTermFromSet } from "../../api/term_set";
import { AppContext } from "../../context/AppContext";
import { NotFoundErrorPage, GeneralErrorPage } from "../common/ErrorPages/ErrorPages";
import TsTerm from "../../concepts/term";


const PAGE_SIZES_FOR_DROPDOWN = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "30", value: 30 },
  { label: "40", value: 40 },
  { label: "50", value: 50 }
];
const DEFAUTL_ROWS_COUNT = 10;


const TermSetPage = (props) => {
  const termsetId = props.match.params.termsetId;

  const appContext = useContext(AppContext);

  const [dataLoaded, setDataLoaded] = useState(false);
  const [rowDataForTable, setRowDataForTable] = useState([]);
  const [tableColumns, _] = useState(
    [
      { id: "action", text: "", defaultVisible: true },
      { id: "shortForm", text: "ID", defaultVisible: true },
      { id: "label", text: "Label", defaultVisible: true },
      { id: "decs", text: "Description", defaultVisible: true },
      { id: "altTerm", text: "Alternative Term", defaultVisible: false },
      { id: "subclass", text: "SubClass Of", defaultVisible: false },
      { id: "eqto", text: "Equivalent to", defaultVisible: false },
      { id: "example", text: "Example of usage", defaultVisible: false },
      { id: "seealso", text: "See Also", defaultVisible: false },
      { id: "contrib", text: "Contributor", defaultVisible: false },
      { id: "comment", text: "Comment", defaultVisible: false },
    ]);
  const [size, setSize] = useState(DEFAUTL_ROWS_COUNT);
  const [page, setPage] = useState(0);
  const [totalTermsCount, setTotalTermsCount] = useState(0);

  const { data, loading, error } = useQuery({
    queryKey: ["termset", termsetId],
    queryFn: () => getTermset(termsetId),
    retry: 1
  });

  function createTermListForTable(listOfterms) {
    let baseUrl = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/';
    let dataForTable = [];
    listOfterms = listOfterms.slice(page * size, page * size + size);
    for (let termWrapper of listOfterms) {
      let term = new TsTerm(termWrapper.json);
      let DeleteBtn =
        <i
          className="bi bi-file-minus-fill"
          title="remove from this termset"
          data-tsetid={data.id}
          data-termid={term.iri}
          onClick={removeTerm}
        />
      if (!appContext.userTermsets.find((tset) => tset.id === data.id) || !appContext.user) {
        DeleteBtn = "";
      }

      let termTreeUrl = baseUrl + encodeURIComponent(term.ontologyId) + '/terms?iri=' + encodeURIComponent(term.iri);
      let annotation = term.annotation;
      let termMap = new Map();
      termMap.set("shortForm", { value: term.shortForm, valueLink: "" });
      termMap.set("label", { value: term.label, valueLink: termTreeUrl });
      termMap.set("decs", { value: term.definition ?? annotation?.definition, valueLink: "" });
      termMap.set("altTerm", {
        value: annotation['alternative label'] ? annotation['alternative label'] : "N/A",
        valueLink: ""
      });
      termMap.set("subclass", { value: term.subClassOf, valueLink: "", valueIsHtml: true });
      termMap.set("eqto", { value: term.eqAxiom, valueLink: "", valueIsHtml: true });
      termMap.set("example", {
        value: annotation['example of usage'] ? annotation['example of usage'] : "N/A",
        valueLink: ""
      });
      termMap.set("seealso", { value: annotation['seeAlso'] ? annotation['seeAlso'] : "N/A", valueLink: "" });
      termMap.set("contrib", { value: term.contributors, valueLink: "" });
      termMap.set("comment", { value: annotation['comment'] ? annotation['comment'] : "N/A", valueLink: "" });
      termMap.set("action", { value: DeleteBtn, valueLink: "" });

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
    let headers = [];
    for (let col of tableColumns) {
      if (col.id !== "action") {
        headers.push(col.text);
      }
    }
    rows.push(headers);
    for (let termWrapper of data.terms) {
      let term = new TsTerm(termWrapper.json);
      let annotation = term.annotation;
      let row = [];
      row.push(escapeForCSV(term["shortForm"]));
      row.push(escapeForCSV(term.label));
      row.push(escapeForCSV(TermLib.definition ?? annotation?.definition));
      row.push(escapeForCSV(annotation['alternative label'] ? annotation['alternative label'] : "N/A"));
      row.push(escapeForCSV(term.subClassOf ? term.subClassOf : "N/A"));
      row.push(escapeForCSV(term.eqAxiom ?? "N/A"));
      row.push(escapeForCSV(annotation['example of usage'] ? annotation['example of usage'] : "N/A"));
      row.push(escapeForCSV(annotation['seeAlso'] ? annotation['seeAlso'] : "N/A"));
      row.push(escapeForCSV(term.contributors));
      row.push(escapeForCSV(annotation['comment'] ? annotation['comment'] : "N/A"));
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

  function removeTerm(e) {
    try {
      let termsetId = e.currentTarget.dataset.tsetid;
      let termId = e.currentTarget.dataset.termid;
      if (!termsetId || !termId) {
        return;
      }
      removeTermFromSet(termsetId, termId).then((removed) => {
        if (removed) {
          setDataLoaded(false)
          let i = data.terms.findIndex((term) => term.iri === termId);
          let usertermsets = [...appContext.userTermsets];
          let termsetInContextIndex = usertermsets.findIndex((tset) => tset.id === termsetId);
          if (termsetInContextIndex > 0) {
            let tindexInSet = usertermsets[termsetInContextIndex].terms.findIndex((term) => term.iri === termId);
            if (tindexInSet) {
              usertermsets[termsetInContextIndex].terms.splice(tindexInSet, 1);
              appContext.setUserTermsets(usertermsets);
            }
          }
          data.terms.splice(i, 1);
          createTermListForTable(data.terms);
          setTotalTermsCount(data.terms.length);
        }
      })
    } catch {
      return;
    }
  }

  function escapeForCSV(value) {
    if (value == null) return '';
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
  }, [data, page, size]);


  useEffect(() => {
    if (data) {
      createTermListForTable(data.terms);
    }
  }, [page, size]);


  if (process.env.REACT_APP_TERMSET_FEATURE !== "true") {
    return "";
  }

  if (!data && !error) {
    return (
      <div className="justify-content-center ontology-page-container">
        <div className="isLoading"></div>
      </div>
    );
  } else if (!data && error && error.status !== 404) {
    return (
      <div className="justify-content-center ontology-page-container">
        <GeneralErrorPage />
      </div>
    );
  } else if (!data && error && error.status === 404) {
    return (
      <div className="justify-content-center ontology-page-container">
        <NotFoundErrorPage />
      </div>
    );
  }

  return (
    <div className="justify-content-center ontology-page-container">
      <div className="tree-view-container list-container">
        <div className="row">
          <div className="col-6">
            <Link className="btn-secondary p-1 text-white"
              to={process.env.REACT_APP_PROJECT_SUB_PATH + "/mytermsets"}>
              <i className="bi bi-arrow-left mr-1"></i>
              My termset list
            </Link>
          </div>
          {appContext.userTermsets.find((tset) => tset.id === data.id) &&
            <div className="col-sm-6 float-right">
              <div className="visibility-tag">visibility: {data ? data.visibility : ""}</div>
            </div>
          }
        </div>
        <br />
        <div className="row">
          <div className="col-sm-12 text-center">
            <h2><b>{data ? data.name : ""}</b></h2>
            <small>{data ? data.description : ""}</small>
          </div>
        </div>
        <br /><br />
        <div className="row" id="termset-page-action-bar">
          <div className="col-sm-2 mt-1">
            <button className="btn-secondary text-white me-2" onClick={downloadJsonOnClick}>
              <i className="bi bi-download ms-1"></i>
              JSON
            </button>
            <button className="btn-secondary text-white" onClick={downloadCsvOnClick}>
              <i className="bi bi-download ms-1"></i>
              CSV
            </button>
          </div>
          <div className="col-sm-3 mt-1">
            <label htmlFor="search-input-for-termset" className={"inline-label"}>
              Search
              <i className="bi bi-question-circle-fill me-1 ms-1"
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
              clickHandler={(newPage) => {
                setPage(parseInt(newPage) - 1)
              }}
              count={Math.ceil(totalTermsCount / size)}
              initialPageNumber={page + 1}
            />
          </div>
          {appContext.user && appContext.userTermsets.find((tset) => tset.id === data.id) &&
            // only owner can see this button
            <div className="col-sm-3 text-end mt-2">
              <AddTermModal termset={data} modalId={"add-term-modal"}></AddTermModal>
            </div>
          }
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
