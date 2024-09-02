import {useContext, useState} from 'react';
import CopyLinkButton from '../../../common/CopyButton/CopyButton';
import { OntologyPageContext } from '../../../../context/OntologyPageContext';
import OntologyLib from '../../../../Libs/OntologyLib';


const PLACE_HOLDER = "N/A"

const OntologyInfoTable = () => {

  const ontologyPageContext = useContext(OntologyPageContext); 
  const ontology = ontologyPageContext.ontology;

  const [showExtraAnotation, setShowExtraAnotation] = useState(false);
  const [showExtraAnotationBtnText, setShowExtraAnotationBtnText] = useState("+ Show more information");


  
  function handleOntologyShowMoreClick(e){                        
    if(showExtraAnotation){
      setShowExtraAnotationBtnText("+ Show more information");
      setShowExtraAnotation(false);
      return true;
    }

    setShowExtraAnotationBtnText("- Show less");
    setShowExtraAnotation(true);  
  }



  function createAnnotations(){       
    let entries = Object.entries(ontology.config.annotations);
    let annotations = [];
    if(entries.length !== 0){
      for(let [key,value] of entries){
        annotations.push(
          <tr>
            <td className="ontology-overview-table-id-column"><b>{key}</b></td>
            <td>{(value).join(',\n')}</td>
          </tr>
          )
      }
    }
    else{
      annotations.push(
        <tr>
          <td colSpan={3}>No additional information available</td>
        </tr>
        )
    }
    
    return annotations;
  };




  function createOverview(){        
    if (!ontology || ontology === null) {
        return ""
    }
    else{
        return(
            <div className="ontology-detail-table-wrapper">
              <div className='row'>
                <div className='col-sm-11 ontology-detail-text'>
                   <h4><b>{ontology.config.title}</b></h4>
                   <p>
                     {ontology.config.description}
                   </p>
                </div>
               </div>

               <table className="ontology-detail-table" striped="columns">
                <tbody>
                    <tr>
                      <td className="ontology-overview-table-id-column"><b>Version</b></td>
                      <td>
                        {ontology.config.version}
                      </td>
                    </tr>
                    <tr>
                      <td className="ontology-overview-table-id-column"><b>VersionIRI</b></td>
                      <td>
                        <a href={ontology.config.versionIri} target="_blank" rel="noopener noreferrer">{ontology.config.versionIri}</a>
                        {typeof(ontology.config.versionIri) !== 'undefined' && ontology.config.versionIri !== null
                            ? <CopyLinkButton  valueToCopy={ontology.config.versionIri}  />                                  
                            : PLACE_HOLDER
                         }  
                      </td>
                    </tr>
                    <tr>
                      <td className="ontology-overview-table-id-column"><b>IRI</b></td>
                      <td>
                        <a href={ontology.config.id}  className="anchor-in-table"  target="_blank" rel="noopener noreferrer">{ontology.config.id}</a>
                         {typeof(ontology.config.id) !== 'undefined' && ontology.config.id !== null
                          ? <CopyLinkButton  valueToCopy={ontology.config.id}  />                                       
                          : PLACE_HOLDER
                        }  
                      </td>
                    </tr>
                    <tr>
                      <td className="ontology-overview-table-id-column"><b>HomePage</b></td>
                      <td>
                        <a href={ontology.config.homepage} className="anchor-in-table" target="_blank" rel="noopener noreferrer">{ontology.config.homepage}</a>
                         {typeof(ontology.config.homepage) !== 'undefined' && ontology.config.homepage !== null
                            ? <CopyLinkButton  valueToCopy={ontology.config.homepage}  />                                  
                            : PLACE_HOLDER
                         }               
                       </td>
                    </tr>
                    <tr>
                      <td className="ontology-overview-table-id-column"><b>Issue tracker</b></td>
                      <td>
                        <a href={ontology.config.tracker} className="anchor-in-table" target="_blank" rel="noopener noreferrer">{ontology.config.tracker}</a>
                          {typeof(ontology.config.tracker) !== 'undefined' && ontology.config.tracker !== null
                            ? <CopyLinkButton  valueToCopy={ontology.config.tracker}  />                                 
                            : PLACE_HOLDER
                          }               
                      </td>
                    </tr>
                    <tr>
                      <td className="ontology-overview-table-id-column"><b>License</b></td>
                      <td>
                        <a href={ontology.config.license.url} target="_blank" rel="noopener noreferrer">{ontology.config.license.label}</a>
                      </td>
                    </tr>
                    <tr>
                       <td className="ontology-overview-table-id-column"><b>Creator</b></td>
                       <td>
                         {OntologyLib.formatCreators(ontology.config.creators)}
                       </td>
                    </tr>
                    {process.env.REACT_APP_PROJECT_ID === "general" && 
                      <tr>
                        <td className="ontology-overview-table-id-column"><b>Subject</b></td>
                        <td>
                          {OntologyLib.formatSubject(ontology.config)}
                        </td>
                      </tr>
                    }
                    <tr>
                       <td className="ontology-overview-table-id-column"><b>Is Skos</b></td>
                       <td>
                          {String(ontology.config.skos)}
                       </td>
                    </tr>
                    <tr>
                       <td className="ontology-overview-table-id-column"><b>Collections</b></td>
                       <td>
                        <ul>
                          {
                            ontology.config.classifications[0]['collection'].map((col) => {
                              return (
                                <li>
                                  <a href={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies?and=false&sortedBy=title&page=1&size=10&collection=" + col} target='_blank'>
                                    {col}
                                  </a>
                                </li>
                              )
                            })
                          }
                          </ul>
                       </td>
                    </tr>
                    {ontology.config.allowDownload == true &&
                    <tr>
                       <td className="ontology-overview-table-id-column"><b>Download</b></td>
                       <td>                     
                         <a                
                           href={"https://service.tib.eu/ts4tib/api/ontologies/" + ontology.ontologyId + "/download"}
                           className='btn btn-secondary btn-dark download-ontology-btn'
                           target="_blank"                               
                          >
                          <i class="fa fa-download"></i>OWL
                         </a>
                         <a 
                           className='btn btn-secondary btn-dark download-ontology-btn'                                
                           onClick={async () => {                    
                             const jsonFile = JSON.stringify(ontology);
                             const blob = new Blob([jsonFile],{type:'application/json'});
                             const href = await URL.createObjectURL(blob);
                             const link = document.createElement('a');
                             link.href = href;
                             link.download = ontology.ontologyId + "_metadata.json";
                             document.body.appendChild(link);
                             link.click();
                             document.body.removeChild(link);
                           }}
                          >
                          <i class="fa fa-download"></i>Ontology metadata as JSON</a>
                        </td>
                    </tr> }                                                        
                </tbody>
               </table>
            </div> 
        )
      }
    }




    return(
      <div>
          {createOverview()}
          {showExtraAnotation &&
            <table className="ontology-detail-table">
              <tbody>
                  <tr>
                    <td colSpan={3} id="annotation-heading"><b>Additional information from Ontology source</b></td>
                  </tr>                
                {createAnnotations()}                
              </tbody>
            </table>}
          <div className="text-center" id="search-facet-show-more-ontology-btn">
                      <a className="show-more-btn"  onClick={handleOntologyShowMoreClick}>{showExtraAnotationBtnText}</a>
          </div>
      </div>          
      );
}


export default OntologyInfoTable;