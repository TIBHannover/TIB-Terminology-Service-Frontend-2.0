class CommonUrlFactory{
    constructor(){
        this.baseUrl = window.location.pathname;
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
        return this.baseUrl + "?" + currentParams.toString();
    }
}


export default CommonUrlFactory;