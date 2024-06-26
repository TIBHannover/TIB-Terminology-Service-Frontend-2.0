import { useState } from "react";
import { getTsPluginHeaders } from "../../../api/header";


const ISSUE_TYPE = {"general": "Generel", "termRequest": "Term Request"}



export default function SubmitedIssueRequests(){    
    
    const [issuesList, setIssuesList] = useState(null);  

    if(!issuesList){
        getIssueList().then((resp) => {        
            setIssuesList(resp);
        });
    }

    if(process.env.REACT_APP_GITHUB_ISSUE_REQUEST_FEATURE !== "true"){            
        return null;
    }
   
    return [
        <div className="row user-info-panel">
            <div className="col-sm-12">
                <h5><b>Here you can check the issue and Term requests that were submited by you.</b></h5>
                <table class="table table-striped">                    
                    <tbody>
                        <tr>
                            <th scope="col" class="col-6">Issue</th>
                            <th scope="col" class="col-2">Issue Type</th>
                            <th scope="col" class="col-2">ontology</th>
                            <th scope="col" class="col-2">Created at</th>                            
                        </tr>
                        {renderIssueTableRows(issuesList)}
                    </tbody>
                </table>        
            </div>                         
        </div>        
    ];

}


async function getIssueList(){    
    let headers = getTsPluginHeaders({withAccessToken: true});
    let issueList = await fetch(process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/github/get_submited_issues', {method: 'GET', headers:headers});
    issueList = await issueList.json();
    issueList = issueList['_result'];
    if(issueList && issueList['submited_issues']){                                   
        return issueList['submited_issues'];
    }
    return [];
}


function renderIssueTableRows(issuesList){
    if(!issuesList || issuesList.length === 0){
        return [];
    }
    let result = [];
    for(let issue of issuesList){
        result.push(
            <tr>                                            
                <td scope="col" class="col-6"><a href={issue['issue_url']} target="_blank">{issue['issue_url']}</a></td>
                <td scope="col" class="col-2">{ISSUE_TYPE[issue['issue_type']]}</td>
                <td scope="col" class="col-2"><a href={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + issue['ontology_id']} target="_blank">{issue['ontology_id']}</a></td>
                <td scope="col" class="col-2">{issue['created_at']}</td>                            
            </tr>
        );
    }
    return result;
}

