

class SearchLib{
    
    static getSearchUnderTermsFromUrl(){
        try{
            let currentUrlParams = new URL(window.location).searchParams;
            if(!currentUrlParams.get('searchunder')){
                return [];
            }                        
            let terms = currentUrlParams.getAll('searchunder'); 
            terms = terms.map(term => JSON.parse(decodeURIComponent(term)));                  
            return terms;
        }
        catch(e){            
            return [];
        }
    }



    static getSearchUnderAllTermsFromUrl(){
        try{
            let currentUrlParams = new URL(window.location).searchParams;
            if(!currentUrlParams.get('searchunderall')){
                return [];
            }                        
            let terms = currentUrlParams.getAll('searchunderall'); 
            terms = terms.map(term => JSON.parse(decodeURIComponent(term)));                  
            return terms;
        }
        catch(e){            
            return [];
        }
    }



    static getOntologIdsFromUrl(){
        try{
            let currentUrlParams = new URL(window.location).searchParams;
            let ontologyIds = currentUrlParams.get('ontology') ? currentUrlParams.getAll('ontology') : [];
            let ontologyList = [];
            for(let id of ontologyIds){
                let opt = {};
                opt['text'] = id;
                opt['id'] = id;
                ontologyList.push(opt);
            }
            return ontologyList;
        }
        catch(e){            
            return [];
        }
    }
    
    
    
    static extractSearchUnderIrisFromUrl(){
        try{
            let terms = SearchLib.getSearchUnderTermsFromUrl();
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



    static extractSearchUnderAllIrisFromUrl(){
        try{
            let terms = SearchLib.getSearchUnderAllTermsFromUrl();
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


}

export default SearchLib