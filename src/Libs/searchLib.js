

class SearchLib{
    
    static getSearchInMetadataFieldsFromUrlOrStorage(){
        try{
            let currentUrlParams = new URL(window.location).searchParams;                        
            if(currentUrlParams.get('searchin')){                                
                return currentUrlParams.getAll('searchin');
            }            
            let advSearchState = localStorage.getItem('advancedSearchStates');
            advSearchState = JSON.parse(advSearchState)
            if(advSearchState.selectedMetaData){
                return advSearchState.selectedMetaData;
            }
            return [];
        }
        catch(e){            
            return [];
        }
    }
    
    
    
    static getSearchUnderTermsFromUrl(){
        try{
            let currentUrlParams = new URL(window.location).searchParams;
            if(currentUrlParams.get('searchunder')){
                let terms = currentUrlParams.getAll('searchunder'); 
                terms = terms.map(term => JSON.parse(decodeURIComponent(term)));                  
                return terms;
            }
            
            let advSearchState = localStorage.getItem('advancedSearchStates');
            advSearchState = JSON.parse(advSearchState)
            if(advSearchState.selectedSearchUnderTerms){
                return advSearchState.selectedSearchUnderTerms;
            }

            return [];                        
        }
        catch(e){            
            return [];
        }
    }



    static getSearchUnderAllTermsFromUrl(){
        try{
            let currentUrlParams = new URL(window.location).searchParams;
            if(currentUrlParams.get('searchunderall')){
                let terms = currentUrlParams.getAll('searchunderall'); 
                terms = terms.map(term => JSON.parse(decodeURIComponent(term)));                  
                return terms;
            }   
            
            let advSearchState = localStorage.getItem('advancedSearchStates');
            advSearchState = JSON.parse(advSearchState)
            if(advSearchState.selectedSearchUnderAllTerms){
                return advSearchState.selectedSearchUnderAllTerms;
            }

            return []; 
            
        }
        catch(e){            
            return [];
        }
    }



    static getOntologIdsFromUrl(){
        try{
            let currentUrlParams = new URL(window.location).searchParams;
            if(currentUrlParams.get('ontology')){
                let ontologyIds = currentUrlParams.getAll('ontology');
                let ontologyList = [];
                for(let id of ontologyIds){
                    let opt = {};
                    opt['text'] = id;
                    opt['id'] = id;
                    ontologyList.push(opt);
                }
                return ontologyList;
            }

            let advSearchState = localStorage.getItem('advancedSearchStates');
            advSearchState = JSON.parse(advSearchState)
            if(advSearchState.selectedOntologies){
                return advSearchState.selectedOntologies;
            }

            return []; 
            
        }
        catch(e){            
            return [];
        }
    }
    
    
    
    static extractSearchUnderIrisFromUrl(){
        try{
            let currentUrlParams = new URL(window.location).searchParams;
            if(!currentUrlParams.get('searchunder')){
                return [];
            }
            let terms = currentUrlParams.getAll('searchunder'); 
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



    static extractSearchUnderAllIrisFromUrl(){
        try{
            let currentUrlParams = new URL(window.location).searchParams;
            if(!currentUrlParams.get('searchunderall')){                              
                return [];
            }   
            let terms = currentUrlParams.getAll('searchunderall'); 
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


}

export default SearchLib