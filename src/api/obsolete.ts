import { getCallSetting} from "./constants";
import { OntologyTermData } from "./types/ontologyTypes";


type ListOfObsolteteTermsResult = {
  results:Array<OntologyTermData>,
  totalTermsCount:number

}


export async function getObsoleteTermsForTermList(ontologyId:string, termType:string, page:string|number, size:string|number):Promise<ListOfObsolteteTermsResult>{
  try{
    let OntologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL;
    let url = OntologiesBaseServiceUrl + "/";  
    url += ontologyId + "/" + termType + "/roots?includeObsoletes=true&size=" + size + "&page=" + page;    
    let res =  await (await fetch(url, getCallSetting)).json();
    console.log(res);
    let totalTermsCount = res['page']['totalElements'];
    res = res['_embedded'];
    return {"results": res['terms'], "totalTermsCount":totalTermsCount };
  }
  catch(e){
    return {"results": [], "totalTermsCount":0};
  }
}










