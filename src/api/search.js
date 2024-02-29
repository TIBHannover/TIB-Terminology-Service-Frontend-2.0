import { getCallSetting} from "./constants";



export async function olsSearch({
        searchQuery, 
        page, 
        size, 
        selectedOntologies, 
        selectedTypes, 
        selectedCollections, 
        obsoletes, 
        exact,
        isLeaf, 
        searchInValues, 
        searchUnderIris,
        searchUnderAllIris
    }) 
    {
    try{        
        let rangeStart = (page - 1) * size;
        let searchUrl = process.env.REACT_APP_SEARCH_URL + `?q=${searchQuery}&start=${rangeStart}&groupField=iri&rows=${size}`;
        searchUrl = selectedOntologies.length !== 0 ? (searchUrl + `&ontology=${selectedOntologies.join(',')}`) : searchUrl;
        searchUrl = selectedTypes.length !== 0 ? (searchUrl + `&type=${selectedTypes.join(',')}`) : searchUrl;
        searchUrl = searchInValues.length !== 0 ? (searchUrl + `&queryFields=${searchInValues.join(',')}`) : searchUrl;
        searchUrl = searchUnderIris.length !== 0 ? (searchUrl + `&childrenOf=${searchUnderIris.join(',')}`) : searchUrl;
        searchUrl = searchUnderAllIris.length !== 0 ? (searchUrl + `&allChildrenOf=${searchUnderAllIris.join(',')}`) : searchUrl;
        searchUrl = obsoletes ? (searchUrl + "&obsoletes=true") : searchUrl;
        searchUrl = exact ? (searchUrl + "&exact=true") : searchUrl;
        searchUrl = isLeaf ? (searchUrl + "&isLeaf=true") : searchUrl;
        if(process.env.REACT_APP_PROJECT_NAME === "" && selectedCollections.length !== 0){
            // If TIB General. Set collections if exist in filter
            searchUrl += `&schema=collection&classification=${selectedCollections.join(',')}`;
        }
        else if(process.env.REACT_APP_PROJECT_NAME !== ""){
            // Projects such as NFDI4CHEM. pre-set the target collection on each search
            searchUrl += `&schema=collection&classification=${process.env.REACT_APP_PROJECT_NAME}`;
        }
        let result = await (await fetch(searchUrl, getCallSetting)).json(); 
        return result;
    }
    catch(e){        
        return [];
    }
}