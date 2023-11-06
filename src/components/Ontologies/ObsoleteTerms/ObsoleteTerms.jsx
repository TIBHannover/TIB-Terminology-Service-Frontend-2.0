import {useEffect, useState} from "react";
import { useHistory } from 'react-router-dom';
import PaneResize from "../../common/PaneResize/PaneResize";
import DropDown from "../../common/DropDown/DropDown";
import { getObsoleteTerms } from "../../../api/fetchData";
import NodePage from "../NodePage/NodePage";
import Toolkit from "../../common/Toolkit";
import Pagination from "../../common/Pagination/Pagination";


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
        setSelectedIri(newIri);
        setTermIsSelected(true);
    }
    

    return(
        <div className="tree-view-container resizable-container">
            <div className="tree-page-left-part" id="page-left-pane">
                <ObsoleteTermsList  
                    ontologyId={props.ontology.ontologyId}  
                    termTypeChangeHandler={termTypeChangeHandler}
                    iriChangeHandler={iriChangeHandler} 
                    iriChangerFunction={props.iriChangerFunction}
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
    const [totalCountOfTerms, setTotalCountOfTerms] = useState(0);
    const history = useHistory();

    async function fetchTerms(){
        try{
            let termsList = await getObsoleteTerms(props.ontologyId, selectedType, page, pageSize);            
            setTermsList(termsList['_embedded']);
            setTotalCountOfTerms(parseInt(termsList['page']['totalPages']))
        }
        catch (error){
            setTermsList([]);
            setTotalCountOfTerms(0);
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
            props.iriChangerFunction(target.dataset.iri, "obsolete");    
        }
        else{
            target.classList.remove("clicked");            
        }    

    }
    

    const handleTermTypeChange = (e) => {
        let newTypeId = e.target.value;
        let newTypeString = "terms";
        setSelectedType(newTypeId);
        if(parseInt(newTypeId) === 1){
            newTypeString = "props";
        }
        console.info(newTypeString)
        props.termTypeChangeHandler(newTypeString);
    }


    const handlePagination = (newPage) => {
        setPage(parseInt(newPage) - 1);
        // this.setState({
        //   pageNumber: value - 1,
        //   tableIsLoading: true,
        //   listOfTerms: [],
        //   tableBodyContent: ""    
        // }, ()=> {
        //     this.updateURL(value, this.state.pageSize);
        // })
    }


    useEffect(() => {
        fetchTerms();
        
    }, [selectedType]);


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
                    <div className="col-sm-5">
                        <Pagination 
                            clickHandler={handlePagination} 
                            count={totalCountOfTerms}
                            initialPageNumber={page + 1}
                        />
                    </div>
                </div>
                <br></br>
                <div className="row">
                    <div className="col-sm-12" onClick={(e) =>  selectTerm(e)}>
                        <ul>
                            {createTermList(termsList)}
                        </ul>                        
                    </div>
                </div>
            </div>
        </div>        
        
    );
}


function createTermList(termsList){
    let result = [];
    if(!termsList || termsList.length === 0){
        return [];
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