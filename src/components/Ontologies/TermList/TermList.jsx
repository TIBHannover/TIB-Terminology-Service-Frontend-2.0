import {useEffect, useState} from "react";
import { useHistory } from "react-router";
import {getObsoleteTermsForTermList} from '../../../api/fetchData';
import TermApi from "../../../api/term";
import Toolkit from "../../../Libs/Toolkit";
import { RenderTermList } from "./RenderTermList";



const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE_NUMBER = 1;


const TermList = (props) => {    
    let url = new URL(window.location);
    let pageNumberInUrl = url.searchParams.get('page');
    let sizeInUrl = url.searchParams.get('size');
    let iriInUrl = url.searchParams.get('iri');                
    pageNumberInUrl = !pageNumberInUrl ? DEFAULT_PAGE_NUMBER : parseInt(pageNumberInUrl);
    let internalSize =  Toolkit.getVarInLocalSrorageIfExist('termListPageSize', DEFAULT_PAGE_SIZE);
    sizeInUrl = !sizeInUrl ? internalSize : parseInt(sizeInUrl);        

    const [pageNumber, setPageNumber] = useState(pageNumberInUrl - 1);
    const [pageSize, setPageSize] = useState(sizeInUrl);
    const [listOfTerms, setListOfTerms] = useState([]);
    const [totalNumberOfTerms, setTotalNumberOfTerms] = useState(0);    
    const [mode, setMode] = useState("terms");
    const [iri, setIri] = useState(iriInUrl);    
    const [tableIsLoading, setTableIsLoading] = useState(true);   
    const [obsoletes, setObsoletes] = useState(Toolkit.getObsoleteFlagValue()); 
    const history = useHistory();


    async function loadComponent(){                        
        let ontologyId = props.ontology;
        let listOfTermsAndStats = {"results": [], "totalTermsCount":0 };         
        let termApi = new TermApi(ontologyId, iri, mode);
        if(!iri && !obsoletes){            
            listOfTermsAndStats = await termApi.fetchListOfTerms(pageNumber, pageSize);                       
        }
        else if (!iri && obsoletes){
            listOfTermsAndStats = await getObsoleteTermsForTermList(ontologyId, mode, pageNumber, pageSize);            
        }
        else{            
            await termApi.fetchTerm();
            listOfTermsAndStats["results"] = [termApi.term];
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


    function updateURL(){        
        let currentUrlParams = new URLSearchParams();
        if(iri){
            currentUrlParams.append('iri', iri);
        }
        else{
            currentUrlParams.append('page', pageNumber + 1);
            currentUrlParams.append('size', pageSize);
            currentUrlParams.append('obsoletes', obsoletes);
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
    }


    function handlePageSizeDropDownChange(e){
        let size = parseInt(e.target.value);        
        setPageSize(size);           
        storePageSizeInLocalStorage(size);        
    }



    function resetList(){
        let size = Toolkit.getVarInLocalSrorageIfExist('termListPageSize', DEFAULT_PAGE_SIZE);
        setIri(null);
        setPageNumber(0);
        setPageSize(size);            
        storePageSizeInLocalStorage(pageSize);        
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


    function handleJumtoSelection(selectedTerm){        
        if(selectedTerm){            
            setIri(selectedTerm['iri']);
        }      
    }


    function obsoletesCheckboxHandler(e){ 
        let newUrl = Toolkit.setObsoleteAndReturnNewUrl(e.target.checked);
        history.push(newUrl);
        setObsoletes(e.target.checked);
        setPageNumber(0);
    }


    useEffect(() => {               
        hideHiddenColumnsOnLoad();
        loadComponent();
        if(obsoletes){
            document.getElementById("obsolte_check_term_list").checked = true;
        }        
    }, []);


    useEffect(() => {
        setTableIsLoading(true);
        setListOfTerms([]);   
        loadComponent();
        hideHiddenColumnsOnLoad();
        if(obsoletes && document.getElementById("obsolte_check_term_list")){
            document.getElementById("obsolte_check_term_list").checked = true;
        }  
        updateURL();               
    }, [pageNumber, pageSize, iri, obsoletes]);


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
            handleJumtoSelection={handleJumtoSelection}
            obsoletesCheckboxHandler={obsoletesCheckboxHandler}
            isObsolete={obsoletes}
        />
    );

}


export default TermList;