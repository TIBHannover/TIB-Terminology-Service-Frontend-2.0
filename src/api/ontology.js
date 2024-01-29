import { getCallSetting, size } from "./constants";



class OntologyApi{
    
    constructor(ontologyId=null){
        this.ontologyId = ontologyId
        this.list = []
    }


    async fetchOntologyList (){
        let OntologiesListUrl = process.env.REACT_APP_API_ONTOLOGY_LIST;
        return fetch(OntologiesListUrl, getCallSetting)
          .then((result) => result.json())
          .then((result) => {
            this.list = result['_embedded']['ontologies'];            
          })
          .catch((e) => {
            this.list = [];
          })
      }


}

export default OntologyApi;