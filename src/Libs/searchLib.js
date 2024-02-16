

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


}

export default SearchLib