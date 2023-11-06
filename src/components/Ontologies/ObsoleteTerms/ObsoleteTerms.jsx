import {useEffect, useState} from "react";
import { useHistory } from 'react-router-dom';
import PaneResize from "../../common/PaneResize/PaneResize";
import DropDown from "../../common/DropDown/DropDown";
import { getObsoleteTerms, getNodeByIri } from "../../../api/fetchData";
import NodePage from "../NodePage/NodePage";
import Toolkit from "../../common/Toolkit";
import Pagination from "../../common/Pagination/Pagination";
import AlertBox from "../../common/Alerts/Alerts";


const CLASS_TYPE = 0
const PROPERTY_TYPE = 1
const TERMS_TYPES_FOR_DROPDOWN = [    
    {label: "Class", value:CLASS_TYPE},
    {label: "Property", value:PROPERTY_TYPE}
];




const ObsoleteTerms = (props) => {
    let paneResize = new PaneResize();
    const [selectedIri, setSelectedIri] = useState("");
    const [selectedComponentId, setSelectedComponentId] = useState("terms"); 
    const [extractKey, setExtractKey] = useState("terms");
    const [typeForNote, setTypeForNote] = useState("class");
    const [termIsSelected, setTermIsSelected] = useState(false);   

    useEffect(() => {
        paneResize.setOriginalWidthForLeftPanes();
        document.body.addEventListener("mousedown", paneResize.onMouseDown);
        document.body.addEventListener("mousemove", paneResize.moveToResize);
        document.body.addEventListener("mouseup", paneResize.releaseMouseFromResize);
        
        return () => {
            document.body.addEventListener("mousedown", paneResize.onMouseDown);
            document.body.addEventListener("mousemove", paneResize.moveToResize);
            document.body.addEventListener("mouseup", paneResize.releaseMouseFromResize);
        }
    });


    const termTypeChangeHandler = (newComponentId) => {
        setSelectedComponentId(newComponentId);
        if (newComponentId === "terms"){
            setExtractKey("terms");
            setTypeForNote("class");
        }
        else{
            setExtractKey("properties");
            setTypeForNote("property");
        }
    }


    const iriChangeHandler = (newIri) => {        
        if(newIri){
            setSelectedIri(newIri);
            setTermIsSelected(true);
        }
        else{
            setSelectedIri("");
            setTermIsSelected(false);
        }        
    }
    

    return(
        <div className="tree-view-container resizable-container">
            <div className="tree-page-left-part" id="page-left-pane">
                <ObsoleteTermsList  
                    ontologyId={props.ontology.ontologyId}  
                    termTypeChangeHandler={termTypeChangeHandler}
                    iriChangeHandler={iriChangeHandler} 
                    iriStoringFunction={props.iriChangerFunction}
                />
            </div>
            {paneResize.generateVerticalResizeLine()} 
            {termIsSelected  && 
                <div className="node-table-container" id="page-right-pane">
                    <NodePage
                        iri={selectedIri}
                        ontology={props.ontology}
                        componentIdentity={selectedComponentId}
                        extractKey={extractKey}
                        isSkos={false}
                        isIndividual={false}
                        typeForNote={typeForNote}
                    />   
                </div>
            }
        </div>
    );


}


const ObsoleteTermsList = (props) => {
    const [selectedType, setSelectedType] = useState(0);
    const [termsList, setTermsList] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(50);
    const [totalCountOfPages, setTotalCountOfPages] = useState(0);
    const [iriIsGivenInUrl, setIriIsGivenInUrl] = useState(false);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    async function fetchTerms(){
        try{
            let searchParams = new URLSearchParams(window.location.search); 
            let pageNumber = searchParams.get('page') ? parseInt(searchParams.get('page')) - 1 : page;            
            if (pageNumber !== page){
                setPage(pageNumber);
            }
            let type = searchParams.get('type') ? searchParams.get('type') : "class";            
            if(type === "class" && selectedType !== 0){
                setSelectedType(0);
                props.termTypeChangeHandler("terms");                
            }
            else if (type === "property" && selectedType !== 1){
                setSelectedType(1);
                props.termTypeChangeHandler("props");
            }
            let iri = searchParams.get('iri') ? searchParams.get('iri') : false;            
            let getNodeKeyMode = (type === "class") ? "terms" : "properties";                     
            if(iri){                
                let selectedTerm = await getNodeByIri(props.ontologyId, encodeURIComponent(iri), getNodeKeyMode);
                let list = {getNodeKeyMode: []};
                list[getNodeKeyMode] = [selectedTerm];                                        
                setTermsList(list);                         
                setTotalCountOfPages(1); 
                document.getElementsByClassName("tree-text-container")[0].classList.add('clicked');
                props.iriChangeHandler(iri);    
                setIriIsGivenInUrl(true);
                return true;
            }
            let list = await getObsoleteTerms(props.ontologyId, selectedType, pageNumber, pageSize);            
            setTermsList(list['_embedded']);
            setTotalCountOfPages(parseInt(list['page']['totalPages']))
            setLoading(false);
        }
        catch (error){            
            setTermsList([]);
            setTotalCountOfPages(0);
            setLoading(false);
        }
    }

    function selectTerm(e){        
        if (e.target.tagName !== "SPAN"){
            return true;
        }
        let selectedElement = document.querySelectorAll(".clicked");
        for(let i=0; i < selectedElement.length; i++){
            selectedElement[i].classList.remove("clicked");
        }
        let target = e.target;
        if(!target.classList.contains("clicked")  && target.tagName === "SPAN"){            
            target.classList.add("clicked");
            props.iriChangeHandler(target.dataset.iri);            
            let newUrl = Toolkit.setParamInUrl('iri', target.dataset.iri)            
            history.push(newUrl);    
            props.iriStoringFunction(target.dataset.iri);    
        }
        else{
            target.classList.remove("clicked");            
        }    

    }
    

    const handleTermTypeChange = (e) => {
        setLoading(true);
        let newTypeId = e.target.value;
        let newTypeString = "terms";
        let typeInUrl = "class";
        setSelectedType(newTypeId);
        if(parseInt(newTypeId) === 1){
            newTypeString = "props";
            typeInUrl = "property";
        }        
        setPage(0);
        let searchParams = new URLSearchParams(window.location.search);  
        searchParams.delete('iri');
        searchParams.set('page', 1);
        searchParams.set('type', typeInUrl);
        let newUrl = window.location.pathname + "?" +  searchParams.toString(); 
        history.push(newUrl);
        props.termTypeChangeHandler(newTypeString);
        props.iriChangeHandler(false); 
    }


    const handlePagination = (newPage) => {
        setLoading(true);
        setPage(parseInt(newPage) - 1);
        let searchParams = new URLSearchParams(window.location.search);  
        searchParams.delete('iri');
        searchParams.set('page', newPage);
        let newUrl = window.location.pathname + "?" +  searchParams.toString();         
        props.iriChangeHandler(false);   
        history.push(newUrl);  
        let selectedElement = document.querySelectorAll(".clicked");
        for(let i=0; i < selectedElement.length; i++){
            selectedElement[i].classList.remove("clicked");
        }            
    }


    const backToListButtonClick = () => {
        setLoading(true);
        let searchParams = new URLSearchParams(window.location.search); 
        searchParams.delete('iri');
        let newUrl = window.location.pathname + "?" +  searchParams.toString(); 
        history.push(newUrl); 
        setIriIsGivenInUrl(false);                  
    }


    useEffect(() => {
        fetchTerms();
        
    }, [selectedType, page, iriIsGivenInUrl]);


    return (
        <div className="row">
            <div className="col-sm-12">
                <div className="row">
                    <div className="col-sm-6">
                        <DropDown 
                            options={TERMS_TYPES_FOR_DROPDOWN}
                            dropDownId="obsolete-terms-types-dropdown"
                            dropDownTitle="Term Type"
                            dropDownValue={selectedType}
                            dropDownChangeHandler={handleTermTypeChange}
                        /> 
                    </div>
                    {!iriIsGivenInUrl && 
                        <div className="col-sm-5">                        
                                <Pagination 
                                    clickHandler={handlePagination} 
                                    count={totalCountOfPages}
                                    initialPageNumber={page + 1}
                                />                        
                        </div>
                    }
                    {iriIsGivenInUrl && 
                        <div className="col-sm-5">   
                            <button className="btn btn-secondary btn-sm" onClick={backToListButtonClick}>Show Term List</button>                  
                        </div>
                    }                    
                </div>
                <br></br>
                <div className="row">
                    <div className="col-sm-12" onClick={(e) =>  selectTerm(e)}>
                        {loading && <div className="is-loading-term-list isLoading"></div>}
                        {!loading && 
                            <ul>
                                {createTermList(termsList, selectedType)}
                            </ul>
                        }                        
                    </div>
                </div>
            </div>
        </div>        
        
    );
}


function createTermList(termsList, componentType){
    let result = [];
    if(!termsList || termsList.length === 0){
        let typeText = componentType === 0 ? "Class" : "Property";
        return [
            <AlertBox 
                type="info"
                message={`there is no obsolete ${typeText} found for this ontology!`}
                alertColumnClass="col-sm-12"              
            />  
        ];
    }    
    termsList = termsList['terms'] ? termsList['terms'] : termsList['properties'];  
    for (let term of termsList){
        result.push(
            <li className="list-node-li">
                <span className="tree-text-container" data-iri={term["iri"]} id={term["iri"]}>
                    {term["label"] !== "" ? term["label"] : "N/A"}
                </span>
            </li>
        );
    }     
    return result;
}




export default ObsoleteTerms;