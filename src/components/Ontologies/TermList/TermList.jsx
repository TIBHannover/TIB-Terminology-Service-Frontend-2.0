import {useEffect, useState} from "react";
import { useHistory } from "react-router";
import {getListOfTerms, getNodeByIri, getSubClassOf, getEqAxiom} from '../../../api/fetchData';
import Pagination from "../../common/Pagination/Pagination";
import JumpTo from "../JumpTo/Jumpto";
import {createClassListTableHeader, setContributorField, createShowColumnsTags} from './hekpers';


const DEFAULT_PAGE_SIZE = 20;


const TermList = (props) => {    
    let url = new URL(window.location);
    let pageNumberInUrl = url.searchParams.get('page');
    let sizeInUrl = url.searchParams.get('size');
    let iriInUrl = url.searchParams.get('iri');        
    pageNumberInUrl = !pageNumberInUrl ? 1 : parseInt(pageNumberInUrl);
    let internalSize = localStorage.getItem('termListPageSize') ? localStorage.getItem('termListPageSize') : DEFAULT_PAGE_SIZE;
    sizeInUrl = !sizeInUrl ? internalSize : parseInt(sizeInUrl);

    const [pageNumber, setPageNumber] = useState(pageNumberInUrl - 1);
    const [pageSize, setPageSize] = useState(sizeInUrl);
    const [listOfTerms, setListOfTerms] = useState([]);
    const [totalNumberOfTerms, setTotalNumberOfTerms] = useState(0);
    const [lastLoadedUrl, setLastLoadedUrl] = useState("");
    const [mode, setMode] = useState("terms");
    const [iri, setIri] = useState(iriInUrl);
    const [tableBodyContent, setTableBodyContent] = useState("");
    const [tableIsLoading, setTableIsLoading] = useState(true);
    const [urlProfile, setUrlProfile] = useState({iri:null, pageNumber: 0, pageSize: localStorage.getItem('termListPageSize') ? localStorage.getItem('termListPageSize') : 20});
    const history = useHistory();


    async function loadComponent(){                        
        let ontologyId = props.ontology;
        let listOfTermsAndStats = {"results": [], "totalTermsCount":0 };        
        if(!iri){
            listOfTermsAndStats = await getListOfTerms(ontologyId, pageNumber, pageSize);            
        }
        else{
            listOfTermsAndStats["results"] = [await getNodeByIri(ontologyId, encodeURIComponent(iri), mode)];
            listOfTermsAndStats["totalTermsCount"] = 1;            
        }
        
        setListOfTerms(listOfTermsAndStats['results']);
        setTotalNumberOfTerms(listOfTermsAndStats['totalTermsCount']);        
        setLastLoadedUrl(window.location.href);             
        storePageSizeInLocalStorage(pageSize);        
    }


    function storePageSizeInLocalStorage(size){
        if(parseInt(size) !== 1){
            localStorage.setItem('termListPageSize', size);
        }
    }


    function updateURL(pageNumber, pageSize, iri=null){        
        let currentUrlParams = new URLSearchParams();
        if(iri){
            currentUrlParams.append('iri', iri);
        }
        else{
            currentUrlParams.append('page', pageNumber);
            currentUrlParams.append('size', pageSize);
            currentUrlParams.delete('iri');
        }        
        history.push(window.location.pathname + "?" + currentUrlParams.toString())
    }


    function pageCount () {    
        if (isNaN(Math.ceil(totalNumberOfTerms / pageSize))){
            return 0;
        }
        return (Math.ceil(totalNumberOfTerms / pageSize))
    }



    function handlePagination (value) {
        setPageNumber(parseInt(value) - 1);
        setTableIsLoading(true);
        setListOfTerms([]);        
        updateURL(value, pageSize);
    }


    function handlePageSizeDropDownChange(e){
        let size = parseInt(e.target.value);
        let page = pageNumber + 1;
        setPageNumber(page);
        setPageSize(size);
        setTableIsLoading(true);
        setListOfTerms([]);        
        storePageSizeInLocalStorage(size);
        updateURL(page, size);
    }



    function resetList(){
        let size = localStorage.getItem('termListPageSize') ? localStorage.getItem('termListPageSize') : DEFAULT_PAGE_SIZE;
        setIri(null);
        setPageNumber(0);
        setPageSize(size);
        setTableIsLoading(true);
        setListOfTerms([]);        
        storePageSizeInLocalStorage(pageSize);
        updateURL(1, size, null);
    }


    function hideHiddenColumnsOnLoad(){
        let tableHeaders = document.getElementsByTagName('th');
        for(let th of tableHeaders){
            if(th.style.display === "none"){                
                let targetCells = document.getElementsByClassName(th.className);                
                for(let cell of targetCells){
                    cell.style.display = "none";
                }
            }
        }
    }


    useEffect(() => {               
        hideHiddenColumnsOnLoad();        
    }, []);


    useEffect(() => {
        loadComponent();
        hideHiddenColumnsOnLoad();               
    }, [pageNumber, pageSize, iri]);


    return (
        <RenderTermList 
            ontologyId={props.ontology}
            isSkos={props.isSkos}
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
        />
    );

}



const RenderTermList = (props) => {
    const [tableBodyContent, setTableBodyContent] = useState("");


    async function createList(){
        let result = [];
        let listOfterms = props.listOfTerms;
        let baseUrl = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/';
        for (let term of listOfterms){
            let termTreeUrl = baseUrl + encodeURIComponent(term['ontology_name']) + '/terms?iri=' + encodeURIComponent(term['iri']);
            let subclassOfText = await getSubClassOf(term['iri'], term['ontology_name']);
            let equivalentToText = await getEqAxiom(term['iri'], term['ontology_name']);
            result.push(
                <tr>
                    <td className="label-col">
                        <a className="table-list-label-anchor"  href={termTreeUrl} target="_blank">
                            {term['label']}
                        </a>                        
                    </td>
                    <td className="id-col">{term['short_form']}</td>
                    <td className="des-col">{term['description'] ? term['description'] : ""}</td>
                    <td className="alt-term-col">{term['annotation']['alternative term'] ? term['annotation']['alternative term'] : "N/A" }</td>
                    <td className="sub-class-col"><span  dangerouslySetInnerHTML={{ __html: subclassOfText }} /></td>
                    <td className="eqv-col"><span  dangerouslySetInnerHTML={{ __html: equivalentToText }} /></td>
                    <td className="ex-usage-col">{term['annotation']['example of usage'] ? term['annotation']['example of usage'] : "N/A" }</td>
                    <td className="see-also-col">{term['annotation']['seeAlso'] ? term['annotation']['seeAlso'] : "N/A" }</td>
                    <td className="contrib-col">{setContributorField(term)}</td>
                    <td className="comment-col">{term['annotation']['comment'] ? term['annotation']['comment'] : "N/A" }</td>
                </tr>
            );
        }
        
        if(result.length !== 0){
            setTableBodyContent(result);
            props.setTableIsLoading(false);
        }                
    }


    useEffect(() => {
        createList();
    }, [props.listOfTerms]);


    return(
        <div className="tree-view-container list-container">
                <div className="row">
                    <div className="col-sm-4">
                        <div className="termlist-jumpto-container">
                            <JumpTo                        
                                ontologyId={props.ontologyId}                                
                                isSkos={props.isSkos}
                                componentIdentity={props.componentIdentity}
                                containerBootstrapClass="col-sm-12"
                            />
                        </div>                    
                    </div>
                    <div className="col-sm-2">
                        {!props.iri && 
                            <div className='form-inline result-per-page-dropdown-container'>
                                <div class="form-group">
                                <label for="list-result-per-page" className='col-form-label'>Result Per Page</label>
                                <select className='site-dropdown-menu list-result-per-page-dropdown-menu' id="list-result-per-page" value={props.pageSize} onChange={props.handlePageSizeDropDownChange}>
                                    <option value={20} key="20">20</option>
                                    <option value={30} key="30">30</option>
                                    <option value={40} key="40">40</option>
                                    <option value={50} key="50">50</option>
                                </select>  
                                </div>                                                                                
                            </div>
                        }
                        {props.iri &&                            
                            <button className='btn btn-secondary btn-sm tree-action-btn' onClick={props.resetList}>Show All Classes</button> 
                        }
                    </div>
                    <div className="col-sm-3 text-right number-of-result-text-container">
                        <b>{"Showing " + (props.pageNumber * props.pageSize + 1) + " - " + ((props.pageNumber + 1) * props.pageSize) + " of " + props.totalNumberOfTerms + " Classes"}</b>
                    </div>
                    <div className="col-sm-3">
                        <Pagination 
                            clickHandler={props.handlePagination} 
                            count={props.pageCount()}
                            initialPageNumber={props.pageNumber + 1}
                        />
                    </div>
                </div>                 
                <div className="row class-list-tablle-holder">                                      
                    <table class="table table-striped term-list-table class-list-table" id="class-list-table">
                        {createShowColumnsTags()}                        
                        {createClassListTableHeader()}
                        <tbody>
                            {props.tableIsLoading && <div className="is-loading-term-list isLoading"></div>}
                            {!props.tableIsLoading && tableBodyContent}               
                        </tbody>
                    </table>
                </div>
            </div>
    );
}



export default TermList;