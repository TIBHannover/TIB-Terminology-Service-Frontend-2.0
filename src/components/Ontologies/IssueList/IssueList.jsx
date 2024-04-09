import { useEffect, useState, useContext } from "react";
import {createLabelTags, createIssueDescription, createIssueTitle, setTypeRadioBtn} from './helper';
import { getOntologyGithubIssueList } from "../../../api/tsMicroBackendCalls";
import DropDown from "../../common/DropDown/DropDown";
import TermRequest from '../TermRequest/TermRequest';
import { AppContext } from "../../../context/AppContext";
import '../../layout/githubPanel.css';
import { OntologyPageContext } from "../../../context/OntologyPageContext";
import IssueListUrlFactory from "../../../UrlFactory/IssueListUrlFactory";



const OPEN_ISSUE_ID = 1;
const CLOSE_ISSUE_ID = 2;
const ALL_ISSUE_ID = 3;
const ISSUE_STATES_VALUES = ["", "open", "closed", "all"]
const ISSUE_STATES_FOR_DROPDOWN = [    
    {label: "Open", value:OPEN_ISSUE_ID},
    {label: "All", value:ALL_ISSUE_ID},
    {label: "Closed", value:CLOSE_ISSUE_ID}    
];

const resultCountPerPage = 10;



const IssueList = (props) => {

    const ontologyPageContext = useContext(OntologyPageContext);
    const appContext = useContext(AppContext);

    const urlFactory = new IssueListUrlFactory();
    
    const [waiting, setWaiting] = useState(true);
    const [contentForRender, setContentForRender] = useState([]);
    const [selectedStateId, setSelectedStateId] = useState(urlFactory.selectedStateId ? urlFactory.selectedStateId : OPEN_ISSUE_ID);    
    const [pageNumber, setPageNumber] = useState(urlFactory.pageNumber ? urlFactory.pageNumber : 1);    
    const [noMoreIssuesExist, setNoMoreIssuesExist] = useState(false);
    const [selectedType, setSelectedType] = useState(urlFactory.selectedType ? urlFactory.selectedType : "issue");

    


    async function createIssueList(){               
        let ontology = ontologyPageContext.ontology;
        let issueTrackerUrl = typeof(ontology.config.tracker) !== "undefined" ? ontology.config.tracker : null;
        let listOfIssues = [];                                                    
        setTypeRadioBtn(selectedType);  
        let issueStateValue =  ISSUE_STATES_VALUES[selectedStateId];        
        listOfIssues = await getOntologyGithubIssueList(issueTrackerUrl, issueStateValue, selectedType, resultCountPerPage, pageNumber);
        if(listOfIssues.length === 0){            
            setNoMoreIssuesExist(true);            
            return true;
        }                
                
        let result = [];
        for(let issue of listOfIssues){            
            result.push(
                <div className="row">
                    <div className="col-sm-12 git-issue-card">
                        {createIssueTitle(issue)}
                        {createLabelTags(issue['labels'])}
                        <br/>
                        {createIssueDescription(issue)}
                    </div>
                </div>
            );
        }

        setContentForRender(result);     
        setNoMoreIssuesExist(false);
        setWaiting(false);
    }



    function handleIssueStateChange(e){                
        let selectedIssueStateId = parseInt(e.target.value);
        setSelectedStateId(selectedIssueStateId);
        setWaiting(true);
        setPageNumber(1);        
        localStorage.setItem("selectedIssueStateId", selectedIssueStateId);
    }



    function handlePagination (e) {
        let paginationDirection = e.target.dataset.value;        
        if(paginationDirection === "minus" && pageNumber > 1){
            setPageNumber(parseInt(pageNumber) - 1);
            setWaiting(true);  
        }
        else if(paginationDirection === "plus"){
            setPageNumber(parseInt(pageNumber) + 1);
            setWaiting(true);  
        }
                  
    }



    function handleTypeChange(e){        
        setSelectedType(e.target.value);
        setPageNumber(1);
        setWaiting(true);             
    }



    function createPagination(){
        return [
            <ul className='pagination-holder'>
                <li className='pagination-btn pagination-start'>
                   <a className='pagination-link' data-value={'minus'} onClick={handlePagination}>Previous</a>
                </li>                
                <li className='pagination-btn pagination-end'>
                    <a className='pagination-link'  data-value={'plus'} onClick={handlePagination}>Next</a>
                </li>
            </ul>
        ];
    }


    useEffect(() => {
        createIssueList();
    }, []);


    useEffect(() => {
        urlFactory.update({pageNumber:pageNumber, stateId: selectedStateId, issueType: selectedType});
        createIssueList();
    }, [pageNumber, selectedStateId, selectedType]);



    if(process.env.REACT_APP_GITHUB_ISSUE_LIST_FEATURE !== "true"){            
        return null;
    }

    return (
        <div className="row tree-view-container list-container">
            <div className="col-sm-12">
                <div className="row">
                    <div className="col-sm-3">                                
                        <DropDown 
                            options={ISSUE_STATES_FOR_DROPDOWN}
                            dropDownId="issue-state-types"
                            dropDownTitle="State"
                            dropDownValue={selectedStateId}
                            dropDownChangeHandler={handleIssueStateChange}
                        /> 
                    </div>
                    <div className="col-sm-3">                                    
                        <div class="form-check-inline form-check-inline-github-issue">                                
                            <input type="radio" id="issue_radio" class="form-check-input form-check-input-github-issue custom-radio-btn-input" name="typeRadio" value={"issue"} onChange={handleTypeChange}/>
                            <label class="form-check-label" for="issue_radio">Issue</label>
                        </div>
                        <div class="form-check-inline form-check-inline-github-issue">
                            <input type="radio" id="pr_radio" class="form-check-input form-check-input-github-issue custom-radio-btn-input" name="typeRadio" value={"pr"} onChange={handleTypeChange}/>
                            <label class="form-check-label" for="pr_radio">Pull Request</label>
                        </div>                                                                
                    </div> 
                    <div className="col-sm-3">
                        {createPagination()}
                    </div>                        
                </div>                                       
                    <div className="row">                            
                        <div className="col-sm-9">
                            {waiting && <div className="isLoading"></div>} 
                            {!waiting && !noMoreIssuesExist && contentForRender}
                            {!waiting && noMoreIssuesExist && 
                                <div class="alert alert-info">
                                    No Result. 
                                </div>
                            }                                                            
                        </div>
                        
                        <div className="col-sm-3">                           
                            {appContext.user &&                              
                                <>
                                <TermRequest ontology={ontologyPageContext.ontology} reportType={"general"} />
                                <br></br>
                                <TermRequest ontology={ontologyPageContext.ontology} reportType={"termRequest"} />
                                </>                                                                  
                            } 
                        </div>
                    </div>                                                         
            </div>
        </div>
        
    );
}




export default IssueList;