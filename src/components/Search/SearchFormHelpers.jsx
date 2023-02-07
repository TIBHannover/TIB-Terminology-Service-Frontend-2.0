export function setJumpResultButtons(resultItem){
    let content = [];
    let targetHref = "";
    if(resultItem["type"] === 'class'){
        targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']) + '/terms?iri=' + encodeURIComponent(resultItem['iri']);       
    }
    else if(resultItem["type"] === 'property'){
        targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']) +'/props?iri=' + encodeURIComponent(resultItem['iri']);        
    }
    else if(resultItem["type"] === 'ontology'){
        targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']);       
    }
    else if(resultItem["type"] === 'individual'){
        targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']) +'/terms?iri=' + encodeURIComponent(resultItem['iri']);
    }

    if (process.env.REACT_APP_PROJECT_ID === "nfdi4ing"){
        content.push(
            <a href={targetHref} className="container">       
            {(() => { 
                if(resultItem["type"] === 'ontology'){
                    return (
                        <div>
                            {resultItem['label']}
                         <div className="btn btn-default jmp-ontology-button">{resultItem['ontology_prefix']}</div>
                        </div>
                    )
                }
                else{
                    return(
                        <div className="jump-autocomplete-item">  
                            {resultItem['label']}
                          <div className="btn btn-default term-button">{resultItem['short_form']}</div>
                          <div className="btn btn-default ontology-button">{resultItem['ontology_prefix']}</div>
                        </div>
                    )
                }       
                
            })()}                
            </a>
        ); 
    } else {
        content.push(
            <a href={targetHref} className="container">
            <div className="jump-autocomplete-item">         
            {(() => { 
                if(resultItem["type"] === 'ontology'){
                    return (
                        <div>
                            {resultItem['label']}
                         <div className="btn btn-default jmp-ontology-button">{resultItem['ontology_prefix']}</div>
                        </div>
                    )
                }
                else{
                    return(
                        <div>
                            {resultItem['label']}
                          <div className="btn btn-default jmp-ontology-button">{resultItem['ontology_prefix']}</div>
                          <div className="btn btn-default jmp-term-button">{resultItem['short_form']}</div>
                        </div>
                    )
                }       
                
            })()}                
            </div>
            </a>
        ); 
    }
 
    return content;    
}