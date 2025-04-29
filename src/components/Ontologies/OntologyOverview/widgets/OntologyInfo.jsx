import { useContext, useState } from 'react';
import CopyLinkButton from '../../../common/CopyButton/CopyButton';
import { OntologyPageContext } from '../../../../context/OntologyPageContext';
import OntologyLib from '../../../../Libs/OntologyLib';
import Toolkit from '../../../../Libs/Toolkit';


const PLACE_HOLDER = "N/A"

const OntologyInfoTable = () => {

  const ontologyPageContext = useContext(OntologyPageContext);
  const ontology = ontologyPageContext.ontology;

  const [showExtraAnotation, setShowExtraAnotation] = useState(false);
  const [showExtraAnotationBtnText, setShowExtraAnotationBtnText] = useState("+ Show more information");



  function handleOntologyShowMoreClick(e) {
    if (showExtraAnotation) {
      setShowExtraAnotationBtnText("+ Show more information");
      setShowExtraAnotation(false);
      return true;
    }

    setShowExtraAnotationBtnText("- Show less");
    setShowExtraAnotation(true);
  }



  function createAnnotations() {
    let annotationProps = OntologyLib.getAnnotationProperties(ontology);
    let annotations = [];
    for (let prop in annotationProps) {
      let value = "";
      if (Toolkit.isString(annotationProps[prop])) {
        value = annotationProps[prop];
      } else {
        value = annotationProps[prop].join(',\n')
      }
      annotations.push(
        <tr>
          <td className='node-metadata-label'><b>{prop}</b></td>
          <td className='node-metadata-value'>{value}</td>
        </tr>
      );
    }

    if (annotations.length === 0) {
      annotations.push(
        <tr>
          <td colSpan={3}>No additional information available</td>
        </tr>
      );
    }

    return annotations;
  };




  function createOverview() {
    if (!ontology || ontology === null) {
      return ""
    }
    else {
      return (
        <div className="ontology-detail-table-wrapper">
          <div className='row'>
            <div className='col-sm-11 ontology-detail-text'>
              <h4><b>{ontology.title}</b></h4>
              <p>
                {ontology.description}
              </p>
            </div>
          </div>

          <table className="ontology-detail-table stour-overview-page-table" striped="columns">
            <tbody>
              <tr>
                <td className="ontology-overview-table-id-column"><b>Version</b></td>
                <td>
                  {ontology?.["http://www.w3.org/2002/07/owl#versionInfo"]}
                </td>
              </tr>
              <tr>
                <td className="ontology-overview-table-id-column"><b>VersionIRI</b></td>
                <td>
                  <a href={ontology?.["http://www.w3.org/2002/07/owl#versionIRI"]} target="_blank" rel="noopener noreferrer">{ontology?.["http://www.w3.org/2002/07/owl#versionIRI"]}</a>
                  {ontology?.["http://www.w3.org/2002/07/owl#versionIRI"]
                    ? <CopyLinkButton valueToCopy={ontology?.["http://www.w3.org/2002/07/owl#versionIRI"]} />
                    : PLACE_HOLDER
                  }
                </td>
              </tr>
              <tr>
                <td className="ontology-overview-table-id-column"><b>IRI</b></td>
                <td>
                  <a href={ontology.iri} className="anchor-in-table" target="_blank" rel="noopener noreferrer">{ontology.iri}</a>
                  {ontology.iri
                    ? <CopyLinkButton valueToCopy={ontology.iri} />
                    : PLACE_HOLDER
                  }
                </td>
              </tr>
              <tr>
                <td className="ontology-overview-table-id-column"><b>HomePage</b></td>
                <td>
                  <a href={ontology.homepage} className="anchor-in-table" target="_blank" rel="noopener noreferrer">{ontology.homepage}</a>
                  {ontology.homepage
                    ? <CopyLinkButton valueToCopy={ontology.homepage} />
                    : PLACE_HOLDER
                  }
                </td>
              </tr>
              <tr>
                <td className="ontology-overview-table-id-column"><b>Issue tracker</b></td>
                <td>
                  <a href={ontology.tracker} className="anchor-in-table" target="_blank" rel="noopener noreferrer">{ontology.tracker}</a>
                  {ontology.tracker
                    ? <CopyLinkButton valueToCopy={ontology.tracker} />
                    : PLACE_HOLDER
                  }
                </td>
              </tr>
              <tr>
                <td className="ontology-overview-table-id-column"><b>License</b></td>
                <td>
                  <a href={ontology.license.url} target="_blank" rel="noopener noreferrer">{ontology.license.label}</a>
                </td>
              </tr>
              <tr>
                <td className="ontology-overview-table-id-column"><b>Creator</b></td>
                <td>
                  {OntologyLib.formatCreators(ontology["http://purl.org/dc/terms/creator"])}
                </td>
              </tr>
              {process.env.REACT_APP_PROJECT_ID === "general" &&
                <tr>
                  <td className="ontology-overview-table-id-column"><b>Subject</b></td>
                  <td>
                    {OntologyLib.formatSubject(ontology.classifications)}
                  </td>
                </tr>
              }
              <tr>
                <td className="ontology-overview-table-id-column"><b>Is Skos</b></td>
                <td>
                  {String(ontologyPageContext.isSkos)}
                </td>
              </tr>
              {process.env.REACT_APP_PROJECT_ID === "general" &&
                <tr>
                  <td className="ontology-overview-table-id-column"><b>Collections</b></td>
                  <td>
                    <ul>
                      {
                        ontology.classifications[0]['collection'].map((col) => {
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
              }

              {ontology.allow_download == true &&
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
                        const blob = new Blob([jsonFile], { type: 'application/json' });
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
                </tr>
              }
            </tbody>
          </table>
        </div>
      )
    }
  }




  return (
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
      <div className="text-center " id="search-facet-show-more-ontology-btn">
        <a className="show-more-btn stour-overview-page-more-metadata" onClick={handleOntologyShowMoreClick}>{showExtraAnotationBtnText}</a>
      </div>
    </div>
  );
}


export default OntologyInfoTable;