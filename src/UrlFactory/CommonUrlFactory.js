import { createBrowserHistory } from "history";
import * as SiteUrlParamNames from './UrlParamNames';



class CommonUrlFactory {
  constructor() {
    this.baseUrl = window.location.pathname;
    this.history = createBrowserHistory();
  }


  getCurrentUrl() {
    let searchParams = new URLSearchParams(window.location.search);
    return window.location.pathname + "?" + searchParams.toString();
  }


  resetUrl() {
    this.history.push(this.baseUrl);
  }


  setParam({ name, value, updateUrl = true }) {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set(name, value);
    let newUrl = this.baseUrl + "?" + searchParams.toString();
    if (updateUrl) {
      this.history.push(newUrl);
    }
    return newUrl;
  }


  deleteParam({ name }) {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.delete(name);
    this.history.push(this.baseUrl + "?" + searchParams.toString());
  }


  getParam({ name }) {
    let url = new URL(window.location);
    let currentParams = url.searchParams;
    return currentParams.get(name);
  }



  getIri() {
    let url = new URL(window.location);
    let currentParams = url.searchParams;
    return currentParams.get(SiteUrlParamNames.Iri);
  }


  setIri({ newIri }) {
    let url = new URL(window.location);
    let currentParams = url.searchParams;
    currentParams.set(SiteUrlParamNames.Iri, newIri);
    this.history.push(this.baseUrl + "?" + currentParams.toString());
  }


  setObsoletes({ value }) {
    let url = new URL(window.location);
    url.searchParams.set(SiteUrlParamNames.Obsoletes, value);
    this.history.push(this.baseUrl + "?" + url.searchParams.toString());
  }
}


export default CommonUrlFactory;