import { getCallSetting} from "./constants";


const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE_NUMBER = 1;


class TermApi{
    constructor(ontology, iri, termType){
        this.ontology = ontology;
        this.iri = iri;
        this.termType = termType;
        this.term = {};
    }


    async fetchTerm() {
        try{
            if(this.iri === "%20"){
                // empty iri
                this.term = false;
                return true;
            }  
            let OntologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL + "/";
            let baseUrl = OntologiesBaseServiceUrl + this.ontology + "/" + this.termType;          
            let callResult =  await fetch(baseUrl + "/" + encodeURIComponent(this.iri) , getCallSetting);
        
            if (callResult.status === 404){
                this.term = false;
                return true;
            }
            this.term = await callResult.json();              
            this.term['relations'] = 'N/A';
            this.term['eqAxiom'] = 'N/A';
            this.term['subClassOf'] = 'N/A';
            this.term['relations'] = [];              
            this.term['isIndividual'] = (this.termType === "individuals");
                
            if(this.termType === "terms"){
                let parents = await this.getParents();
                this.term['parents'] = parents;
                await this.fetchClassRelations();
            }       
            
            return true;
        }
        catch(e){
            this.term = {};            
        }
        
    }


    async fetchTermWithoutRelations() {
        try{
            if(this.iri === "%20"){
                // empty iri
                this.term = false;
                return true;
            }  
            let OntologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL + "/";
            let baseUrl = OntologiesBaseServiceUrl + this.ontology + "/" + this.termType;          
            let callResult =  await fetch(baseUrl + "/" + encodeURIComponent(this.iri) , getCallSetting);
        
            if (callResult.status === 404){
                this.term = false;
                return true;
            }
            this.term = await callResult.json();            
            return true;
        }
        catch(e){
            this.term = {};            
        }
        
    }


    async getParents() {
        try{
            if(this.termType === "individuals"){
                return [];
              }
      
              let url = `${process.env.REACT_APP_API_BASE_URL}/${this.ontology}/${this.termType}/${encodeURIComponent(this.iri)}/hierarchicalParents`;         
              let res = await fetch(url, getCallSetting);
              res = await res.json();
              let parents = res["_embedded"][this.termType];
              let result = [];
              for(let p of parents){
                let temp = {"label":p.label, "iri": p.iri, "ontology": p.ontology_name};
                result.push(temp);
              }
              return result;
        }
        catch(e){
            return [];
        }       
    }


    async fetchClassRelations(){        
        let [relations, eqAxiom, subClassOf, instancesList, originalOntology] = await Promise.all([
            this.getRelations(),
            this.getEqAxiom(),
            this.getSubClassOf(),
            this.getIndividualInstancesForClass(),
            this.getClassOriginalOntologyViaShortForm(this.term['short_form'])
      
          ]);
          this.term['relations'] = relations;
          this.term['eqAxiom'] = eqAxiom;
          this.term['subClassOf'] = subClassOf; 
          this.term['instancesList'] = instancesList;
          this.term['originalOntology'] = originalOntology;
          return true;
    }



    async getRelations(){
        try{
            let url = process.env.REACT_APP_API_BASE_URL + '/' + this.ontology + '/terms/' + encodeURIComponent(this.iri) + '/relatedfroms';
            let res = await fetch(url, getCallSetting);
            res = await res.json();
            if (typeof(res) !== "undefined"){
                let entries = Object.entries(res)
                let result = "";
                
                for(let [k,v] of entries){               
                    result += k 
                    result += "<ul>"            
                    for(let item of v){
                        result += '<li>'+ '<a href=' + process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + this.ontology + '/terms?iri=' + encodeURIComponent(item["iri"]) + '>' + item["label"] + '</a>'+ '</li>';
                    }
                    result += "</ul>"      
                }     
                return result
            }

            return "N/A";    
        }
        catch(e){
            return "N/A";
        }                 
    }



    async getEqAxiom(){
        try{
            let url =  process.env.REACT_APP_API_BASE_URL + '/' + this.ontology + '/terms/' + encodeURIComponent(this.iri) + '/equivalentclassdescription';
            let res = await fetch(url, getCallSetting);
            res = await res.json();  
            res = res["_embedded"];
            if (typeof(res) !== "undefined"){
                let resultHtml =  "";
                resultHtml += "<ul>";
                for(let item of res["strings"]){
                    let eqTextWithInternalUrls =  await this.replaceExternalIrisWithInternal(item["content"]);
                    resultHtml += `<li>${eqTextWithInternalUrls}</li>`;
                }
                resultHtml += "</ul>";
                return resultHtml;
            }
            return "N/A";
        }
        catch(e){
            return "N/A";
        }        
    }


    async getSubClassOf(){
        try{
            let url =  process.env.REACT_APP_API_BASE_URL + '/' + this.ontology + '/terms/' + encodeURIComponent(this.iri) + '/superclassdescription';        
            let parents = await this.getParents();
            let subClassRelations = await fetch(url, getCallSetting);
            if(subClassRelations.status === 404){
                return "";
            }
            subClassRelations = await subClassRelations.json();
            subClassRelations = subClassRelations["_embedded"];        
            if(parents.length === 0 && typeof(subClassRelations) === "undefined"){
                return "";
            }
            let result = "<ul>";
            for(let parent of parents){
                let parentUrl = `${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${this.ontology}/terms?iri=${encodeURIComponent(parent["iri"])}`;                
                result += `<li><a href=${parentUrl}>${parent["label"]}</a></li>`;
            }
            if (typeof(subClassRelations) !== "undefined"){                
                for(let subClassString of subClassRelations["strings"]){                    
                    let subClassStringWithInternalIris =  await this.replaceExternalIrisWithInternal(subClassString["content"]);
                    result += `<li>${subClassStringWithInternalIris}</li>`;
                }
            }
            result += "</ul>";
            return result; 
        }
        catch(e){    
            // throw(e)        
            return "";
        }        
    }


    async getIndividualInstancesForClass(){     
        try{
          let baseUrl =  process.env.REACT_APP_API_BASE_URL;
          let callUrl = baseUrl + "/" + this.ontology + "/" + encodeURIComponent(this.iri) + "/terminstances";
          let result = await fetch(callUrl, getCallSetting);
          result = await result.json();
          result = result['_embedded'];
          if(!result || typeof(result['individuals']) === "undefined"){
            return [];
          }
          return result['individuals'];
        }
        catch(e){
          return [];
        }
    }


    async getNodeJsTree(viewMode){
        try{
          let url = process.env.REACT_APP_API_BASE_URL + "/";
          url += this.ontology + "/" + this.termType + "/" + encodeURIComponent(encodeURIComponent(this.iri)) + "/jstree?viewMode=All&siblings=" + viewMode;
          let listOfNodes =  await (await fetch(url, getCallSetting)).json();
          return listOfNodes;
        }
        catch(e){
          return [];
        }
    }
      

      
    async getChildrenJsTree(targetNodeId) {
        let OntologiesBaseServiceUrl =  process.env.REACT_APP_API_BASE_URL;
        let url = OntologiesBaseServiceUrl + "/";
        url += this.ontology + "/" + this.termType + "/" + encodeURIComponent(encodeURIComponent(this.iri)) + "/jstree/children/" + targetNodeId;
        let res =  await (await fetch(url, getCallSetting)).json();
        return res;
    }



    async fetchListOfTerms(page=DEFAULT_PAGE_NUMBER, size=DEFAULT_PAGE_SIZE) {
        try{          
          let url = `${process.env.REACT_APP_API_BASE_URL}/${this.ontology}/${this.termType}?page=${page}&size=${size}`;          
          let result = await (await fetch(url, getCallSetting)).json();              
          let totalTermsCount = result['page']['totalElements'];
          result = result['_embedded'];
          if(!result){
            return [];
          }          
          if(typeof(result[this.termType]) === "undefined"){
            return [];
          }                   
          return {"results": result[this.termType], "totalTermsCount":totalTermsCount };
        }
        catch(e){
            return [];
        }      
    }


    async replaceExternalIrisWithInternal(textWithExternalIris){
        let urlRegex = /<a\s+([^>]*href=["']([^"']+)["'][^>]*)>/gi;
        let match;
        let modifiedText = textWithExternalIris;

        while ((match = urlRegex.exec(textWithExternalIris)) !== null) {
            let [, attributes, href] = match;
            let targetIriType = "terms";
            let termApi = new TermApi(this.ontology, encodeURIComponent(href), targetIriType);
            await termApi.fetchTermWithoutRelations();
            if (!termApi.term) {
                targetIriType = "props";
            }
            let internalUrl = `${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${this.ontology}/${targetIriType}?iri=${href}`;
            modifiedText = modifiedText.replace(match[0], `<a ${attributes.replace(href, internalUrl)}">`);
        }
        return modifiedText;
    }


    async getClassOriginalOntologyViaShortForm(shortForm){
        try{
            let url = `${process.env.REACT_APP_API_URL}/terms/findByIdAndIsDefiningOntology?short_form=${shortForm}`;
            let result = await (await fetch(url, getCallSetting)).json();
            result = result['_embedded']['terms'][0];            
            return result['ontology_name'];
        }
        catch(e){
            return null;
        }
        
    }

}


export default TermApi;