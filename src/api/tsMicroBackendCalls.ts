import { getTsPluginHeaders } from "./header";
import { TsPluginHeader } from "./types/headerTypes";
import { GitHubIssueJson } from "./types/GitHubApiTypes";
import { ContentReport } from "./types/userTypes";




export async function getOntologyGithubIssueList(
  ontologyIssueTrackerUrl: string,
  issueState: string,
  issueType: string,
  resultCountPerPage = 10,
  pageNumber = 1)
  : Promise<GitHubIssueJson[]> {
  try {
    type ResultType = {
      _result: {
        issues: GitHubIssueJson[];
      };
    };
    let urlPath = ontologyIssueTrackerUrl.split("https://github.com/")[1];
    let endpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/github/issuelist?';
    endpoint += ("path=" + encodeURIComponent(urlPath));
    endpoint += ("&state=" + issueState);
    endpoint += ("&type=" + issueType);
    endpoint += ("&size=" + resultCountPerPage);
    endpoint += ("&page=" + pageNumber);
    let header: TsPluginHeader = getTsPluginHeaders({ withAccessToken: false });
    let resp = await fetch(endpoint, { headers: header });
    let result = await resp.json() as ResultType;
    return result["_result"].issues;
  }
  catch (e) {
    return [];
  }
}



export async function sendResolveRequest(props: { objectType: string, objectId: string, action: string, creatorUsername: string }) {
  try {
    type ResultType = {
      _result: {
        resolved: boolean;
      };
    };
    let { objectType, objectId, action, creatorUsername } = props;
    let headers = getTsPluginHeaders({ withAccessToken: true });
    let formData = {
      objectType: objectType,
      objectId: objectId,
      action: action,
      creatorUsername: creatorUsername
    };
    let resolveUrl = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/report/resolve/';
    let resp = await fetch(resolveUrl, { method: 'POST', headers: headers, body: JSON.stringify(formData) });
    if (!resp.ok) {
      return false;
    }
    let result = await resp.json() as ResultType;
    return result['_result']['resolved'];
  }
  catch (e) {
    return false;
  }
}



export async function getReportList(): Promise<ContentReport[]> {
  try {
    type ResultType = {
      _result: {
        reports: ContentReport[];
      };
    };
    let headers = getTsPluginHeaders({ withAccessToken: true });
    let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/report/list/';
    let resp = await fetch(url, { method: 'GET', headers: headers });
    if (!resp.ok) {
      return [];
    }
    let result = await resp.json() as ResultType;
    return result['_result']['reports'];
  }
  catch (e) {
    return [];
  }
}



export async function getGitRepoTemplates(props: { repoUrl: string, gitUsername: string }) {
  try {
    type ResultType = {
      _result: {
        templates: string[];
      };
    };
    let { repoUrl, gitUsername } = props;
    let headers = getTsPluginHeaders({ withAccessToken: true, isJson: true });
    let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/github/get_issue_templates/';
    let formData = { "repo_url": repoUrl, "username": gitUsername };
    let resp = await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(formData) });
    if (!resp.ok) {
      return false;
    }
    let result = await resp.json() as ResultType;
    return result['_result']['templates'];
  }
  catch (e) {
    return false;
  }
}



export async function submitGitIssue(props: { repoUrl: string, gitUsername: string, issueTitle: string, issueBody: string, issueType: string, ontologyId: string }) {
  try {
    type ResultType = {
      _result: {
        new_issue_url: string;
      }
    };
    let { repoUrl, gitUsername, issueTitle, issueBody, issueType, ontologyId } = props;
    let data = {
      ontology_id: ontologyId,
      username: gitUsername,
      title: issueTitle,
      content: issueBody,
      issueType: issueType,
      repo_url: repoUrl
    };
    let headers = getTsPluginHeaders({ withAccessToken: true });
    let url = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/github/submit_issue/';
    let resp = await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(data) });
    if (!resp.ok) {
      return false;
    }
    let result = await resp.json() as ResultType;
    return result['_result']['new_issue_url'];
  }
  catch (e) {
    return false;
  }
}

