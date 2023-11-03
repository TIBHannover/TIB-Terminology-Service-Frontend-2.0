import {useEffect, useState} from "react";
import PaneResize from "../../common/PaneResize/PaneResize";
import DropDown from "../../common/DropDown/DropDown";
import { getObsoleteTerms } from "../../../api/fetchData";
import NodePage from "../NodePage/NodePage";


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
    

    return(
        <div className="tree-view-container resizable-container">
            <div className="tree-page-left-part" id="page-left-pane">
                <ObsoleteTermsList  ontologyId={props.ontology}  termTypeChangeHandler={termTypeChangeHandler} />
            </div>
            {paneResize.generateVerticalResizeLine()} 
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
        </div>
    );


}


const ObsoleteTermsList = (props) => {
    const [selectedType, setSelectedType] = useState(0);
    const [termsList, setTermsList] = useState([]);

    async function fetchTerms(){
        try{
            let termsList = await getObsoleteTerms(props.ontologyId, selectedType, 0, 1000);            
            setTermsList(termsList['_embedded']);
        }
        catch (error){
            setTermsList([]);
        }
    }

    useEffect(() => {
        fetchTerms();
        
    }, [selectedType]);


    
    const handleTermTypeChange = (e) => {
        let newTypeId = e.target.value;
        let newTypeString = "terms";
        setSelectedType(newTypeId);
        if(newTypeId === 1){
            newTypeString = "props";
        }
        props.termTypeChangeHandler(newTypeString);
    }

    return (
        <div className="row">
            <div className="col-sm-12">
                <div className="row">
                    <div className="col-sm-12">
                        <DropDown 
                            options={TERMS_TYPES_FOR_DROPDOWN}
                            dropDownId="obsolete-terms-types-dropdown"
                            dropDownTitle="Term Type"
                            dropDownValue={selectedType}
                            dropDownChangeHandler={handleTermTypeChange}
                        /> 
                    </div>
                </div>
                <br></br>
                <div className="row">
                    <div className="col-sm-12">
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