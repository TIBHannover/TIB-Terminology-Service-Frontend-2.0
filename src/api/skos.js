import Toolkit from "../Libs/Toolkit";
import { getCallSetting} from "./constants";



class SkosApi{
    constructor({ontologyId, iri}){
        this.ontologyId = ontologyId;
        this.iri = Toolkit.urlNotEncoded(iri) ? encodeURIComponent(encodeURIComponent(iri)) : encodeURIComponent(iri);
        this.rootConcepts = [];
    }


    
    async fetchRootConcepts() {
        try{
          let OntologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL;
          let url = OntologiesBaseServiceUrl + "/" + this.ontologyId  + "/skos/tree?find_roots=SCHEMA&narrower=false&with_children=false&page_size=1000";
          let results =  await (await fetch(url, getCallSetting)).json();
          this.rootConcepts = results;
          return true;
        }
        catch(e){
            this.rootConcepts = [];
            return true;
        }  
      }



}

export default SkosApi;