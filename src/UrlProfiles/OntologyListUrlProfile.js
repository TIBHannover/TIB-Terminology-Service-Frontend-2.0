
class OntologyListUrlProfile{
    constructor(){
        let url = new URL(window.location); 
        this.collections = url.searchParams.getAll('collection');
        this.sortedBy = url.searchParams.get('sorting');
        this.page = url.searchParams.get('page');
        this.size =  url.searchParams.get('size');
        this.keywordFilter = url.searchParams.get('keyword');        
    }


    update({keywordFilter, collections, sortedBy, page, size, andOpValue}){
        let currentUrlParams = new URLSearchParams(window.location.search);  
        currentUrlParams.delete('keyword');

        if(keywordFilter !== ""){
            currentUrlParams.set('keyword', keywordFilter);
        }
        
        currentUrlParams.delete('collection');
        for(let col of collections){      
            currentUrlParams.append('collection', col);        
        }
        currentUrlParams.set('and', andOpValue);
        currentUrlParams.set('sorting', sortedBy);
        currentUrlParams.set('page', page);  
        currentUrlParams.set('size', size);
        return window.location.pathname + "?" + currentUrlParams.toString();           
    }
}


export default OntologyListUrlProfile;