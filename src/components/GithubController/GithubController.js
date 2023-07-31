
class GithubController{    
    
    async getOntologyIssueListForUser(ontologyId, ontologyIssueTrackerUrl, issueState, resultCountPerPage=10, pageNumber=1){
        try{ 
            let urlPath = ontologyIssueTrackerUrl.split("https://github.com/")[1];
            let data = new FormData();
            data.append("issuePath", urlPath);
            data.append("issueState", issueState);
            data.append("size", resultCountPerPage);
            data.append("pageNumber", pageNumber);
            let endpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/github/issuelist' 
            let header = {};
            header["X-TS-Frontend-Id"] = process.env.REACT_APP_PROJECT_ID;
            header["X-TS-Frontend-Token"] = process.env.REACT_APP_MICRO_BACKEND_TOKEN;
            let result = await fetch(endpoint, {method: 'POST', headers:header, body: data});
            result = await result.json();
            result = result['_result']            
            return result.issues;
        }
        catch(e){            
            return [];
        }        
    }
    
    async getAnIssueLabelsList(issueObject){        
        try{            
            let url = issueObject['labels_url'].split("{/name}")[0];            
            let labels = await fetch(url, this.getCallSetting);
            labels = await labels.json();
            return labels;            
        }
        catch(e){
            return [];
        }
    }
}

export default GithubController;