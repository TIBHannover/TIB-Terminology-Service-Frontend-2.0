import {OndetData} from "./types/ondetTypes";
import {getCallSetting} from "./constants";

class OndetApi {

    async fetchOntologyCommits(rawUrl: string): Promise<Array<Commit>> {
        try {
            const versionsURL = `${process.env.REACT_APP_DIFF_BACKEND_URL}/api/ondet/sdiffs/commits?uri=` + encodeURIComponent(rawUrl);
            let resp = await fetch(versionsURL, getCallSetting);
            return await resp.json();
        } catch (e) {
            return [];
        }
    }

    async fetchOntologyVersion(sha: string): Promise<OndetData> {
        try {
            const versionsURL = `${process.env.REACT_APP_DIFF_BACKEND_URL}/api/ondet/sdiffs/${encodeURIComponent(sha)}`;
            let resp = await fetch(versionsURL, getCallSetting);
            return await resp.json();
        } catch (e) {
            return {} as OndetData;
        }
    }
}

export default OndetApi;