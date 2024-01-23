
class TermLib{
    

    static createOntologyTagWithTermURL(ontology_name, termIri, type){
        /* 
            We need the ontology_name as the input since the function is used for
            making tag from "imported from" or "Also In". This is not necessary equivalent with
            the term ontology_name metadata.
            We need type since the term type is not mentioned in a term json metadata.
        */  
        if(!ontology_name){
            return "";
        } 

        let targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(ontology_name);
        if(type === 'class'){
            targetHref += '/terms?iri=' + encodeURIComponent(termIri);       
        }
        else if(type === 'property'){
            targetHref += '/props?iri=' + encodeURIComponent(termIri);        
        }
        else if(type === 'individual'){
            targetHref += '/individuals?iri=' + encodeURIComponent(termIri);
        }

        return[            
            <a href={targetHref} className="btn btn-default ontology-button " target="_blank">
                {ontology_name.toUpperCase()}
            </a>            
        ];                
    }
}

export default TermLib;