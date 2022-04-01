import React, { Component } from 'react'

// import OntologyList from 'tib-ts-library/dist/ontologyList';
import OntologyList from './OntologyList'

// const url = process.env.BACKEND_URL

class Ontologies extends Component {
  render () {
    return (
      <div>
        <OntologyList />
      </div>
    )
  }
}
export default Ontologies
