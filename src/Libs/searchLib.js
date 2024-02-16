

class SearchLib{

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


}

export default SearchLib