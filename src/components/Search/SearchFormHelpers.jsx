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
        targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']) +'/individuals?iri=' + encodeURIComponent(resultItem['iri']);
    }

    if (process.env.REACT_APP_PROJECT_ID === "nfdi4ing"){
        content.push(
            <a href={targetHref} className="container">       
            {(() => { 
                if(resultItem["type"] === 'ontology'){
                    return (
                        <div>
                            {resultItem['label']}
                         <div className="btn btn-default button-in-jumpto ontology-button">{resultItem['ontology_name']}</div>
                        </div>
                    )
                }
                else{
                    return(
                        <div className="jump-autocomplete-item jumpto-result-text">  
                            {resultItem['label']}
                          <div className="btn btn-default button-in-jumpto term-button">{resultItem['short_form']}</div>
                          <div className="btn btn-default button-in-jumpto ontology-button">{resultItem['ontology_name']}</div>
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
                        <div className="jumpto-result-text">
                            {resultItem['label']}
                         <div className="btn btn-default button-in-jumpto jmp-ontology-button">{resultItem['ontology_name']}</div>
                        </div>
                    )
                }
                else{
                    return(
                        <div className="jumpto-result-text">
                            {resultItem['label']}
                          <div className="btn btn-default button-in-jumpto jmp-ontology-button">{resultItem['ontology_name']}</div>
                          <div className="btn btn-default button-in-jumpto jmp-term-button">{resultItem['short_form']}</div>
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