import { OntologyPageContext } from "../../../../context/OntologyPageContext";
import { useContext } from "react";

const OntologyStatsBox = () => {
  const ontologyPageContext = useContext(OntologyPageContext);
  const ontology = ontologyPageContext.ontology;

  if (!ontology || ontology === null) {
    return "";
  }

  return (
    <div id="stats-table-wrapper">
      <h4>Metrics</h4>
      <table className="ontology-metric-table stour-overview-page-stats">
        <tbody>
          <tr>
            <td className="ontology-overview-table-id-column">
              Number of Classes
            </td>
            <td>{ontology.numberOfClasses}</td>
          </tr>
          <tr>
            <td className="ontology-overview-table-id-column">
              Number of Properties
            </td>
            <td>{ontology.numberOfProperties}</td>
          </tr>
          <tr>
            <td className="ontology-overview-table-id-column">
              Number of Individuals
            </td>
            <td>{ontology.numberOfIndividuals}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OntologyStatsBox;
