import React from 'react'

function OntologyStatsBox (props) {
  const ontology = props.ontology
  if (!ontology || ontology === null) {
    return false
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
