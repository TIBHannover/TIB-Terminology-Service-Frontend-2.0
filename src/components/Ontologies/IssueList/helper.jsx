export function createIssueTitle(issue) {
  return [
    <a href={issue['html_url']} className="git-issue-title stour-github-issue-title" target={"_blank"}>{issue['title']}</a>
  ];
}


export function createLabelTags(labelsList) {
  let result = [];
  for (let label of labelsList) {
    result.push(
      <span className="git-issue-label-tag" style={{ backgroundColor: "#" + label['color'] }}>
        <a href={formatLabelUrl(label['url'])} className="git-issue-tag-link" target={"_blank"}>
          {label['name']}
        </a>
      </span>
    );
  }
  return result;
}


export function createIssueDescription(issue) {
  return [
    <div>
      <small className="stour-github-issue-number">
        {"#" + issue['number'] + " opened on " + issue['created_at'].split("T")[0] + " by " + issue['user']['login']}
      </small>
    </div>
  ];
}



export function setTypeRadioBtn(selectedType) {
  if (selectedType === "issue") {
    let radioBtn = document.getElementById("issue_radio");
    radioBtn.checked = true;
  }
  else {
    let radioBtn = document.getElementById("pr_radio");
    radioBtn.checked = true;
  }
}


function formatLabelUrl(labelApiUrl) {
  let gitHubBaseUrl = "https://github.com/";
  let urlPath = labelApiUrl.split("/repos/")[1];
  return gitHubBaseUrl + urlPath
}