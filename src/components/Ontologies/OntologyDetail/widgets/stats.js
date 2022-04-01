/* eslint-disable react/jsx-filename-extension */
import React from 'react'

function OntologyStatsBox (props) {
  const ontology = props.ontology
  if (!ontology || ontology === null) {
    return false
  }

  return (
    <div id="stats-table-wrapper">
      <h4><b>Metrics</b></h4>
      <table>
        <tbody>
          <tr>
            <td className="ontology-stats-table-prop"><b>Number of Classes</b></td>
            <td>
              {ontology.numberOfTerms}
            </td>
          </tr>
          <tr>
            <td className="ontology-stats-table-prop"><b>Number of Properties</b></td>
            <td>
              {ontology.numberOfProperties}
            </td>
          </tr>
          <tr>
            <td className="ontology-stats-table-prop"><b>Number of Individuals</b></td>
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
