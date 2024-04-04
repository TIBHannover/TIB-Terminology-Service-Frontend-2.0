import { createBrowserHistory } from "history";
import * as SiteUrlParamNames from './UrlParamNames';


const KeywordFilterUrlParamName = 'keyword';
const AndOptUrlParamName = 'and';



class OntologyListUrlFactory{
    constructor(){
        let url = new URL(window.location); 
        this.collections = url.searchParams.getAll(SiteUrlParamNames.Collection);
        this.sortedBy = url.searchParams.get(SiteUrlParamNames.SortBy);
        this.page = url.searchParams.get(SiteUrlParamNames.Page);
        this.size =  url.searchParams.get(SiteUrlParamNames.Size);
        this.keywordFilter = url.searchParams.get(KeywordFilterUrlParamName);
        this.baseUrl = window.location.pathname;
        this.history = createBrowserHistory();        
    }


    update({keywordFilter, collections, sortedBy, page, size, andOpValue}){
        let currentUrlParams = new URLSearchParams(window.location.search);  
        currentUrlParams.delete(KeywordFilterUrlParamName);

        if(keywordFilter !== ""){
            currentUrlParams.set(KeywordFilterUrlParamName, keywordFilter);
        }
        
        currentUrlParams.delete(SiteUrlParamNames.Collection);
        for(let col of collections){      
            currentUrlParams.append(SiteUrlParamNames.Collection, col);        
        }
        currentUrlParams.set(AndOptUrlParamName, andOpValue);
        currentUrlParams.set(SiteUrlParamNames.SortBy, sortedBy);
        currentUrlParams.set(SiteUrlParamNames.Page, page);  
        currentUrlParams.set(SiteUrlParamNames.Size, size);
        this.history.push(this.baseUrl + "?" + currentUrlParams.toString());           
    }
}


export default OntologyListUrlFactory;