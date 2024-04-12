import SearchUrlFactory from "../UrlFactory/SearchUrlFactory";



class SearchLib{
    
    static getSearchInMetadataFieldsFromUrlOrStorage(){
        try{
            const searchUrlFactory = new SearchUrlFactory();
            if(searchUrlFactory.searchIn.length > 0){                                
                return searchUrlFactory.searchIn;
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
            const searchUrlFactory = new SearchUrlFactory();
            if(searchUrlFactory.searchUnder.length > 0){
                let terms = searchUrlFactory.searchUnder; 
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
            const searchUrlFactory = new SearchUrlFactory();
            if(searchUrlFactory.searchUnderAll.length > 0){
                let terms = searchUrlFactory.searchUnderAll; 
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



    // static getAdvancedOntologIdsFromUrlOrStorage(){
    //     try{
    //         let currentUrlParams = new URL(window.location).searchParams;
    //         if(currentUrlParams.get('advontology')){
    //             let ontologyIds = currentUrlParams.getAll('advontology');
    //             let ontologyList = [];
    //             for(let id of ontologyIds){
    //                 let opt = {};
    //                 opt['text'] = id;
    //                 opt['id'] = id;
    //                 ontologyList.push(opt);
    //             }
    //             return ontologyList;
    //         }

    //         let advSearchState = localStorage.getItem('advancedSearchStates');
    //         advSearchState = JSON.parse(advSearchState)
    //         if(advSearchState.selectedOntologies){
    //             return advSearchState.selectedOntologies;
    //         }

    //         return []; 
            
    //     }
    //     catch(e){            
    //         return [];
    //     }
    // }
    
    
    
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