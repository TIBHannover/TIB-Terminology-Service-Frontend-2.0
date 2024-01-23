
class OntologyLib{
    

    static createOntologyTag(ontology_name){        
        if(!ontology_name){
            return "";
        }
        let targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(ontology_name);               
        return[            
            <a href={targetHref} className="btn btn-default ontology-button " target="_blank">
                {ontology_name.toUpperCase()}
            </a>            
        ];                
    }
}

export default OntologyLib;