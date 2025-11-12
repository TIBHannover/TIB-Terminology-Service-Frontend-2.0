import { useContext, useState } from 'react';
import CopyLinkButton from '../../../common/CopyButton/CopyButton';
import { OntologyPageContext } from '../../../../context/OntologyPageContext';


const PLACE_HOLDER = "N/A"

const OntologyInfoTable = () => {

  const ontologyPageContext = useContext(OntologyPageContext);
  const ontology = ontologyPageContext.ontology;

  const [showExtraAnotation, setShowExtraAnotation] = useState(false);
  const [showExtraAnotationBtnText, setShowExtraAnotationBtnText] = useState("+ Show more information");


  function handleOntologyShowMoreClick() {
    if (showExtraAnotation) {
      setShowExtraAnotationBtnText("+ Show more information");
      setShowExtraAnotation(false);
      return true;
    }

    setShowExtraAnotationBtnText("- Show less");
    setShowExtraAnotation(true);
  }


  function createAnnotations() {
    let annotations = [];
    for (let prop in ontology.annotations) {
      let value = "";
      if (typeof ontology.annotations[prop] === "string") {
        value = ontology.annotations[prop];
      } else {
        value = ontology.annotations[prop].join(',\n')
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

  function createImports(ontologiesIds: string[]) {
    let res = [];
    for (let ontoId of ontologiesIds) {
      res.push(
        <a
          href={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + ontoId}
          className="me-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          {ontoId}
        </a>
      );
    }
    return res;
  }


  function createCollections(collections: string[]) {
    return (
      <ul>
        {
          collections.map((col) => {
            return (
              <li>
                <a
                  href={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies?and=false&sortedBy=title&page=1&size=10&collection=" + col}
                  target='_blank'>
                  {col}
                </a>
              </li>
            )
          })
        }
      </ul>
    );
  }


  function createSubjects(subjects: string[]) {
    let value = [];
    for (let i = 0; i < subjects.length; i++) {
      value.push(subjects[i]);
    }
    return value.join(",\n");
  }


  function createOverview() {
    if (!ontology) {
      return ""
    } else {
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

          <table className="table table-striped ontology-detail-table stour-overview-page-table">
            <tbody>
              <tr>
                <td className="ontology-overview-table-id-column"><b>Version</b></td>
                <td>
                  {ontology.version}
                </td>
              </tr>
              <tr>
                <td className="ontology-overview-table-id-column"><b>VersionIRI</b></td>
                <td>
                  <a href={ontology.versionedUrl} target="_blank" rel="noopener noreferrer">{ontology.versionedUrl}</a>
                  {ontology.versionedUrl
                    ? <CopyLinkButton valueToCopy={ontology.versionedUrl} />
                    : PLACE_HOLDER
                  }
                </td>
              </tr>
              <tr>
                <td className="ontology-overview-table-id-column"><b>IRI</b></td>
                <td>
                  <a href={ontology.iri} className="anchor-in-table" target="_blank"
                    rel="noopener noreferrer">{ontology.iri}</a>
                  {ontology.iri
                    ? <CopyLinkButton valueToCopy={ontology.iri} />
                    : PLACE_HOLDER
                  }
                </td>
              </tr>
              <tr>
                <td className="ontology-overview-table-id-column"><b>HomePage</b></td>
                <td>
                  <a href={ontology.homepage} className="anchor-in-table" target="_blank"
                    rel="noopener noreferrer">{ontology.homepage}</a>
                  {ontology.homepage
                    ? <CopyLinkButton valueToCopy={ontology.homepage} />
                    : PLACE_HOLDER
                  }
                </td>
              </tr>
              <tr>
                <td className="ontology-overview-table-id-column"><b>Issue tracker</b></td>
                <td>
                  <a href={ontology.issueTrackerUrl} className="anchor-in-table" target="_blank" rel="noopener noreferrer">{ontology.issueTrackerUrl}</a>
                  {ontology.issueTrackerUrl
                    ? <CopyLinkButton valueToCopy={ontology.issueTrackerUrl} />
                    : PLACE_HOLDER
                  }
                </td>
              </tr>
              <tr>
                <td className="ontology-overview-table-id-column"><b>License</b></td>
                <td>
                  <a href={ontology.licenseUrl} target="_blank" rel="noopener noreferrer">{ontology.license}</a>
                </td>
              </tr>
              <tr>
                <td className="ontology-overview-table-id-column"><b>Creator</b></td>
                <td>
                  {ontology.creator}
                </td>
              </tr>
              <tr>
                <td className="ontology-overview-table-id-column"><b>Imports</b></td>
                <td>
                  {createImports(ontology.importsFrom)}
                </td>
              </tr>
              {process.env.REACT_APP_PROJECT_ID === "general" &&
                <tr>
                  <td className="ontology-overview-table-id-column"><b>Collections</b></td>
                  <td>
                    {createCollections(ontology.collections)}
                  </td>
                </tr>
              }
              {process.env.REACT_APP_PROJECT_ID === "general" &&
                <tr>
                  <td className="ontology-overview-table-id-column"><b>Subject</b></td>
                  <td>
                    {createSubjects(ontology.subjects)}
                  </td>
                </tr>
              }
              <tr>
                <td className="ontology-overview-table-id-column"><b>Is Skos</b></td>
                <td>
                  {String(ontology.isSkos)}
                </td>
              </tr>


              <tr>
                <td className="ontology-overview-table-id-column"><b>Download</b></td>
                <td>
                  {/*<a
                    href={"https://service.tib.eu/ts4tib/api/ontologies/" + ontology.ontologyId + "/download"}
                    className='btn btn-secondary btn-dark download-ontology-btn'
                    target="_blank"
                  >
                    <i className="fa fa-download"></i>OWL
                  </a>
                  */}
                  <a
                    className='btn btn-secondary btn-dark download-ontology-btn'
                    onClick={async () => {
                      const jsonFile = JSON.stringify(ontology.ontologyJsonData);
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
                    <i className="fa fa-download"></i>Ontology metadata as JSON</a>
                </td>
              </tr>

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
        <a className="show-more-btn stour-overview-page-more-metadata"
          onClick={handleOntologyShowMoreClick}>{showExtraAnotationBtnText}</a>
      </div>
    </div>
  );
}


export default OntologyInfoTable;