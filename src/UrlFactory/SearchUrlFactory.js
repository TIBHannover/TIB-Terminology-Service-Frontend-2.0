import { createBrowserHistory } from "history";
import * as SiteUrlParamNames from './UrlParamNames';



class SearchUrlFactory {
  constructor() {
    let url = new URL(window.location); 
    this.baseUrl = window.location.pathname;
    this.history = createBrowserHistory();
    this.searchQuery = url.searchParams.get(SiteUrlParamNames.SearchQuery);
    this.advancedSearchEnabled = url.searchParams.get(SiteUrlParamNames.AdvancedSearchEnabled);
    this.exact = url.searchParams.get(SiteUrlParamNames.Exact);
    this.ontologies = url.searchParams.getAll(SiteUrlParamNames.Ontology);
    this.types = url.searchParams.getAll(SiteUrlParamNames.TermType);
    this.collections = url.searchParams.getAll(SiteUrlParamNames.Collection);
  }


  createSearchUrlForAutoSuggestItem({label, ontologyId, obsoleteFlag, exact}){
    let searchUrl = new URL(window.location);    
    searchUrl.pathname =  process.env.REACT_APP_PROJECT_SUB_PATH + "/search";          
    searchUrl.searchParams.delete(SiteUrlParamNames.Iri);
    searchUrl.searchParams.delete(SiteUrlParamNames.IssueType);
    searchUrl.searchParams.set(SiteUrlParamNames.SearchQuery, label);
    searchUrl.searchParams.set(SiteUrlParamNames.Page, 1);    
    ontologyId && searchUrl.searchParams.set(SiteUrlParamNames.Ontology, ontologyId); 
    obsoleteFlag && searchUrl.searchParams.set(SiteUrlParamNames.Obsoletes, obsoleteFlag);
    exact && searchUrl.searchParams.set(SiteUrlParamNames.Exact, exact);
    return searchUrl.toString();    
  }


  decodeSearchQuery(){
    if(this.searchQuery){
        return decodeURIComponent(this.searchQuery);        
    }
    return "";
  }


  setExact({exact}){
    let url = new URL(window.location);
    let currentParams = url.searchParams;
    currentParams.set(SiteUrlParamNames.Exact, exact);
    this.history.push(this.baseUrl + "?" + currentParams.toString());
  }


  setAdvancedSearchEnabled({enabled}){
    let url = new URL(window.location);
    let currentParams = url.searchParams;
    currentParams.set(SiteUrlParamNames.AdvancedSearchEnabled, enabled);
    this.history.push(this.baseUrl + "?" + currentParams.toString());
  }

 
}

export default SearchUrlFactory;