import { getCallSetting, size } from "./constants";


type AnswerForPageCount = {
    page:{
        totalElements:number
    }
}



export async function getPageCount(apiEndpoint:string):Promise<number>{
    /**
     * Get how many pages of the result exist for an API call.
     */
    let result = await fetch(apiEndpoint, getCallSetting);
    let answer:AnswerForPageCount = await result.json();    
    return Math.ceil( answer['page']['totalElements']/ size);
}


export function sleep(ms:number): Promise<void>{
    return new Promise(resolve => setTimeout(resolve, ms));
}