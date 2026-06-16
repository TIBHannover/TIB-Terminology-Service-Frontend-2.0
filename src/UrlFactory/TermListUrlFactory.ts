import { createBrowserHistory } from "history";
import * as SiteUrlParamNames from "./UrlParamNames";

type TermListUrlFactoryParams = Record<string, any>;

class TermListUrlFactory {
  page: string | null;
  size: string | null;
  iri: string | null;
  baseUrl: string;
  history: ReturnType<typeof createBrowserHistory>;

  constructor() {
    let url = new URL(window.location.href);
    this.page = url.searchParams.get(SiteUrlParamNames.Page);
    this.size = url.searchParams.get(SiteUrlParamNames.Size);
    this.iri = url.searchParams.get(SiteUrlParamNames.Iri);
    this.baseUrl = window.location.pathname;
    this.history = createBrowserHistory();
  }

  update({ iri, page, size, obsoletes }: TermListUrlFactoryParams) {
    let currentUrlParams = new URLSearchParams();
    if (iri) {
      currentUrlParams.set(SiteUrlParamNames.Iri, iri);
    } else {
      currentUrlParams.set(SiteUrlParamNames.Page, page);
      currentUrlParams.set(SiteUrlParamNames.Size, size);
      currentUrlParams.set(SiteUrlParamNames.Obsoletes, obsoletes);
      currentUrlParams.delete(SiteUrlParamNames.Iri);
    }
    this.history.push(this.baseUrl + "?" + currentUrlParams.toString());
  }
}

export default TermListUrlFactory;
