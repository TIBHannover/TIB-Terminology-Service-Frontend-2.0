import { getCallSetting, size } from "./constants";
import { getPageCount } from "./helper";



class OntologyApi{
    
    constructor({ontologyId=null}){
        this.ontologyId = ontologyId;
        this.list = [];
        this.ontology = null;
        this.rootClasses = [];
        this.rootProperties = [];
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
      try{
        let url =  process.env.REACT_APP_API_BASE_URL + '/' + encodeURIComponent(this.ontologyId);
        let result = await fetch(url, getCallSetting);
        result = await result.json();
        this.ontology = result;
        await Promise.all([
          this.getOntologyRootTerms(),
          this.getOntologyRootProperties()
        ]);
        return true; 

      } 
      catch(e){
        this.ontology = null;
        return true;
      }       
    }



    async getOntologyRootTerms() {
      try{
        if(!this.ontology){
          this.rootClasses = [];
          return true;
        } 
        let termsLink = this.ontology['_links']['terms']['href'];
        let pageCount = await getPageCount(termsLink + '/roots');
        let terms = [];    
        for(let page=0; page < pageCount; page++){
            let url = termsLink + "/roots?page=" + page + "&size=" + size;      
            let res =  await (await fetch(url, getCallSetting)).json();
            if(page == 0){
                terms = res['_embedded']['terms'];
            }
            else{
                terms = terms.concat(res['_embedded']['terms']);
            }      
        }
        
        this.rootClasses = terms;
        return true;
      
      }
      catch(e){
        this.rootClasses = [];
        return true;
      }
      
  }


  async  getOntologyRootProperties() {
    try{
      if(!this.ontology){
        this.rootProperties = [];
        return true;
      } 
      let propertiesLink = this.ontology['_links']['properties']['href'];
      let pageCount = await getPageCount(propertiesLink + '/roots');
      let props = [];
      for(let page=0; page < pageCount; page++){
          let url = propertiesLink + "/roots?page=" + page + "&size=" + size;      
          let res =  await (await fetch(url, getCallSetting)).json();
          if(page == 0){
            props = res['_embedded']['properties'];
          }
          else{
            props = props.concat(res['_embedded']['properties']);
          }      
      }
      
      this.rootProperties = props;
      return true;
  
    }
    catch(e){      
      this.rootProperties = [];
      return true;
    }
    
  }


}

export default OntologyApi;