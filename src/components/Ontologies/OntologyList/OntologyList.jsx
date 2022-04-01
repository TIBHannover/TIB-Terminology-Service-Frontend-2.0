import React from 'react'
import PaginationCustom from '../pagination'
import './OntologyList.css'
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'

class OntologyList extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      error: null,
      isLoaded: false,
      ontologies: [],
      pageNumber: 1,
      target: this.props.target,
      pageSize: 5,
      ontologiesHiddenStatus: [],
      ontologyListContent: '',
      unFilteredOntologies: [],
      unFilteredHiddenStatus: [],
      sortField: 'termsCount'
    })
    this.ontologiesAjax()
    this.handlePagination = this.handlePagination.bind(this)
    this.filterFacet = this.filterFacet.bind(this)
    this.handleSortChange = this.handleSortChange.bind(this)
  }

  /**
     * Set the target backend endpoint based the input
     *
     * @param {*} target
     * @returns
     */
  getTargetEndPoint (target) {
    if (target === 'general') { // TIB General
      return '/ontologies'
    } else if (target === 'chemistry') { // NFDI4CHEM
      return '/ontologies/chemistry' // /api/ontologies/chem
    } else if (target === 'engineering') { // NFDI4ING
      return '/ontologies/engineering'
    }
    return ''
  }

  /**
     * Handle the click on the pagination
     * @param {*} value
     */
  handlePagination (value) {
    this.setState({
      pageNumber: value,
      paginationReset: false
    }, () => {
      this.paginationHandler()
    })
  }

  /**
     * Count the number of pages for the pagination
     * @returns
     */
  pageCount () {
    return (Math.ceil(this.state.ontologies.length / this.state.pageSize))
  }

  /**
     * Ajax request to fetch the list of ontologies from the backend
     */
  ontologiesAjax () {
    const url = this.getTargetEndPoint(this.state.target)
    fetch((this.props.url ?? 'http://localhost:8080') + url, {
      method: 'GET', mode: 'cors'
    })
      .then(res => res.json())
      .then(
        (result) => {
          const hiddenStatus = []
          for (let i = 0; i < result.length; i++) {
            if (i < this.state.pageSize) {
              hiddenStatus[i] = true
            } else {
              hiddenStatus[i] = false
            }
          }
          this.setState({
            isLoaded: true,
            ontologies: this.sortBasedOnKey(result, 'termsCount'),
            unFilteredOntologies: this.sortBasedOnKey(result, 'termsCount'),
            ontologiesHiddenStatus: hiddenStatus,
            unFilteredHiddenStatus: hiddenStatus,
            ontologyListContent: this.createOntologyList()

          })
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          })
        }
      )
  }

  /**
       * Handle the pagination change. This function has to be passed to the Pagination component
       */
  paginationHandler () {
    const down = (this.state.pageNumber - 1) * this.state.pageSize
    const up = down + (this.state.pageSize - 1)
    const hiddenStatus = new Array(this.state.ontologies.length).fill(false)
    for (let i = down; i <= up; i++) {
      hiddenStatus[i] = true
    }
    this.setState({
      ontologiesHiddenStatus: hiddenStatus
    })
  }

  /**
       * Handle the change in the search box. Calls the filter function
       *
       * @param {*} e
       * @param {*} value
       */
  filterWordChange = (e, value) => {
    this.filterFacet(e.target.value)
  }

  /**
       * Fiters the list of ontologies
       *
       * @param {*} value
       * @returns
       */
  filterFacet (value) {
    if (value === '') {
      this.setState({
        ontologies: this.state.unFilteredOntologies,
        ontologiesHiddenStatus: this.state.unFilteredHiddenStatus,
        pageNumber: 1
      })
      return true
    }

    const filtered = []
    const hiddenStatus = []
    for (let i = 0; i < this.state.unFilteredOntologies.length; i++) {
      const ontology = this.state.unFilteredOntologies[i]
      if (ontology.name.includes(value) || ontology.description.includes(value)) {
        filtered.push(ontology)
        if (filtered.length <= this.state.pageSize) {
          hiddenStatus.push(true)
        } else {
          hiddenStatus.push(false)
        }
      }
    }
    this.setState({
      ontologies: filtered,
      ontologiesHiddenStatus: hiddenStatus,
      pageNumber: 1
    })
  }

  /**
     * Sort an array of objects based on a key
     *
     * @param {*} array
     * @param {*} key
     * @returns
     */
  sortBasedOnKey (array, key) {
    return array.sort(function (a, b) {
      const x = a[key]; const y = b[key]
      return ((x < y) ? 1 : ((x > y) ? -1 : 0))
    })
  }

  /**
     * Handle the change in the sort dropDown menu
     *
     * @param {*} e
     * @param {*} value
     */
  handleSortChange = (e, value) => {
    const sortedOntology = this.sortBasedOnKey(this.state.ontologies, e.target.value)
    this.setState({
      sortField: e.target.value,
      ontologies: sortedOntology
    })
  }

  /**
     * Create the ontology list view
     *
     * @returns
     */
  createOntologyList () {
    const ontologyList = []
    for (let i = 0; i < this.state.ontologies.length; i++) {
      const item = this.state.ontologies[i]
      ontologyList.push(this.state.ontologiesHiddenStatus[i] &&
                    <Link to={'/ontologies/' + item.id} key={i} className="ontology-card-link">
                      <Grid container className="ontology-card" id={'ontology_' + i} key={item.id}>
                        <Grid item xs={8}>
                          <div className="ontology-card-title">
                            <h4><b>{item.name}</b></h4>
                          </div>
                          <div className="ontology-card-description">
                            <p>{item.description}</p>
                          </div>
                        </Grid>
                        <Grid item xs={4} className="ontology-card-meta-data">
                          <div>
                            <h4>Last Update:</h4>
                            {item.updated}
                            <h4>Classes Count:</h4>
                            {item.termsCount}
                          </div>
                        </Grid>
                      </Grid>
                    </Link>
      )
    }

    return ontologyList
  }

  render () {
    const { error, isLoaded } = this.state
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else {
      return (
        <div id="ontologyList-wrapper-div">
          <Grid container spacing={3}>
            <Grid item xs={3} id="ontologylist-search-grid">
              <TextField
                label="Search..."
                type="search"
                variant="outlined"
                onChange={this.filterWordChange}
                InputLabelProps={{ style: { fontSize: 15 } }}
              />
            </Grid>
            <Grid item xs={5}></Grid>
            <Grid item xs={3} id="ontologylist-sort-grid">
              <InputLabel htmlFor="ontology-sort-dropdown">sorted by</InputLabel>
              <Select
                native
                value={this.state.sortField}
                onChange={this.handleSortChange}
                id="ontology-sort-dropdown"
              >
                <option value={'termsCount'}>Classes Count</option>
                <option value={'updated'}>Recently Updated</option>
                <option value={'individualsCount'}>Individuals Count</option>
                <option value={'propertiesCount'}>Properties Count</option>
              </Select>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={10} id="ontology-list-grid">
              {this.createOntologyList()}
              <PaginationCustom
                count={this.pageCount()}
                clickHandler={this.handlePagination}
                page={this.state.pageNumber}
              />
            </Grid>
          </Grid>
        </div>

      )
    }
  }
}

export default OntologyList
