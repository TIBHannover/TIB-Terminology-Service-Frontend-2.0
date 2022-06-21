import React from 'react';
import PaginationCustom from '../Pagination/Pagination';
import '../../layout/ontologies.css';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { getAllOntologies, getCollectionOntologies } from '../../../api/fetchData';
import {BuildCollectionForCard, CreateFacet, ontology_has_searchKey, sortBasedOnKey, createCollectionsCheckBoxes} from './helpers';



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
      sortField: 'numberOfTerms',
      selectedCollections: [],
      listOfAllCollectionsCheckBoxes: []
    })
    this.handlePagination = this.handlePagination.bind(this);
    this.filterByKeyword = this.filterByKeyword.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleFacetCollection = this.handleFacetCollection.bind(this);
    this.getAllCollections = this.getAllCollections.bind(this);

  }


  /**
   * Get the list of Chem ontologies from TIB ts
   */
   async getAllOntologies () {
    
    try{
      let allOntologies = await getAllOntologies();
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
        ontologies: sortBasedOnKey(allOntologies, this.state.sortField),
        unFilteredOntologies: sortBasedOnKey(allOntologies, this.state.sortField),
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
   * Get the list of all Collections view (checkboxes)
   */
  getAllCollections(){
    createCollectionsCheckBoxes(this.handleFacetCollection).then(data => {
      this.setState({
        listOfAllCollectionsCheckBoxes: data
      });
    });
  }



  /**
     * Handle the click on the pagination
     * This function get pass to the pagination component
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
       * Handle the pagination change. This function has to be passed to the Pagination component
       */
  paginationHandler () {
    let down = (this.state.pageNumber - 1) * this.state.pageSize
    let up = down + (this.state.pageSize - 1)
    let hiddenStatus = new Array(this.state.ontologies.length).fill(false)
    for (let i = down; i <= up; i++) {
      hiddenStatus[i] = true
    }
    this.setState({
      ontologiesHiddenStatus: hiddenStatus
    })
  }


  /**
       * Handle the change in the search box. Calls the filter function
       * This function gets pass to filter word box.
       * @param {*} e
       * @param {*} value
       */
  filterWordChange = (e, value) => {
    this.filterByKeyword(e.target.value)
  }




  /**
       * Fiters the list of ontologies
       *
       * @param {*} value
       * @returns
       */
  filterByKeyword (value) {
    if (value === '') {
      this.setState({
        ontologies: this.state.unFilteredOntologies,
        ontologiesHiddenStatus: this.state.unFilteredHiddenStatus,
        pageNumber: 1
      })
      return true
    }

    let filtered = []
    let hiddenStatus = []
    for (let i = 0; i < this.state.ontologies.length; i++) {
      let ontology = this.state.ontologies[i]
      if (ontology_has_searchKey(ontology, value)) {
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
     * Handle the change in the sort dropDown menu
     *
     * @param {*} e
     * @param {*} value
     */
  handleSortChange = (e, value) => {
    let sortedOntology = sortBasedOnKey(this.state.ontologies, e.target.value)
    this.setState({
      sortField: e.target.value,
      ontologies: sortedOntology
    })
  }


  /**
   * Handle facet filter for collection
   * @returns 
   */
  handleFacetCollection = async (e, value) => {
    let selectedCollections = this.state.selectedCollections;
    let collection = e.target.value.trim(); 
    if(e.target.checked){
      selectedCollections.push(collection);
      let ontologies = await getCollectionOntologies(selectedCollections);
      let hiddenStatus = [];
      for(let i=0; i < ontologies.length; i++){
        if (i <= this.state.pageSize){
          hiddenStatus.push(true);
        }
        else{
          hiddenStatus.push(false);
        }
      }
      this.setState({
        selectedCollections: selectedCollections,
        ontologies: ontologies,
        ontologiesHiddenStatus: hiddenStatus,
        pageNumber: 1
      });
    }
  }



  /**
     * Create the ontology list view
     *
     * @returns
     */
  createOntologyList () {
    let ontologyList = []
    for (let i = 0; i < this.state.ontologies.length; i++) {
      let item = this.state.ontologies[i]
      ontologyList.push(this.state.ontologiesHiddenStatus[i] &&                
            <Grid container className="ontology-card" id={'ontology_' + i} key={item.ontologyId}>
              <Grid item xs={9}>
                <div className="ontology-card-title">                            
                  <a  href={'/ontologies/' + item.ontologyId} className='ontology-id-tag btn btn-primary'>{item.ontologyId}</a>
                  <b>{item.config.title}</b>
                </div>
                <div className="ontology-card-description">
                  <p>{item.config.description ? item.config.description : ""}</p>
                </div>
                <div className='ontology-card-collection-name'>
                  <b>Collections:</b>              
                  {item.config.classifications[0]
                    ? BuildCollectionForCard(item.config.classifications[0].collection)
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


  componentDidMount(){
    this.getAllOntologies();
    this.getAllCollections();
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
            {CreateFacet(this.filterWordChange, this.state.listOfAllCollectionsCheckBoxes)}
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
