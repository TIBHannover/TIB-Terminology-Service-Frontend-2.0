import React from 'react';
import PaginationCustom from '../Pagination/Pagination';
import '../../layout/ontologies.css';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { getAllOntologies } from '../../../api/fetchData';



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
      sortField: 'numberOfTerms'
    })
    this.getAllOntologies()
    this.handlePagination = this.handlePagination.bind(this)
    this.filterFacet = this.filterFacet.bind(this)
    this.handleSortChange = this.handleSortChange.bind(this)
    this.ontology_has_searchKey = this.ontology_has_searchKey.bind(this)
  }



  /**
     * Set the target 
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
     * Get the list of Chem ontologies from TIB ts
     */
  async getAllOntologies () {
    
    try{
      const allOntologies = await getAllOntologies();
      let hiddenStatus = [];
      for (let i = 0; i < allOntologies.length; i++) {
          if (i < this.state.pageSize) {
            hiddenStatus[i] = true
          } else {
            hiddenStatus[i] = false
          }
      }
  
      this.setState({
        isLoaded: true,
        ontologies: this.sortBasedOnKey(allOntologies, this.state.sortField),
        unFilteredOntologies: this.sortBasedOnKey(allOntologies, this.state.sortField),
        ontologiesHiddenStatus: hiddenStatus,
        unFilteredHiddenStatus: hiddenStatus,
        ontologyListContent: this.createOntologyList()
      });
    }

    catch(error){
      this.setState({
        isLoaded: true,
        error
      });
    }
  
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
   * Search in an ontology metadata to check if it contains a value
   * @param {ontology} ontology
   * @param {string} value 
   * @returns boolean
   */
  ontology_has_searchKey(ontology, value){
    try{
      if (ontology.ontologyId.includes(value)) {
        return true;
      }
      if (ontology.config.title.includes(value)) {
        return true;
      }
      if (ontology.config.description.includes(value)) {
        return true;
      }
  
      return false;
    }
    catch (e){
      console.info(e);
      return false;
    }
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
      if (this.ontology_has_searchKey(ontology, value)) {
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
            <Grid container className="ontology-card" id={'ontology_' + i} key={item.ontologyId}>
              <Grid item xs={9}>
                <div className="ontology-card-title">                            
                  <a  href={'/ontologies/' + item.ontologyId} className='ontology-id-tag btn btn-primary'>{item.ontologyId}</a>
                  <b>{item.config.title}</b>
                </div>
                <div className="ontology-card-description">
                  <p>{item.config.description}</p>
                </div>
                <div className='ontology-card-collection-name'>
                  <b>Collections:</b>
                  {item.config.classifications.collection
                   ? item.config.classifications.collection.map((collect, i) => {<span className='ontology-collection-name'>{collect}</span>})
                   : "-"
                   }
                </div>
              </Grid>
              <Grid item xs={3} className="ontology-card-meta-data">
                <span className='ontology-meta-data-field-span'>{item.numberOfTerms} Classes</span>
                <hr/>
                <span className='ontology-meta-data-field-span'>{item.numberOfProperties} Properties</span>
                <hr />
                <span className='ontology-meta-data-field-span'>Last updated <br/> {item.updated.split("T")[0]} </span>          
              </Grid>
            </Grid>                    
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
            <Grid item xs={4} id="ontology-list-facet-grid">
              <h3 className='h4-headers'>Filter</h3>
              <Grid container>
                <Grid item xs={12} id="ontologylist-search-grid">
                  <TextField
                    label="Filter by keyword"
                    type="search"
                    variant="outlined"
                    onChange={this.filterWordChange}
                    InputLabelProps={{ style: { fontSize: 15 } }}
                  />
                </Grid>
              </Grid>
            </Grid>            
            <Grid item xs={8} id="ontology-list-grid">
              <Grid container>
                <Grid item xs={6}>
                  <h3 className='h-headers'>Browse Ontologies</h3>
                </Grid>
                <Grid item xs={6}  id="ontologylist-sort-grid">
                  <div>
                    <InputLabel htmlFor="ontology-sort-dropdown">sorted by</InputLabel>
                    <Select
                      native
                      value={this.state.sortField}
                      onChange={this.handleSortChange}
                      id="ontology-sort-dropdown"
                    >
                      <option value={'numberOfTerms'}>Classes Count</option>
                      <option value={'updated'}>Recently Updated</option>
                      <option value={'numberOfIndividuals'}>Individuals Count</option>
                      <option value={'numberOfProperties'}>Properties Count</option>
                    </Select>
                  </div>          
                </Grid>
              </Grid>              
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
