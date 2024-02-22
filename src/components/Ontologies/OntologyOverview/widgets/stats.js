import { OntologyPageContext } from "../../../../context/OntologyPageContext"
import { useContext } from "react"



const OntologyStatsBox = () => {
  const currentContext = useContext(OntologyPageContext);
  const ontology = currentContext.ontology;

  if (!ontology || ontology === null) {
    return ""
  }

  return (
    <div id="stats-table-wrapper">
      <h4>Metrics</h4>
      <table className="ontology-metric-table">
        <tbody>
          <tr>
            <td className="ontology-overview-table-id-column">Number of Classes</td>
            <td>
              {ontology.numberOfTerms}
            </td>
          </tr>
          <tr>
            <td className="ontology-overview-table-id-column">Number of Properties</td>
            <td>
              {ontology.numberOfProperties}
            </td>
          </tr>
          <tr>
            <td className="ontology-overview-table-id-column">Number of Individuals</td>
            <td>
              {ontology.numberOfIndividuals}
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  )
}

export default OntologyStatsBox
