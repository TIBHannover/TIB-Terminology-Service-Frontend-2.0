// Desc: This file is used to get the URL parameters for the IssueList component

import { createBrowserHistory } from "history";
import * as SiteUrlParamNames from "./UrlParamNames";

type IssueListUrlFactoryParams = Record<string, any>;

class IssueListUrlFactory {
  selectedStateId: string | null;
  pageNumber: string | null;
  selectedType: string | null;
  history: ReturnType<typeof createBrowserHistory>;
  baseUrl: string;

  constructor() {
    let url = new URL(window.location.href);
    this.selectedStateId = url.searchParams.get(SiteUrlParamNames.IssueState);
    this.pageNumber = url.searchParams.get(SiteUrlParamNames.Page);
    this.selectedType = url.searchParams.get(SiteUrlParamNames.IssueType);
    this.history = createBrowserHistory();
    this.baseUrl = window.location.pathname;
  }

  update({ pageNumber, stateId, issueType }: IssueListUrlFactoryParams) {
    let currentUrlParams = new URLSearchParams();
    currentUrlParams.set(SiteUrlParamNames.Page, pageNumber);
    currentUrlParams.set(SiteUrlParamNames.IssueState, stateId);
    currentUrlParams.set(SiteUrlParamNames.IssueType, issueType);
    this.history.push(this.baseUrl + "?" + currentUrlParams.toString());
  }
}

export default IssueListUrlFactory;
