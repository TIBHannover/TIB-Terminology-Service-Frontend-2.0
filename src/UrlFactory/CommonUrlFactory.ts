import { createBrowserHistory } from "history";
import * as SiteUrlParamNames from "./UrlParamNames";

type UrlParam = { name: string; value: string; updateUrl?: boolean };

class CommonUrlFactory {
  private static emailActivationToken = "";
  static getEmailActivationUrl(): string {
    return (process.env.REACT_APP_PROJECT_SUB_PATH || "") + "/email/activate";
  }

  static getEmailActivationToken(): string {
    const url = new URL(window.location.href);
    if (url.pathname.replace(/\/$/, "") !== this.getEmailActivationUrl()) return "";
    if (url.searchParams.has("token")) {
      this.emailActivationToken = url.searchParams.get("token") || "";
      url.searchParams.delete("token");
      window.history.replaceState(window.history.state, "", url);
    }
    return this.emailActivationToken;
  }

  static getProfileUrl(): string {
    return (process.env.REACT_APP_PROJECT_SUB_PATH || "") + "/myprofile";
  }

  static getFollowedOntologiesUrl(): string {
    return (process.env.REACT_APP_PROJECT_SUB_PATH || "") + "/followed-ontologies";
  }

  static getOntologyUrl(ontologyId: string): string {
    return (process.env.REACT_APP_PROJECT_SUB_PATH || "") + "/ontologies/" + encodeURIComponent(ontologyId);
  }

  static getAdminPanelUrl(): string {
    return (process.env.REACT_APP_PROJECT_SUB_PATH || "") + "/admin-panel";
  }

  baseUrl: string;
  history: ReturnType<typeof createBrowserHistory>;

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

  setParam({ name, value, updateUrl = true }: UrlParam) {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set(name, value);
    let newUrl = this.baseUrl + "?" + searchParams.toString();
    if (updateUrl) {
      this.history.push(newUrl);
    }
    return newUrl;
  }

  deleteParam({ name }: Pick<UrlParam, "name">) {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.delete(name);
    this.history.push(this.baseUrl + "?" + searchParams.toString());
  }

  getParam({ name }: Pick<UrlParam, "name">) {
    let url = new URL(window.location.href);
    let currentParams = url.searchParams;
    return currentParams.get(name);
  }

  getIri() {
    let url = new URL(window.location.href);
    let currentParams = url.searchParams;
    return currentParams.get(SiteUrlParamNames.Iri);
  }

  getCurie() {
    let url = new URL(window.location.href);
    let currentParams = url.searchParams;
    return currentParams.get(SiteUrlParamNames.Curie);
  }

  setIri({ newIri }: { newIri: string }) {
    let url = new URL(window.location.href);
    let currentParams = url.searchParams;
    currentParams.set(SiteUrlParamNames.Iri, newIri);
    this.history.push(this.baseUrl + "?" + currentParams.toString());
  }

  setObsoletes({ value }: { value: string }) {
    let url = new URL(window.location.href);
    url.searchParams.set(SiteUrlParamNames.Obsoletes, value);
    this.history.push(url.toString());
  }
}

export default CommonUrlFactory;
