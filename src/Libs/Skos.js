import SkosApi from "../api/skos";


class SkosLib{


    static skosTermHasChildren(skosTerm) {        
        try{            
            if(!skosTerm['annotation']['narrower']){
                return false;
            }   
            if(skosTerm['annotation']['narrower'].length === 0){
                return false;
            }
            return true;
        }
        catch(e){
            return false;
        }        
    }



    static shapeSkosMetadata(skosNode, isRootNode=false){
        // map the skos metadata in format of class/properties
        if(isRootNode){
          skosNode = skosNode.data;
        }
        let result = {};
        result["id"] = skosNode.iri;
        result["text"] = skosNode.label;
        result["iri"] = skosNode.iri;        
        result["a_attr"] = {"class" : ""};           
        result['has_children'] =  SkosLib.skosTermHasChildren(result);  
        return result;
    }




    static shapeSkosRootConcepts(rootConcepts){
        // Shape the skos concepts obtained from API to be in a format that data tree can render it like other term trees.                    
        for(let cons of rootConcepts){            
            cons["label"] = cons["data"]["label"];                            
            cons["has_children"] =  SkosLib.skosTermHasChildren(cons['data']);
            cons["iri"] = cons["data"]["iri"];            
        }            
        return true;    
    }

}

export default SkosLib;