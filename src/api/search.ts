import { getCallSetting } from "./constants";
import {
  SearchApiInput,
  SuggestAndSelectApiInput,
  SearchApiResponse,
  BaseSearchSingleResult,
  AutoSuggestSingleResult
} from "./types/searchApiTypes";
import Toolkit from "../Libs/Toolkit";
import { TermFactory } from "../concepts";


export async function olsSearch(inputData: SearchApiInput, jumpToMode: boolean = false): Promise<SearchApiResponse | []> {
  try {
    let lang = Toolkit.getVarInLocalSrorageIfExist('language', 'en');
    let apiBaseUrl: string = process.env.REACT_APP_API_URL!;
    let query = encodeURIComponent(inputData.searchQuery);
    let page = inputData.page ? inputData.page - 1 : 0;
    let size = inputData.size ? inputData.size : 10;
    let searchUrl: string = apiBaseUrl + `/v2/entities?search=${query}&page=${page}&size=${size}&lang=${lang}&exclusive=true`;
    searchUrl = !inputData.includeImported && !inputData.fromOntologyPage ? (searchUrl + "&isDefiningOntology=true") : searchUrl;
    // searchUrl = jumpToMode ? (searchUrl + "&boostFields=label^3") : searchUrl;
    searchUrl = !jumpToMode ? (searchUrl + "&facetFields=type+ontologyId") : searchUrl;
    searchUrl = inputData?.selectedOntologies?.length ? (searchUrl + `&ontology=${inputData?.selectedOntologies?.join(',')}`) : searchUrl;
    searchUrl = inputData?.selectedTypes?.length ? (searchUrl + `&type=${inputData?.selectedTypes?.join(',')}`) : searchUrl;
    searchUrl = inputData?.searchInValues?.length ? (searchUrl + `&searchFields=${inputData?.searchInValues?.join('+')}`) : searchUrl;
    searchUrl = inputData?.searchUnderIris?.length ? (searchUrl + `&childrenOf=${inputData?.searchUnderIris?.join(',')}`) : searchUrl;
    searchUrl = inputData?.searchUnderAllIris?.length ? (searchUrl + `&allChildrenOf=${inputData?.searchUnderAllIris?.join(',')}`) : searchUrl;
    searchUrl = inputData.obsoletes ? (searchUrl + "&includeObsoleteEntities=true") : searchUrl;
    searchUrl = inputData.exact ? (searchUrl + "&exactMatch=true") : searchUrl;
    searchUrl = inputData.isLeaf ? (searchUrl + "&isLeaf=true") : searchUrl;
    if (process.env.REACT_APP_PROJECT_NAME === "" && inputData?.selectedCollections?.length) {
      // If TIB General. Set collections if exist in filter
      searchUrl += `&schema=collection&classification=${inputData?.selectedCollections?.join(',')}&option=COMPOSITE`;
    } else if (inputData?.selectedOntologies?.length === 0 && process.env.REACT_APP_PROJECT_NAME !== "") {
      // Projects such as NFDI4CHEM. pre-set the target collection on each search
      // This should NOT be included when ontologies are selected.
      searchUrl += `&schema=collection&classification=${process.env.REACT_APP_PROJECT_NAME}&option=COMPOSITE`;
    }
    let result: any = await (await fetch(searchUrl, getCallSetting)).json();
    let resultTerms = [];
    for (let el of result["elements"]) {
      let tsTerm = TermFactory.createTermForTS(el);
      resultTerms.push(tsTerm);
    }
    result["elements"] = resultTerms;

    if (jumpToMode) {
      return result['elements'];
    }
    return result;
  } catch (e) {
    return [];
  }
}


export async function getJumpToResult(inputData: SuggestAndSelectApiInput, count: number = 10, lang: string = "en"): Promise<BaseSearchSingleResult[]> {
  try {
    inputData['searchUnderIris'] = inputData['searchUnderIris'] ? inputData['searchUnderIris'] : [];
    inputData['searchUnderAllIris'] = inputData['searchUnderAllIris'] ? inputData['searchUnderAllIris'] : [];
    let autocompleteApiBaseUrl: string = process.env.REACT_APP_SEARCH_URL || '';
    autocompleteApiBaseUrl = autocompleteApiBaseUrl.split('search')[0] + "select";
    let url = `${autocompleteApiBaseUrl}?q=${encodeURIComponent(inputData['searchQuery'])}&rows=${count}&lang=${lang}`;
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
  } catch (e) {
    return [];
  }
}


export async function getAutoCompleteResult(inputData: SuggestAndSelectApiInput, count: number = 5): Promise<AutoSuggestSingleResult[]> {
  try {
    let lang = Toolkit.getVarInLocalSrorageIfExist('language', 'en');
    let url: string = process.env.REACT_APP_API_URL + `/suggest?q=${encodeURIComponent(inputData['searchQuery'])}&rows=${count}&lang=${lang}`;
    url = inputData['ontologyIds'] ? (url + `&ontology=${inputData['ontologyIds']}`) : url;
    url = inputData['types'] ? (url + `&type=${inputData['types']}`) : url;
    url = inputData['obsoletes'] ? (url + "&obsoletes=true") : url;
    url = inputData['collectionIds'] ? (url + `&schema=collection&classification=${inputData['collectionIds']}`) : url;
    let searchResult: any = await fetch(url, getCallSetting);
    searchResult = (await searchResult.json())['response']['docs'];
    return searchResult;
  } catch (e) {
    return [];
  }
}
