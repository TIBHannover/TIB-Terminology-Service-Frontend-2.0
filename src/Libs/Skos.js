import SkosApi from "../api/skos";


class SkosLib{

    static async shapeSkosMetadata(skosNode, isRootNode=false){
        // map the skos metadata in format of class/properties
        if(isRootNode){
          skosNode = skosNode.data;
        }
        let result = {};
        result["id"] = skosNode.iri;
        result["text"] = skosNode.label;
        result["iri"] = skosNode.iri;        
        result["a_attr"] = {"class" : ""};   
        let skosApi = new SkosApi({ontologyId:skosNode.ontology_name, iri:skosNode.iri});
        result['has_children'] = await skosApi.skosTermHasChildren();  
        return result;
    }




    static async shapeSkosRootConcepts(rootConcepts){
        // Shape the skos concepts obtained from API to be in a format that data tree can render it like other term trees.            
        let skosApi = new SkosApi({ontologyId:null, iri:""})
        for(let cons of rootConcepts){            
            cons["label"] = cons["data"]["label"];
            skosApi.ontologyId = cons['data']['ontology_name'];
            skosApi.setIri(cons["data"]["iri"]);                  
            cons["has_children"] = await skosApi.skosTermHasChildren();
            cons["iri"] = cons["data"]["iri"];            
        }            
        return true;    
    }

}

export default SkosLib;