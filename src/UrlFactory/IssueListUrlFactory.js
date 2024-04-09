// Desc: This file is used to get the URL parameters for the IssueList component

import { createBrowserHistory } from "history";
import * as SiteUrlParamNames from './UrlParamNames';


const IssueStateUrlParamName = "stateId";
const IssueTypeUrlParamName = "issuetype";


class IssueListUrlFactory {
   constructor(){
        let url = new URL(window.location); 
        this.selectedStateId = url.searchParams.get(IssueStateUrlParamName);
        this.pageNumber = url.searchParams.get(SiteUrlParamNames.Page);
        this.selectedType = url.searchParams.get(IssueTypeUrlParamName);
        this.history = createBrowserHistory();
        this.baseUrl = window.location.pathname;        
   }



   update({pageNumber, stateId, issueType}){
        let currentUrlParams = new URLSearchParams();
        currentUrlParams.set(SiteUrlParamNames.Page, pageNumber);
        currentUrlParams.set(IssueStateUrlParamName, stateId);      
        currentUrlParams.set(IssueTypeUrlParamName, issueType);              
        window.history.pushState({}, '', window.location.pathname + "?" + currentUrlParams.toString());
        this.history.push(this.baseUrl + "?" + currentUrlParams.toString());     
   }

}


export default IssueListUrlFactory;