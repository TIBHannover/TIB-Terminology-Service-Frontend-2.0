export function setJumpResultButtons(resultItem, obsoletes){
    let content = [];
    let targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']);

    if(resultItem["type"] === 'class'){
        targetHref += '/terms?iri=' + encodeURIComponent(resultItem['iri']) + `&obsoletes=${obsoletes}`;       
    }
    else if(resultItem["type"] === 'property'){
        targetHref += '/props?iri=' + encodeURIComponent(resultItem['iri']) + `&obsoletes=${obsoletes}`;        
    }   
    else if(resultItem["type"] === 'individual'){
        targetHref += '/individuals?iri=' + encodeURIComponent(resultItem['iri']) + `&obsoletes=${obsoletes}`;
    }

    if (process.env.REACT_APP_PROJECT_ID === "nfdi4ing"){
        content.push(
            <a href={targetHref} className="jumto-result-link container">      
            {(() => { 
                if(resultItem["type"] === 'ontology'){
                    return (
                        <div className="jumpto-result-text item-for-navigation">
                            {resultItem['label']}
                            <div className="btn btn-default button-in-jumpto ontology-button">{resultItem['ontology_name']}</div>
                        </div>
                    )
                }
                else{
                    return(
                        <div className="jump-autocomplete-item jumpto-result-text item-for-navigation">  
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
            <a href={targetHref} className="jumto-result-link container">            
            {(() => { 
                if(resultItem["type"] === 'ontology'){
                    return (
                        <div className="jumpto-result-text item-for-navigation">
                            {resultItem['label']}
                         <div className="btn btn-default button-in-jumpto jmp-ontology-button">{resultItem['ontology_name']}</div>
                        </div>
                    )
                }
                else{
                    return(
                        <div className="jumpto-result-text item-for-navigation">
                            {resultItem['label']}
                          <div className="btn btn-default button-in-jumpto jmp-ontology-button">{resultItem['ontology_name']}</div>
                          <div className="btn btn-default button-in-jumpto jmp-term-button">{resultItem['short_form']}</div>
                        </div>
                    )
                }       
                
            })()}            
            </a>
        ); 
    }
 
    return content;    
}
