import { useState } from 'react';


function formatCreators (creators) {
  let answer = ''
  for (let i = 0; i < creators.length; i++) {
    answer += (creators[i] + ', ')
  }
  return answer
}


function OntologyInfoBox (props) {
  const [ontologyIriCopied, setOntologyIriCopied]  = useState(false);
  const [ontologyVersionCopied, setOntologyVersionCopied]  = useState(false);
  const [ontologyHomepageCopied, setOntologyHomepageCopied]  = useState(false);
  const [ontologyTrackerCopied, setOntologyTrackerCopied]  = useState(false);
  const [ontologyObject, setOntologyObject]  = useState(props.ontology);
  const ontology = props.ontology;
  if (!ontology || ontology === null) {
    return false
  }

  return (
    <div className="ontology-detail-table-wrapper">
      <div className='row'>
        <div className='col-sm-11 ontology-detail-text'>
          <h4><b>{ontology.config.title}</b></h4>
          <p>
            {ontology.config.description}
          </p>
        </div>
      </div>
      
      <table className="ontology-detail-table">
        <tbody>
          <tr>
            <td className="ontology-overview-table-id-column"><b>IRI</b></td>
            <td>
              <a href={ontology.config.id}  className="anchor-in-table"  target="_blank" rel="noopener noreferrer">{ontology.config.id}</a>
              {typeof(ontology.config.id) !== 'undefined' && ontology.config.id !== null
                ? <button 
                    type="button" 
                    class="btn btn-secondary btn-sm copy-link-btn"
                    onClick={() => {                  
                      navigator.clipboard.writeText(ontology.config.id);
                      setOntologyIriCopied(true);
                      setOntologyVersionCopied(false);
                      setOntologyHomepageCopied(false);
                      setOntologyTrackerCopied(false);
                    }}
                    >
                      copy {ontologyIriCopied && <i class="fa fa-check" aria-hidden="true"></i>}
                    </button>          
              : ""
              }              
            </td>
          </tr>         
          <tr>
            <td className="ontology-overview-table-id-column"><b>HomePage</b></td>
            <td>
              <a href={ontology.config.homepage} className="anchor-in-table" target="_blank" rel="noopener noreferrer">{ontology.config.homepage}</a>
              {typeof(ontology.config.homepage) !== 'undefined' && ontology.config.homepage !== null
                  ? <button 
                    type="button" 
                    class="btn btn-secondary btn-sm copy-link-btn"
                    onClick={() => {                  
                      navigator.clipboard.writeText(ontology.config.homepage);
                      setOntologyIriCopied(false);
                      setOntologyVersionCopied(false);
                      setOntologyHomepageCopied(true);
                      setOntologyTrackerCopied(false);
                    }}
                    >
                      copy {ontologyHomepageCopied && <i class="fa fa-check" aria-hidden="true"></i>}
                    </button>  
                : ""
              }              
            </td>
          </tr>
          <tr>
            <td className="ontology-overview-table-id-column"><b>Issue tracker</b></td>
            <td>
              <a href={ontology.config.tracker} className="anchor-in-table" target="_blank" rel="noopener noreferrer">{ontology.config.tracker}</a>
              {typeof(ontology.config.tracker) !== 'undefined' && ontology.config.tracker !== null
                ? <button 
                    type="button" 
                    class="btn btn-secondary btn-sm copy-link-btn"
                    onClick={() => {                  
                      navigator.clipboard.writeText(ontology.config.tracker);
                      setOntologyIriCopied(false);
                      setOntologyVersionCopied(false);
                      setOntologyHomepageCopied(false);
                      setOntologyTrackerCopied(true);
                    }}
                    >
                      copy {ontologyTrackerCopied && <i class="fa fa-check" aria-hidden="true"></i>}
                    </button>  
                : ""
                }              
            </td>
          </tr>         
          <tr>
            <td className="ontology-overview-table-id-column"><b>License</b></td>
            <td>
              <a href={ontology.config.annotations.license} target="_blank" rel="noopener noreferrer">{ontology.config.annotations.license}</a>
            </td>
          </tr>
          <tr>
            <td className="ontology-overview-table-id-column"><b>Creator</b></td>
            <td>
              {formatCreators(ontology.config.creators)}
            </td>
          </tr>
          <tr>
            <td className="ontology-overview-table-id-column"><b>Download</b></td>
            <td>                     
              <a                
                href={"https://service.tib.eu/ts4tib/ontologies/" + ontology.ontologyId + "/download"}
                className='btn btn-primary btn-dark download-ontology-btn'
                target="_blank"                               
                >
                <i class="fa fa-download"></i>OWL
              </a>
              <a 
                className='btn btn-primary btn-dark download-ontology-btn'                                
                  onClick={async () => {                    
                    const jsonFile = JSON.stringify(ontologyObject);
                    const blob = new Blob([jsonFile],{type:'application/json'});
                    const href = await URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = href;
                    link.download = ontologyObject.ontologyId + "_metadata.json";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                <i class="fa fa-download"></i>Ontology metadata as JSON</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default OntologyInfoBox
