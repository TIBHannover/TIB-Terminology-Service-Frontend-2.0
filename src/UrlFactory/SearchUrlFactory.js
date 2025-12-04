import { createBrowserHistory } from "history";
import * as SiteUrlParamNames from "./UrlParamNames";

class SearchUrlFactory {
  constructor() {
    let url = new URL(window.location);
    this.baseUrl = window.location.pathname;
    this.history = createBrowserHistory();
    this.searchQuery = url.searchParams.get(SiteUrlParamNames.SearchQuery);
    this.advancedSearchEnabled = url.searchParams.get(
      SiteUrlParamNames.AdvancedSearchEnabled,
    );
    this.exact = url.searchParams.get(SiteUrlParamNames.Exact);
    this.includeImported = url.searchParams.get(SiteUrlParamNames.IncludeImported);
    this.ontologies = url.searchParams.getAll(SiteUrlParamNames.Ontology);
    this.types = url.searchParams.getAll(SiteUrlParamNames.TermType);
    this.collections = url.searchParams.getAll(SiteUrlParamNames.Collection);
    this.page = url.searchParams.get(SiteUrlParamNames.Page);
    this.size = url.searchParams.get(SiteUrlParamNames.Size);
    this.searchIn = url.searchParams.getAll(SiteUrlParamNames.SearchIn);
    this.searchUnder = url.searchParams.getAll(SiteUrlParamNames.SearchUnder);
    this.searchUnderAll = url.searchParams.getAll(
      SiteUrlParamNames.SearchUnderAll,
    );
    this.advOntologies = url.searchParams.getAll(SiteUrlParamNames.AdvOntology);
    this.fromOntologyPage = url.searchParams.get(SiteUrlParamNames.FromOntologyPage);
  }

  createSearchUrlForAutoSuggestItem({ label, ontologyId, obsoleteFlag, exact, fromOntologyPage }) {
    let searchUrl = new URL(window.location);
    searchUrl.pathname = process.env.REACT_APP_PROJECT_SUB_PATH + "/search";
    searchUrl.searchParams.delete(SiteUrlParamNames.Iri);
    searchUrl.searchParams.delete(SiteUrlParamNames.IssueType);
    searchUrl.searchParams.set(SiteUrlParamNames.SearchQuery, label);
    searchUrl.searchParams.set(SiteUrlParamNames.Page, 1);
    ontologyId && searchUrl.searchParams.set(SiteUrlParamNames.Ontology, ontologyId);
    obsoleteFlag && searchUrl.searchParams.set(SiteUrlParamNames.Obsoletes, obsoleteFlag);
    exact && searchUrl.searchParams.set(SiteUrlParamNames.Exact, exact);
    fromOntologyPage && searchUrl.searchParams.set(SiteUrlParamNames.FromOntologyPage, fromOntologyPage);
    return searchUrl.pathname + searchUrl.search;
  }

  updateAdvancedSearchUrl({
    searchInValues,
    searchUnderTerms,
    searchUnderAllTerms,
  }) {
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.delete(SiteUrlParamNames.SearchIn);
    currentUrlParams.delete(SiteUrlParamNames.SearchUnder);
    currentUrlParams.delete(SiteUrlParamNames.SearchUnderAll);
    // currentUrlParams.delete('advontology');
    for (let meta of searchInValues) {
      currentUrlParams.append(SiteUrlParamNames.SearchIn, meta);
    }

    for (let term of searchUnderTerms) {
      currentUrlParams.append(
        SiteUrlParamNames.SearchUnder,
        encodeURIComponent(JSON.stringify(term)),
      );
    }

    for (let term of searchUnderAllTerms) {
      currentUrlParams.append(
        SiteUrlParamNames.SearchUnderAll,
        encodeURIComponent(JSON.stringify(term)),
      );
    }

    // for(let ontology of selectedOntologies){
    //     currentUrlParams.append('advontology', ontology['id']);
    // }

    this.history.push(this.baseUrl + "?" + currentUrlParams.toString());
  }

  resetAdvancedSearchUrlParams() {
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.delete(SiteUrlParamNames.SearchIn);
    currentUrlParams.delete(SiteUrlParamNames.SearchUnder);
    currentUrlParams.delete(SiteUrlParamNames.SearchUnderAll);
    this.history.push(this.baseUrl + "?" + currentUrlParams.toString());
  }

  decodeSearchQuery() {
    if (this.searchQuery) {
      return decodeURIComponent(this.searchQuery);
    }
    return "";
  }

  setExact({ exact }) {
    let url = new URL(window.location);
    let currentParams = url.searchParams;
    currentParams.set(SiteUrlParamNames.Exact, exact);
    this.history.push(this.baseUrl + "?" + currentParams.toString());
  }

  setIncludeImported({ includeImported }) {
    let url = new URL(window.location);
    let currentParams = url.searchParams;
    currentParams.set(SiteUrlParamNames.IncludeImported, includeImported);
    this.history.push(this.baseUrl + "?" + currentParams.toString());
  }

  setAdvancedSearchEnabled({ enabled }) {
    let url = new URL(window.location);
    let currentParams = url.searchParams;
    currentParams.set(SiteUrlParamNames.AdvancedSearchEnabled, enabled);
    this.history.push(this.baseUrl + "?" + currentParams.toString());
  }

  updateUrlForFacetSelection({ fieldNameInUrl, action, value }) {
    let url = new URL(window.location);
    let currentParams = url.searchParams;
    if (action === "add") {
      currentParams.append(fieldNameInUrl, value);
    } else if (action === "remove") {
      currentParams.delete(fieldNameInUrl, value);
    }
    currentParams.set(SiteUrlParamNames.Page, 1);
    this.history.push(this.baseUrl + "?" + currentParams.toString());
  }

  clearFacetUrlParams() {
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.delete(SiteUrlParamNames.TermType);
    currentUrlParams.delete(SiteUrlParamNames.Ontology);
    currentUrlParams.delete(SiteUrlParamNames.Collection);
    currentUrlParams.set(SiteUrlParamNames.Page, 1);
    currentUrlParams.set(SiteUrlParamNames.Size, 10);
    currentUrlParams.delete(SiteUrlParamNames.FromOntologyPage);
    this.history.push(this.baseUrl + "?" + currentUrlParams.toString());
  }
}

export default SearchUrlFactory;
