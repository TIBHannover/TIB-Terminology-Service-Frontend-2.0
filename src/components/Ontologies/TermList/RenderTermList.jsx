import {useEffect, useState} from "react";
import TermApi from "../../../api/term";
import Pagination from "../../common/Pagination/Pagination";
import JumpTo from "../../common/JumpTo/JumpTo";
import DropDown from "../../common/DropDown/DropDown";
import AlertBox from "../../common/Alerts/Alerts";
import '../../layout/termList.css';



const PAGE_SIZES_FOR_DROPDOWN = [{label: "20", value:20}, {label: "30", value:30}, {label: "40", value:40}, {label: "50", value:50}];




export const RenderTermList = (props) => {
    const [tableBodyContent, setTableBodyContent] = useState("");
    const [noResultFlag, setNoResultFlag] = useState(false); 


    async function createList(){
        let result = [];
        let listOfterms = props.listOfTerms;
        let baseUrl = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/';        
        for (let term of listOfterms){
            let termTreeUrl = baseUrl + encodeURIComponent(term['ontology_name']) + '/terms?iri=' + encodeURIComponent(term['iri']);
            let termApi = new TermApi(term['ontology_name'], encodeURIComponent(term['iri']), "terms");            
            let [subclassOfText, equivalentToText] = await Promise.all([
                termApi.getSubClassOf(),
                termApi.getEqAxiom()
            ]);
            let tableBodyContent = !props.isObsolete 
                                    ? createTableBody(term, termTreeUrl, subclassOfText, equivalentToText)
                                    : createTableBodyForObsoletes(term, termTreeUrl, subclassOfText, equivalentToText)

            result.push(tableBodyContent);
        }
        setTableBodyContent(result); 
        props.setTableIsLoading(false);
    }


    useEffect(() => {
        if(props.listOfTerms.length !== 0){            
            setNoResultFlag(false);
            createList();            
        }
        else if(!props.iri){
            setNoResultFlag(true);            
        }
    }, [props.listOfTerms]);


    return(
        <div className="tree-view-container list-container">
                 <div className="row">
                    <div className="col-sm-12">                       
                        <JumpTo 
                            targetType={"terms"}
                            isSkos={props.isSkos}
                            ontologyId={props.ontologyId}
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
                              <div class="form-group form-check">
                                <input 
                                    type="checkbox" 
                                    class="form-check-input" 
                                    id="obsolte_check_term_list" 
                                    onChange={props.obsoletesCheckboxHandler}                                         
                                />
                                <label class="form-check-label" for="obsolte_check_term_list">Only show obsoletes</label>
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
                        <table class="table table-striped term-list-table class-list-table" id="class-list-table">
                            {createShowColumnsTags()}                        
                            {!props.isObsolete ? createClassListTableHeader() : createClassListTableHeaderForObsoletes()}
                            <tbody>
                                {props.tableIsLoading && <div className="is-loading-term-list isLoading"></div>}
                                {!props.tableIsLoading && tableBodyContent}               
                            </tbody>
                        </table>
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



function createClassListTableHeader(){
    return [
        <thead>
            <tr>                
                <th scope="col" className="label-col">Label <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="id-col">ID <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="des-col">Description <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="alt-term-col">Alternative Term <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="sub-class-col">SubClass Of <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="eqv-col">Equivalent to <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="ex-usage-col">Example of usage <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="see-also-col">See Also <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="contrib-col">Contributor <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="comment-col">Comment <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th> 
            </tr>
        </thead>
    ];
}


function createClassListTableHeaderForObsoletes(){
    return [
        <thead>
            <tr>                
                <th scope="col" className="label-col">Label <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="comment-col">Comment <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th> 
                <th scope="col" className="id-col">ID <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="des-col">Description <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="alt-term-col">Alternative Term <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                {/* <th scope="col" className="sub-class-col">SubClass Of <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th> */}
                <th scope="col" className="eqv-col">Equivalent to <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="ex-usage-col">Example of usage <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="see-also-col">See Also <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>
                <th scope="col" className="contrib-col">Contributor <a onClick={hideTableColumn}><i className="fa fa-eye-slash hidden-fa"></i></a></th>                
            </tr>
        </thead>
    ];
}


function createTableBody(term, termTreeUrl, subclassOfText, equivalentToText){
    return (
        <tr>
            <td className="label-col text-break">
                <a className="table-list-label-anchor"  href={termTreeUrl} target="_blank">
                    {term['label']}
                </a>                        
            </td>
            <td className="id-col text-break">{term['short_form']}</td>
            <td className="des-col text-break">{term['description'] ? term['description'] : ""}</td>
            <td className="alt-term-col text-break">{term['annotation']['alternative term'] ? term['annotation']['alternative term'] : "N/A" }</td>
            <td className="sub-class-col text-break"><span  dangerouslySetInnerHTML={{ __html: subclassOfText }} /></td>
            <td className="eqv-col text-break"><span  dangerouslySetInnerHTML={{ __html: equivalentToText }} /></td>
            <td className="ex-usage-col text-break">{term['annotation']['example of usage'] ? term['annotation']['example of usage'] : "N/A" }</td>
            <td className="see-also-col text-break">{term['annotation']['seeAlso'] ? term['annotation']['seeAlso'] : "N/A" }</td>
            <td className="contrib-col text-break">{setContributorField(term)}</td>
            <td className="comment-col text-break">{term['annotation']['comment'] ? term['annotation']['comment'] : "N/A" }</td>
        </tr>        
    );
}


function createTableBodyForObsoletes(term, termTreeUrl, subclassOfText, equivalentToText){
    return (
        <tr>
            <td className="label-col text-break">
                <a className="table-list-label-anchor"  href={termTreeUrl} target="_blank">
                    {term['label']}
                </a>                        
            </td>
            <td className="comment-col text-break">{term['annotation']['comment'] ? term['annotation']['comment'] : "N/A" }</td>
            <td className="id-col text-break">{term['short_form']}</td>
            <td className="des-col text-break">{term['description'] ? term['description'] : ""}</td>
            <td className="alt-term-col text-break">{term['annotation']['alternative term'] ? term['annotation']['alternative term'] : "N/A" }</td>
            {/* <td className="sub-class-col text-break"><span  dangerouslySetInnerHTML={{ __html: subclassOfText }} /></td> */}
            <td className="eqv-col text-break"><span  dangerouslySetInnerHTML={{ __html: equivalentToText }} /></td>
            <td className="ex-usage-col text-break">{term['annotation']['example of usage'] ? term['annotation']['example of usage'] : "N/A" }</td>
            <td className="see-also-col text-break">{term['annotation']['seeAlso'] ? term['annotation']['seeAlso'] : "N/A" }</td>
            <td className="contrib-col text-break">{setContributorField(term)}</td>            
        </tr>        
    );
}



function createShowColumnsTags(){
    return [
        <span>
            <div class="show-hidden-column" data-column="label-col" id="label-col-show" onClick={showTableColumn}>Label <i className="fa fa-eye"></i></div>
            <div class="show-hidden-column" data-column="id-col" id="id-col-show" onClick={showTableColumn}>ID <i className="fa fa-eye"></i></div>
            <div class="show-hidden-column" data-column="des-col" id="des-col-show" onClick={showTableColumn}>Description <i className="fa fa-eye"></i></div>
            <div class="show-hidden-column" data-column="alt-term-col" id="alt-term-col-show" onClick={showTableColumn}>Alternative Term <i className="fa fa-eye"></i></div>
            <div class="show-hidden-column" data-column="sub-class-col" id="sub-class-col-show" onClick={showTableColumn}>SubClass Of <i className="fa fa-eye"></i></div>
            <div class="show-hidden-column" data-column="eqv-col" id="eqv-col-show" onClick={showTableColumn}>Equivalent to <i className="fa fa-eye"></i></div>
            <div class="show-hidden-column" data-column="ex-usage-col" id="ex-usage-col-show" onClick={showTableColumn}>Example of usage <i className="fa fa-eye"></i></div>
            <div class="show-hidden-column" data-column="see-also-col" id="see-also-col-show" onClick={showTableColumn}>See Also <i className="fa fa-eye"></i></div>
            <div class="show-hidden-column" data-column="contrib-col" id="contrib-col-show" onClick={showTableColumn}>Contributor <i className="fa fa-eye"></i></div>
            <div class="show-hidden-column" data-column="comment-col" id="comment-col-show" onClick={showTableColumn}>Comment <i className="fa fa-eye"></i></div>
        </span>        
    ];
}



function setContributorField(term){
    if (term['annotation']['contributor']){
        return term['annotation']['contributor'];
    }
    else if(term['annotation']['term editor']){
        return term['annotation']['term editor'];
    }
    else if(term['annotation']['creator']){
        return term['annotation']['creator'];
    }
    else{
        return "N/A";
    }
}



function hideTableColumn(e){
    let columnClassName = e.target.parentNode.parentNode.className
    let tableCells = document.getElementsByClassName(columnClassName);
    for(let cell of tableCells){
        cell.style.display = "none";
    }
    try{document.getElementById(columnClassName + '-show').style.display = "inline-block";}
    catch(e){return true}        
   
}



function showTableColumn(e){
    let columnClassName = "";
    if(e.target.tagName === "I"){
        columnClassName = e.target.parentNode.dataset.column;
        e.target.parentNode.style.display = "none";
    }
    else{
        columnClassName = e.target.dataset.column;
        e.target.style.display = "none";
    }
    
    let tableCells = document.getElementsByClassName(columnClassName);
    for(let cell of tableCells){
        cell.style.display = "";
    }    
   
}