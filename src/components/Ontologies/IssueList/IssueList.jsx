import React from "react";
import { withAuth } from "react-oidc-context";
import { withRouter } from 'react-router-dom';
import {createLabelTags, 
    createIssueDescription, 
    createIssueTitle, loadUrlParameter} from './helper';
import { getOntologyGithubIssueList } from "../../../api/tsMicroBackendCalls";
import DropDown from "../../common/DropDown/DropDown";


const OPEN_ISSUE_ID = 1;
const CLOSE_ISSUE_ID = 2;
const ALL_ISSUE_ID = 3;
const ISSUE_STATES_VALUES = ["", "open", "closed", "all"]
const ISSUE_STATES_FOR_DROPDOWN = [    
    {label: "Open", value:OPEN_ISSUE_ID},
    {label: "All", value:ALL_ISSUE_ID},
    {label: "Closed", value:CLOSE_ISSUE_ID}    
];



class IssueList extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            listOfIssuesToRender: [],
            listOfOpenIssues: [],
            listOfClosedIssues: [],
            listOfAllIssues: [],
            waiting: true,
            contentForRender: "",
            selectedStateId: OPEN_ISSUE_ID,            
            issueTrackerUrl: null,
            pageNumber: 1,
            resultCountPerPage: 10,
            noMoreIssuesExist: false     
        });
        this.setComponentData = this.setComponentData.bind(this);
        this.createIssuesList = this.createIssuesList.bind(this);        
        this.handleIssueStateChange = this.handleIssueStateChange.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
        this.updateURL = this.updateURL.bind(this);
        this.createPagination = this.createPagination.bind(this);
        this.loadTheComponentPreviousState = this.loadTheComponentPreviousState.bind(this);        
    }


    async setComponentData(reload=false){
        if(this.props.lastState && !reload){
            this.loadTheComponentPreviousState();
            return true;
        }
        let ontology = this.props.ontology;
        let issueTrackerUrl = typeof(ontology.config.tracker) !== "undefined" ? ontology.config.tracker : null;
        let listOfIssues = [];                 
        let urlParameter = loadUrlParameter(reload, this.state.pageNumber, this.state.selectedStateId);
        let pageNumber = urlParameter['pageNumber'];
        let selectedStateId = urlParameter['selectedStateId'];
        let issueStateValue =  ISSUE_STATES_VALUES[selectedStateId];
        let resultCountPerPage = this.state.resultCountPerPage;
        listOfIssues = await getOntologyGithubIssueList(issueTrackerUrl, issueStateValue, resultCountPerPage, pageNumber);
        if(listOfIssues.length === 0){
            this.setState({
                waiting: false,
                noMoreIssuesExist: true
            });
            this.updateURL(pageNumber, selectedStateId);
            return true;
        }
        this.setState({
            listOfIssuesToRender: listOfIssues,
            waiting: false,
            issueTrackerUrl: issueTrackerUrl,
            selectedStateId: selectedStateId,
            pageNumber: pageNumber,
            noMoreIssuesExist: false
        }, () => {
            this.createIssuesList();
            this.updateURL(pageNumber, selectedStateId);
        });
    }

    
    loadTheComponentPreviousState(){
        this.setState({...this.props.lastState});
        this.updateURL(this.props.lastState.pageNumber, this.props.lastState.selectedStateId);
    }
        
    
    handleIssueStateChange(e){
        this.setState({waiting:true});
        let selectedIssueStateId = parseInt(e.target.value);
        this.setState({
            selectedStateId: selectedIssueStateId,
            pageNumber: 1
        }, ()=>{
            this.setComponentData(true);
        });        
        localStorage.setItem("selectedIssueStateId", selectedIssueStateId);
    }

    
    handlePagination (e) {
        let paginationDirection = e.target.dataset.value;
        let pageNumber = this.state.pageNumber;
        if(paginationDirection === "minus" && pageNumber > 1){
            pageNumber -= 1;
        }
        else if(paginationDirection === "plus"){
            pageNumber += 1;
        }
        this.setState({
          pageNumber: pageNumber,
          waiting: true         
        }, ()=> {            
            this.setComponentData(true);
        })
    }


    updateURL(pageNumber, stateId){
        let currentUrlParams = new URLSearchParams();
        currentUrlParams.append('page', pageNumber);
        currentUrlParams.append('stateId', stateId);              
        this.props.history.push(window.location.pathname + "?" + currentUrlParams.toString());
    }


    createPagination(){
        return [
            <ul className='pagination-holder'>
                <li className='pagination-btn pagination-start'>
                   <a className='pagination-link' data-value={'minus'} onClick={this.handlePagination}>Previous</a>
                </li>                
                <li className='pagination-btn pagination-end'>
                    <a className='pagination-link'  data-value={'plus'} onClick={this.handlePagination}>Next</a>
                </li>
            </ul>
        ];
    }

    
    
    createIssuesList(){
        let listOfIssues = this.state.listOfIssuesToRender;
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
        this.setState({contentForRender: result}, () => {
            this.props.storeListOfGitIssuesState(this.state);
        });        
    }


    componentDidMount(){
        this.setComponentData();
    }


    render(){
        if(process.env.REACT_APP_GITHUB_ISSUE_LIST_FEATURE !== "true"){            
            return null;
        }
        return (
            <div className="row tree-view-container">
                <div className="col-sm-12">                  
                    {this.state.waiting && <div className="isLoading"></div>}
                    {!this.state.waiting && 
                        <span>
                            <div className="row">
                                <div className="col-sm-3">                                
                                    <DropDown 
                                        options={ISSUE_STATES_FOR_DROPDOWN}
                                        dropDownId="issue-state-types"
                                        dropDownTitle="State"
                                        dropDownValue={this.state.selectedStateId}
                                        dropDownChangeHandler={this.handleIssueStateChange}
                                    /> 
                                </div>
                                <div className="col-sm-3">                                    
                                    <div class="form-check-inline">
                                        <label class="form-check-label">
                                            <input type="radio" class="form-check-input" name="typeRadio" value={"issue"} checked />
                                            Issue
                                        </label>
                                    </div>
                                    <div class="form-check-inline">
                                        <label class="form-check-label">
                                            <input type="radio" class="form-check-input" name="typeRadio" value={"pr"} />
                                            Pull Request
                                        </label>
                                    </div>                                                                
                                </div>                            
                            </div>
                            <div className="row">                            
                                <div className="col-sm-8">
                                    {!this.state.noMoreIssuesExist && this.state.contentForRender}
                                    {this.state.noMoreIssuesExist && 
                                        <div class="alert alert-info">
                                            No Result. 
                                        </div>
                                    }                                
                                    {this.createPagination()}                                
                                </div>                            
                            </div>
                        </span>
                    }
                </div>
            </div>
            
        );
    }



}

export default withAuth(withRouter(IssueList));