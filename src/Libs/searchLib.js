import SearchUrlFactory from "../UrlFactory/SearchUrlFactory";



class SearchLib{
    
    static getSearchInMetadataFieldsFromUrl(){
        try{
            const searchUrlFactory = new SearchUrlFactory();
            if(searchUrlFactory.searchIn.length > 0){                                
                return searchUrlFactory.searchIn;
            }
            return false;            
            
        }
        catch(e){            
            return false;
        }
    }
    
    
    
    static getSearchUnderTermsFromUrl(){
        try{
            const searchUrlFactory = new SearchUrlFactory();
            if(searchUrlFactory.searchUnder.length > 0){
                let terms = searchUrlFactory.searchUnder; 
                terms = terms.map(term => JSON.parse(decodeURIComponent(term)));                  
                return terms;
            }
            return false;                            
        }
        catch(e){            
            return false;    
        }
    }



    static getSearchUnderAllTermsFromUrl(){
        try{
            const searchUrlFactory = new SearchUrlFactory();
            if(searchUrlFactory.searchUnderAll.length > 0){
                let terms = searchUrlFactory.searchUnderAll; 
                terms = terms.map(term => JSON.parse(decodeURIComponent(term)));                  
                return terms;
            }   
            return false;    
            
        }
        catch(e){            
            return false;    
        }
    }

    
    
    
    static decodeSearchUnderIrisFromUrl(){
        try{
            const searchUrlFactory = new SearchUrlFactory();
            if(searchUrlFactory.searchUnder.length === 0){
                return [];
            }
            let terms = searchUrlFactory.searchUnder; 
            terms = terms.map(term => JSON.parse(decodeURIComponent(term)));                       
            let iris = [];
            for (let term of terms){               
                iris.push(term['iri'])
            }            
            return iris;
        }
        catch(e){
            // throw e
            return [];
        }
    }



    static decodeSearchUnderAllIrisFromUrl(){
        try{
            const searchUrlFactory = new SearchUrlFactory();
            if(searchUrlFactory.searchUnderAll.length === 0){                              
                return [];
            }   
            let terms = searchUrlFactory.searchUnderAll; 
            terms = terms.map(term => JSON.parse(decodeURIComponent(term)));
            let iris = [];
            for (let term of terms){               
                iris.push(term['iri'])
            }            
            return iris;
        }
        catch(e){
            // throw e
            return [];
        }
    }



    static getFilterAndAdvancedOntologyIdsFromUrl(){
        try{
            const searchUrlFactory = new SearchUrlFactory();
            return [...searchUrlFactory.ontologies, ...searchUrlFactory.advOntologies];
        }   
        catch(e){            
            return [];
        }        
    }


}

export default SearchLib