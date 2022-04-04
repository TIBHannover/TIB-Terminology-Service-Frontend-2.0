import React, { Component } from 'react'
import OntologyList from './OntologyList/OntologyList'

// const url = process.env.BACKEND_URL

class Ontologies extends Component {
  render () {
    return (
      <div>
          <OntologyList> </OntologyList>
      </div>
    )
  }
}
export default Ontologies
