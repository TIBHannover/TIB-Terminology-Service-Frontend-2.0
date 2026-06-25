import { createBrowserHistory } from "history";
import * as SiteUrlParamNames from "./UrlParamNames";

type OntologyListUrlFactoryParams = Record<string, any>;

class OntologyListUrlFactory {
  collections: string[];
  subjects: string[];
  sortedBy: string | null;
  page: string | null;
  size: string | null;
  keywordFilter: string | null;
  baseUrl: string;
  history: ReturnType<typeof createBrowserHistory>;

  constructor() {
    let url = new URL(window.location.href);
    this.collections = url.searchParams.getAll(SiteUrlParamNames.Collection);
    this.subjects = url.searchParams.getAll(SiteUrlParamNames.Subject);
    this.sortedBy = url.searchParams.get(SiteUrlParamNames.SortBy);
    this.page = url.searchParams.get(SiteUrlParamNames.Page);
    this.size = url.searchParams.get(SiteUrlParamNames.Size);
    this.keywordFilter = url.searchParams.get(SiteUrlParamNames.KeywordFilter);
    this.baseUrl = window.location.pathname;
    this.history = createBrowserHistory();
  }

  update({
    keywordFilter,
    collections,
    subjects,
    sortedBy,
    page,
    size,
    andOpValue,
  }: OntologyListUrlFactoryParams) {
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.delete(SiteUrlParamNames.KeywordFilter);

    if (keywordFilter !== "") {
      currentUrlParams.set(SiteUrlParamNames.KeywordFilter, keywordFilter);
    }

    currentUrlParams.delete(SiteUrlParamNames.Collection);
    for (let col of collections) {
      currentUrlParams.append(SiteUrlParamNames.Collection, col);
    }
    currentUrlParams.delete(SiteUrlParamNames.Subject);
    for (let subj of subjects) {
      currentUrlParams.append(SiteUrlParamNames.Subject, subj);
    }
    currentUrlParams.set(SiteUrlParamNames.AndOptUrl, andOpValue);
    currentUrlParams.set(SiteUrlParamNames.SortBy, sortedBy);
    currentUrlParams.set(SiteUrlParamNames.Page, page);
    currentUrlParams.set(SiteUrlParamNames.Size, size);
    this.history.push(this.baseUrl + "?" + currentUrlParams.toString());
  }
}

export default OntologyListUrlFactory;
