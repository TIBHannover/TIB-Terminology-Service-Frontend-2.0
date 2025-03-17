import { useEffect, useState, useContext } from "react";
import { getObsoleteTermsForTermList } from "../../../api/obsolete";
import TermApi from "../../../api/term";
import Toolkit from "../../../Libs/Toolkit";
import { RenderTermList } from "./RenderTermList";
import { OntologyPageContext } from "../../../context/OntologyPageContext";
import TermListUrlFactory from "../../../UrlFactory/TermListUrlFactory";
import PropTypes from 'prop-types';
import '../../layout/termList.css';
import { getTourProfile } from "../../../tours/controller";



const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE_NUMBER = 1;


const TermList = (props) => {
  /* 
      This component is responsible for rendering the list of terms in the ontology.
      It requires the ontologyPageContext to be available.
  */

  const ontologyPageContext = useContext(OntologyPageContext);
  const termListUrlFactory = new TermListUrlFactory();

  let iriInUrl = termListUrlFactory.iri;
  let pageNumberInUrl = !termListUrlFactory.page ? DEFAULT_PAGE_NUMBER : parseInt(termListUrlFactory.page);
  let internalSize = Toolkit.getVarInLocalSrorageIfExist('termListPageSize', DEFAULT_PAGE_SIZE);
  let sizeInUrl = !termListUrlFactory.size ? internalSize : parseInt(termListUrlFactory.size);

  const [pageNumber, setPageNumber] = useState(pageNumberInUrl - 1);
  const [pageSize, setPageSize] = useState(sizeInUrl);
  const [listOfTerms, setListOfTerms] = useState(['loading']);
  const [totalNumberOfTerms, setTotalNumberOfTerms] = useState(0);
  const [mode, setMode] = useState("terms");
  const [iri, setIri] = useState(iriInUrl);
  const [tableIsLoading, setTableIsLoading] = useState(true);
  const [obsoletes, setObsoletes] = useState(Toolkit.getObsoleteFlagValue());



  async function loadComponent() {
    let ontologyId = ontologyPageContext.ontology.ontologyId;
    let listOfTermsAndStats = { "results": [], "totalTermsCount": 0 };
    let termApi = new TermApi(ontologyId, iri, mode);
    if (!iri && !obsoletes) {
      listOfTermsAndStats = await termApi.fetchListOfTerms(pageNumber, pageSize);
    }
    else if (!iri && obsoletes) {
      listOfTermsAndStats = await getObsoleteTermsForTermList(ontologyId, mode, pageNumber, pageSize);
    }
    else {
      await termApi.fetchTerm();
      listOfTermsAndStats["results"] = [termApi.term];
      listOfTermsAndStats["totalTermsCount"] = 1;
    }

    let termList = [];
    for (let term of listOfTermsAndStats['results']) {
      let termApi = new TermApi(term['ontology_name'], encodeURIComponent(term['iri']), "terms");
      await termApi.fetchTermJson();
      term['subclassOfText'] = termApi.getSubClassOf();
      term['equivalentToText'] = termApi.getEqAxiom();
      termList.push(term);
    }

    setListOfTerms(termList);
    setTotalNumberOfTerms(listOfTermsAndStats['totalTermsCount']);
    storePageSizeInLocalStorage(pageSize);
  }



  function storePageSizeInLocalStorage(size) {
    if (parseInt(size) !== 1) {
      localStorage.setItem('termListPageSize', size);
    }
  }



  function pageCount() {
    if (isNaN(Math.ceil(totalNumberOfTerms / pageSize))) {
      return 0;
    }
    return (Math.ceil(totalNumberOfTerms / pageSize))
  }



  function handlePagination(value) {
    setPageNumber(parseInt(value) - 1);
  }


  function handlePageSizeDropDownChange(e) {
    let size = parseInt(e.target.value);
    setPageSize(size);
    storePageSizeInLocalStorage(size);
  }



  function resetList() {
    let size = Toolkit.getVarInLocalSrorageIfExist('termListPageSize', DEFAULT_PAGE_SIZE);
    setIri(null);
    setPageNumber(0);
    setPageSize(size);
    storePageSizeInLocalStorage(pageSize);
  }


  function hideHiddenColumnsOnLoad() {
    let tableHeaders = document.getElementsByTagName('th');
    for (let th of tableHeaders) {
      if (th.style.display === "none") {
        let targetCells = document.getElementsByClassName(th.className);
        for (let cell of targetCells) {
          cell.style.display = "none";
        }
      }
    }
  }


  function handleJumtoSelection(selectedTerm) {
    if (selectedTerm) {
      setIri(selectedTerm['iri']);
    }
  }


  function obsoletesCheckboxHandler(e) {
    Toolkit.setObsoleteInStorageAndUrl(e.target.checked);
    setObsoletes(e.target.checked);
    setPageNumber(0);
  }


  useEffect(() => {
    hideHiddenColumnsOnLoad();
    loadComponent();
    if (obsoletes) {
      document.getElementById("obsolte_check_term_list").checked = true;
    }
    let tourP = getTourProfile();
    if (!tourP.ontoClassListPage && process.env.REACT_APP_SITE_TOUR === "true") {
      document.getElementById('tour-trigger-btn').click();
    }
  }, []);



  useEffect(() => {
    setTableIsLoading(true);
    setListOfTerms(['loading']);
    loadComponent();
    hideHiddenColumnsOnLoad();
    if (obsoletes && document.getElementById("obsolte_check_term_list")) {
      document.getElementById("obsolte_check_term_list").checked = true;
    }
    termListUrlFactory.update({ iri: iri, page: pageNumber + 1, size: pageSize, obsoletes: obsoletes });
  }, [pageNumber, pageSize, iri, obsoletes]);


  return (
    <RenderTermList
      componentIdentity={props.componentIdentity}
      iri={iri}
      pageSize={pageSize}
      handlePageSizeDropDownChange={handlePageSizeDropDownChange}
      resetList={resetList}
      pageNumber={pageNumber}
      totalNumberOfTerms={totalNumberOfTerms}
      handlePagination={handlePagination}
      pageCount={pageCount}
      tableIsLoading={tableIsLoading}
      listOfTerms={listOfTerms}
      setTableIsLoading={setTableIsLoading}
      handleJumtoSelection={handleJumtoSelection}
      obsoletesCheckboxHandler={obsoletesCheckboxHandler}
      isObsolete={obsoletes}
    />
  );

}

TermList.propTypes = {
  componentIdentity: PropTypes.string.isRequired
}


export default TermList;