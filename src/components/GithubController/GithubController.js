
class GithubController{    
    
    async getOntologyIssueListForUser(ontologyId, ontologyIssueTrackerUrl, issueState, resultCountPerPage=10, pageNumber=1){
        try{ 
            let urlPath = ontologyIssueTrackerUrl.split("https://github.com/")[1];
            let data = new FormData();
            data.append("issuePath", urlPath);
            data.append("issueState", issueState);
            data.append("size", resultCountPerPage);
            data.append("pageNumber", pageNumber);            
            let result = await fetch(process.env.REACT_APP_TEST_BACKEND_URL + '/issues/' + ontologyId, {method: 'POST', body: data});
            result = await result.json();
            console.info(result)            
            return result.result;
        }
        catch(e){
            // console.info(e)
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