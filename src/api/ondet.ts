import { OndetData, ProcessedDiffTimelineItem } from "./types/ondetTypes";
import { getCallSetting } from "./constants";

class OndetApi {
  async fetchOntologyCommits(rawUrl: string): Promise<Array<ProcessedDiffTimelineItem>> {
    try {
      const versionsURL =
        `${process.env.REACT_APP_DIFF_BACKEND_URL}/api/ondet/sdiffs/commits?uri=` +
        encodeURIComponent(rawUrl);
      let resp = await fetch(versionsURL, getCallSetting);
      return await resp.json();
    } catch (e) {
      return [];
    }
  }

  async fetchOntologyVersion(
    sha: string,
    includeGitDiff = true,
    maxGitDiffBytes?: number
  ): Promise<OndetData> {
    try {
      const params = new URLSearchParams({
        includeGitDiff: String(includeGitDiff),
      });
      if (maxGitDiffBytes !== undefined) {
        params.set("maxGitDiffBytes", String(maxGitDiffBytes));
      }
      const versionsURL = `${process.env.REACT_APP_DIFF_BACKEND_URL}/api/ondet/sdiffs/${encodeURIComponent(sha)}?${params.toString()}`;
      let resp = await fetch(versionsURL, getCallSetting);
      return await resp.json();
    } catch (e) {
      return {} as OndetData;
    }
  }
}

export default OndetApi;
