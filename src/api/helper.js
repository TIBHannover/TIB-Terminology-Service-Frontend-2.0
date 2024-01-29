import { getCallSetting, size } from "./constants";



export async function getPageCount(apiEndpoint){
    /**
     * Get how many pages of the result exist for an API call.
     */
    let answer = await fetch(apiEndpoint, getCallSetting);
    answer = await answer.json();
    return Math.ceil(answer['page']['totalElements'] / size);
}