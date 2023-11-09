import {useEffect, useState} from "react";
import { useHistory } from "react-router";
import {getListOfTerms, getNodeByIri} from '../../../api/fetchData';
import Toolkit from "../../common/Toolkit";
import { RenderTermList } from "./RenderTermList";



const DEFAULT_PAGE_SIZE = 20;


const TermList = (props) => {    
    let url = new URL(window.location);
    let pageNumberInUrl = url.searchParams.get('page');
    let sizeInUrl = url.searchParams.get('size');
    let iriInUrl = url.searchParams.get('iri');        
    pageNumberInUrl = !pageNumberInUrl ? 1 : parseInt(pageNumberInUrl);
    let internalSize =  Toolkit.getVarInLocalSrorageIfExist('termListPageSize', DEFAULT_PAGE_SIZE);
    sizeInUrl = !sizeInUrl ? internalSize : parseInt(sizeInUrl);

    const [pageNumber, setPageNumber] = useState(pageNumberInUrl - 1);
    const [pageSize, setPageSize] = useState(sizeInUrl);
    const [listOfTerms, setListOfTerms] = useState([]);
    const [totalNumberOfTerms, setTotalNumberOfTerms] = useState(0);    
    const [mode, setMode] = useState("terms");
    const [iri, setIri] = useState(iriInUrl);    
    const [tableIsLoading, setTableIsLoading] = useState(true);    
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
        updateURL(value, pageSize);
    }


    function handlePageSizeDropDownChange(e){
        let size = parseInt(e.target.value);
        let page = pageNumber + 1;
        setPageNumber(page);
        setPageSize(size);           
        storePageSizeInLocalStorage(size);
        updateURL(page, size);
    }



    function resetList(){
        let size = Toolkit.getVarInLocalSrorageIfExist('termListPageSize', DEFAULT_PAGE_SIZE);
        setIri(null);
        setPageNumber(0);
        setPageSize(size);            
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
        setTableIsLoading(true);
        setListOfTerms([]);   
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


export default TermList;