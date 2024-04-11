import { createBrowserHistory } from "history";
import * as SiteUrlParamNames from './UrlParamNames';


class TermListUrlFactory {
    constructor() {
        let url = new URL(window.location); 
        this.page = url.searchParams.get(SiteUrlParamNames.Page);
        this.size = url.searchParams.get(SiteUrlParamNames.Size);
        this.iri = url.searchParams.get(SiteUrlParamNames.Iri);
        this.baseUrl = window.location.pathname;
        this.history = createBrowserHistory();  
    }


    update({iri, page, size, obsoletes}){
        let currentUrlParams = new URLSearchParams();
        if(iri){
            currentUrlParams.set(SiteUrlParamNames.Iri, iri);
        }
        else{
            currentUrlParams.set(SiteUrlParamNames.Page, page);
            currentUrlParams.set(SiteUrlParamNames.Size, size);
            currentUrlParams.set(SiteUrlParamNames.Obsoletes, obsoletes);
            currentUrlParams.delete(SiteUrlParamNames.Iri);
        }        
        this.history.push(this.baseUrl + "?" + currentUrlParams.toString()); 
    }
}

export default TermListUrlFactory;