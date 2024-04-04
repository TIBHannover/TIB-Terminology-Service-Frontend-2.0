import { createBrowserHistory } from "history";


class CommonUrlFactory{
    constructor(){
        this.baseUrl = window.location.pathname;
        this.history = createBrowserHistory();
    }


    resetUrl(){
        this.history.push(this.baseUrl);
    }


    deleteParam({name}){
        let searchParams = new URLSearchParams(window.location.search);                   
        searchParams.delete(name);        
        this.history.push(this.baseUrl + "?" +  searchParams.toString());
    }


    getIri(){
        let url = new URL(window.location);
        let currentParams = url.searchParams;
        return currentParams.get('iri');
    }


    setIri({newIri}){
        let url = new URL(window.location);
        let currentParams = url.searchParams;
        currentParams.set('iri', newIri);
        this.history.push(this.baseUrl + "?" + currentParams.toString());
    }


    setObsoletes({value}){
        let url = new URL(window.location);        
        url.searchParams.set('obsoletes', value);        
        this.history.push(this.baseUrl + "?" + url.searchParams.toString());
    }
}


export default CommonUrlFactory;