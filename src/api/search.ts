import { getCallSetting } from "./constants";
import {
  SearchApiInput,
  SuggestAndSelectApiInput,
  SearchApiResponse,
  BaseSearchSingleResult,
  AutoSuggestSingleResult
} from "./types/searchApiTypes";
import Toolkit from "../Libs/Toolkit";




export async function olsSearch(inputData: SearchApiInput): Promise<SearchApiResponse | []> {
  try {
    let lang = Toolkit.getVarInLocalSrorageIfExist('language', 'en');
    let rangeStart: number = (inputData.page - 1) * inputData.size;
    let searchUrl: string = process.env.REACT_APP_SEARCH_URL + `?q=${inputData.searchQuery}&start=${rangeStart}&groupField=iri&rows=${inputData.size}&lang=${lang}`;
    searchUrl = inputData.selectedOntologies.length !== 0 ? (searchUrl + `&ontology=${inputData.selectedOntologies.join(',')}`) : searchUrl;
    searchUrl = inputData.selectedTypes.length !== 0 ? (searchUrl + `&type=${inputData.selectedTypes.join(',')}`) : searchUrl;
    searchUrl = inputData.searchInValues.length !== 0 ? (searchUrl + `&queryFields=${inputData.searchInValues.join(',')}`) : searchUrl;
    searchUrl = inputData.searchUnderIris.length !== 0 ? (searchUrl + `&childrenOf=${inputData.searchUnderIris.join(',')}`) : searchUrl;
    searchUrl = inputData.searchUnderAllIris.length !== 0 ? (searchUrl + `&allChildrenOf=${inputData.searchUnderAllIris.join(',')}`) : searchUrl;
    searchUrl = inputData.obsoletes ? (searchUrl + "&obsoletes=true") : searchUrl;
    searchUrl = inputData.exact ? (searchUrl + "&exact=true") : searchUrl;
    searchUrl = inputData.isLeaf ? (searchUrl + "&isLeaf=true") : searchUrl;
    if (process.env.REACT_APP_PROJECT_NAME === "" && inputData.selectedCollections.length !== 0) {
      // If TIB General. Set collections if exist in filter
      searchUrl += `&schema=collection&classification=${inputData.selectedCollections.join(',')}`;
    }
    else if (inputData.selectedOntologies.length === 0 && process.env.REACT_APP_PROJECT_NAME !== "") {
      // Projects such as NFDI4CHEM. pre-set the target collection on each search
      // This should NOT be included when ontologies are selected.
      searchUrl += `&schema=collection&classification=${process.env.REACT_APP_PROJECT_NAME}`;
    }
    let result: any = await (await fetch(searchUrl, getCallSetting)).json();
    return result;
  }
  catch (e) {
    return [];
  }
}




export async function getJumpToResult(inputData: SuggestAndSelectApiInput, count: number = 10, lang: string = "en"): Promise<BaseSearchSingleResult[]> {
  try {
    inputData['searchUnderIris'] = inputData['searchUnderIris'] ? inputData['searchUnderIris'] : [];
    inputData['searchUnderAllIris'] = inputData['searchUnderAllIris'] ? inputData['searchUnderAllIris'] : [];
    let autocompleteApiBaseUrl: string = process.env.REACT_APP_SEARCH_URL || '';
    autocompleteApiBaseUrl = autocompleteApiBaseUrl.split('search')[0] + "select";
    let url = `${autocompleteApiBaseUrl}?q=${inputData['searchQuery']}&rows=${count}&lang=${lang}`;
    url = inputData['ontologyIds'] ? (url + `&ontology=${inputData['ontologyIds']}`) : url;
    url = inputData['types'] ? (url + `&type=${inputData['types']}`) : url;
    url = inputData['obsoletes'] ? (url + "&obsoletes=true") : url;
    url = inputData['searchUnderIris'].length !== 0 ? (url + `&childrenOf=${inputData.searchUnderIris.join(',')}`) : url;
    url = inputData['searchUnderAllIris'].length !== 0 ? (url + `&allChildrenOf=${inputData.searchUnderAllIris.join(',')}`) : url;
    url = inputData['collectionIds'] ? (url + `&schema=collection&classification=${inputData['collectionIds']}`) : url;
    let result: any = await fetch(url, getCallSetting);
    result = await result.json();
    result = result['response']['docs'];
    return result;
  }
  catch (e) {
    return [];
  }
}



export async function getAutoCompleteResult(inputData: SuggestAndSelectApiInput, count: number = 5, lang: string = "en"): Promise<AutoSuggestSingleResult[]> {
  try {
    let url: string = process.env.REACT_APP_API_URL + `/suggest?q=${inputData['searchQuery']}&rows=${count}&lang=${lang}`;
    url = inputData['ontologyIds'] ? (url + `&ontology=${inputData['ontologyIds']}`) : url;
    url = inputData['types'] ? (url + `&type=${inputData['types']}`) : url;
    url = inputData['obsoletes'] ? (url + "&obsoletes=true") : url;
    url = inputData['collectionIds'] ? (url + `&schema=collection&classification=${inputData['collectionIds']}`) : url;
    let searchResult: any = await fetch(url, getCallSetting);
    searchResult = (await searchResult.json())['response']['docs'];
    return searchResult;
  }
  catch (e) {
    return [];
  }
}
