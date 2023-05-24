import React from "react";



const GENERIC_ISSUE_ID = 1;
const TERM_REQUEST_ISSUE_ID = 2;


class TermRequest extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            issueType: GENERIC_ISSUE_ID
        });
        this.createGenericIssueFields = this.createGenericIssueFields.bind(this);
        this.createIssueTypeDropDown = this.createIssueTypeDropDown.bind(this);
        this.changeIssueType = this.changeIssueType.bind(this);

    }


    createGenericIssueFields(){

    }

    createIssueTypeDropDown(){
        return [            
            <div class="form-group">
                <label for="issue-types" className='col-form-label'>Issue Type</label>
                <select className='site-dropdown-menu list-result-per-page-dropdown-menu' id="issue-types" value={this.state.issueType} onChange={this.changeIssueType}>
                    <option value={GENERIC_ISSUE_ID} key={GENERIC_ISSUE_ID}>General</option>
                    <option value={TERM_REQUEST_ISSUE_ID} key={TERM_REQUEST_ISSUE_ID}>Term Request</option>                            
                </select>  
            </div>            
        ];
    }


    changeIssueType(e){        
        this.setState({
            issueType: e.target.value
        });
    }

    





    render(){
        return(
            <span>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#term-request-modal">
                File a new Issue 
            </button>
            
            <div class="modal" id="term-request-modal">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">                    
                        <div class="modal-header">
                            <h4 class="modal-title">File an issue for this Ontology</h4>
                            <button type="button" class="close close-mark-btn" data-dismiss="modal">&times;</button>
                        </div>
                        
                        <div class="modal-body">
                            <p>You can file a new issue here. The issue can have a General Topic or a new Term Request</p>
                            
                            <div className="row">
                                <div className="col-sm-8">
                                    {this.createIssueTypeDropDown()}
                                    <label className="required_input" for="issueTitle">Issue Title</label>
                                    <input type="text" class="form-control" id="issueTitle" placeholder="Enter Issue Title"></input>
                                </div>
                            </div>                            
                        </div>
                        
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary close-term-request-modal-btn mr-auto" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary submit-term-request-modal-btn">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
            </span>
        );
    }
}

export default TermRequest;