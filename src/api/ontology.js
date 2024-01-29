import { getCallSetting, size } from "./constants";



class OntologyApi{
    
    constructor({ontologyId=null}){
        this.ontologyId = ontologyId;
        this.list = [];
        this.ontology = null;
    }


    async fetchOntologyList (){
        let OntologiesListUrl = process.env.REACT_APP_API_ONTOLOGY_LIST;
        fetch(OntologiesListUrl, getCallSetting)
          .then((result) => result.json())
          .then((result) => {
            this.list = result['_embedded']['ontologies'];            
          })
          .catch((e) => {
            this.list = [];
          })
        return true;
    }



    async fetchOntology() {
        let url =  process.env.REACT_APP_API_BASE_URL + '/' + encodeURIComponent(this.ontologyId);
        fetch(url, getCallSetting)
          .then((result) => result.json())
          .then((result) => {
            this.ontology = result;
          })
          .catch((e) => {
            this.ontology = null;
          })
        return true;
    }


}

export default OntologyApi;