

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
    
    
    
    static getSearchUnderTermsFromUrlOrStorage(){
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



    static getSearchUnderAllTermsFromUrlOrStorage(){
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



    static getAdvancedOntologIdsFromUrlOrStorage(){
        try{
            let currentUrlParams = new URL(window.location).searchParams;
            if(currentUrlParams.get('advontology')){
                let ontologyIds = currentUrlParams.getAll('advontology');
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
    
    
    
    static decodeSearchUnderIrisFromUrl(){
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



    static decodeSearchUnderAllIrisFromUrl(){
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



    static getFilterAndAdvancedOntologyIdsFromUrl(){
        try{
            let currentUrlParams = new URL(window.location).searchParams;                                     
            return [...currentUrlParams.getAll('ontology'), ...currentUrlParams.getAll('advontology')];
        }   
        catch(e){            
            return [];
        }        
    }


}

export default SearchLib