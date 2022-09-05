import React from 'react';
import '../../layout/ontologies.css';
import Grid from '@material-ui/core/Grid';
import queryString from 'query-string'; 
import { getAllOntologies, getCollectionOntologies } from '../../../api/fetchData';
import {BuildCollectionForCard, CreateFacet, ontology_has_searchKey, sortBasedOnKey, createCollectionsCheckBoxes} from './helpers';
import Pagination from "../../common/Pagination/Pagination";



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
      listOfAllCollectionsCheckBoxes: [],
      keywordFilterString: "",
      exclusiveCollections: false
    })
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleFacetCollection = this.handleFacetCollection.bind(this);
    this.getAllCollections = this.getAllCollections.bind(this);
    this.runFacet = this.runFacet.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.filterWordChange = this.filterWordChange.bind(this);
    this.processUrlProps = this.processUrlProps.bind(this);
    this.updateUrl= this.updateUrl.bind(this);
    this.handleSwitchange = this.handleSwitchange.bind(this);
  }


  /**
   * Get the list of all ontologies
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
      }, () => {
        this.processUrlProps(); 
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
   * Process the input parameter in the url.
   * Inputs are used for setting facet filters
   */
   processUrlProps(){
    let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
    let collections = targetQueryParams.collection;
    let sortBy = targetQueryParams.sorting;
    let page = targetQueryParams.page;
    let keywordFilter = targetQueryParams.keyword;
    if(!collections){
      collections = [];
    }
    if(typeof(collections) === "string"){
      collections = [collections];
    }
    if(!keywordFilter){
      keywordFilter = "";
    }
    if(!sortBy){
      sortBy = "numberOfTerms";
    }
    this.setState({
      sortField: sortBy.trim(),
      pageNumber: page
    }, ()=> {
      this.getAllCollections(collections);
      this.runFacet(collections, keywordFilter.trim(), page);
    });    
  }




  /**
   * Get the list of all Collections view (checkboxes)
   */
  getAllCollections(selectedCollections){
    createCollectionsCheckBoxes(this.handleFacetCollection, selectedCollections).then(data => {
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
        let down = (this.state.pageNumber - 1) * this.state.pageSize;
        let up = down + (this.state.pageSize - 1);
        let hiddenStatus = new Array(this.state.ontologies.length).fill(false);
        for (let i = down; i <= up; i++) {
          hiddenStatus[i] = true;
        }
        this.setState({
          ontologiesHiddenStatus: hiddenStatus
        });
        this.updateUrl(this.state.selectedCollections, this.state.keywordFilterString);
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
   * Handle the change in the search box. Calls the filter function
   * This function gets pass to filter word box.
   * @param {*} e
   * @param {*} value
   */
  filterWordChange = (e, value) => {
    this.runFacet(this.state.selectedCollections, e.target.value);    
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
    }, () => {
      this.updateUrl(this.state.selectedCollections, this.state.keywordFilterString);
    })
  }


  /**
   * Handle facet filter for collection
   * @returns 
   */
  handleFacetCollection = (e, value) => {
    let selectedCollections = this.state.selectedCollections;
    let collection = e.target.value.trim(); 
    if(e.target.checked){
      // checked
      selectedCollections.push(collection);
    }
    else{
      // unchecked
      let index = selectedCollections.indexOf(collection);
      selectedCollections.splice(index, 1);
    }
    this.runFacet(selectedCollections, this.state.keywordFilterString);
  }


  /**
   * Handle the switch change between inersection and union
   */
  handleSwitchange(e){
    this.setState({
      exclusiveCollections: !e.target.checked
    }, ()=>{
      this.runFacet(this.state.selectedCollections, this.state.keywordFilterString);      
    });
  }


/**
 * Update the url based on facet values
 */
  updateUrl(selectedCollections, enteredKeyword){    
    this.props.history.push(window.location.pathname);
    let currentUrlParams = new URLSearchParams();

    if(enteredKeyword !== ""){
      currentUrlParams.append('keyword', enteredKeyword);
    }

    if(selectedCollections.length !== 0){
      for(let col of selectedCollections){
        currentUrlParams.append('collection', col);        
      }
      currentUrlParams.append('and', this.state.exclusiveCollections);
    }

    if(this.state.sortField !== "numberOfTerms"){
      currentUrlParams.append('sorting', this.state.sortField);
    }
    
    currentUrlParams.append('page', this.state.pageNumber);
    this.props.history.push(window.location.pathname + "?" + currentUrlParams.toString());
  }



/**
 * 
 */
async runFacet(selectedCollections, enteredKeyword, page=1){
  if (selectedCollections.length === 0 && enteredKeyword === ""){
    // no filter exist
    let preOntologies = this.state.unFilteredOntologies;
    preOntologies = sortBasedOnKey(preOntologies, this.state.sortField);
    let preHiddenStatus = this.state.unFilteredHiddenStatus;
    this.setState({
      selectedCollections: selectedCollections,
      ontologies: preOntologies,
      ontologiesHiddenStatus: preHiddenStatus,
      pageNumber: page,
      keywordFilterString: ""
    }, ()=>{
      this.updateUrl(this.state.selectedCollections, this.state.keywordFilterString);
      this.handlePagination(page);
    });
    return true;
  }
  
  let ontologies = this.state.unFilteredOntologies; 
  let keywordOntologies = [];
  if(enteredKeyword !== ""){
    // run keyword filter    
    for (let i = 0; i < ontologies.length; i++) {
      let ontology = ontologies[i]
      if (ontology_has_searchKey(ontology, enteredKeyword)) {
        keywordOntologies.push(ontology)
      }
    }
    ontologies = keywordOntologies;
  }

  if(selectedCollections.length !== 0){
    // run collection filter
    let collectionOntologies = await getCollectionOntologies(selectedCollections, this.state.exclusiveCollections);
    let collectionFilteredOntologies = [];
    for (let onto of collectionOntologies){
      if(typeof(ontologies.find(o => o.ontologyId === onto.ontologyId)) !== "undefined"){
        collectionFilteredOntologies.push(onto);
      }
    }
    ontologies = collectionFilteredOntologies;
  }


  ontologies =  sortBasedOnKey(ontologies, this.state.sortField);
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
    keywordFilterString: enteredKeyword,
    ontologies: ontologies,
    ontologiesHiddenStatus: hiddenStatus,
    pageNumber: page
  }, ()=>{
    this.updateUrl(this.state.selectedCollections, this.state.keywordFilterString);
    this.handlePagination(page);
  });
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
            <Grid container className="result-card" id={'ontology_' + i} key={item.ontologyId}>
              <Grid item xs={9}>
                <div className="ontology-card-title-section">                            
                  <a  href={'/ontologies/' + item.ontologyId} className='ontology-button btn btn-primary'>{item.ontologyId}</a>
                  <a  href={'/ontologies/' + item.ontologyId} className="ontology-title-text-in-box"><b>{item.config.title}</b></a>
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
                <span className='ontology-meta-data-field-span'>Loaded: {item.loaded.split("T")[0]}</span>
              </Grid>
            </Grid>                    
      )
    }

    return ontologyList
  }


  componentDidMount(){
    this.getAllOntologies();
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
            {CreateFacet(this.filterWordChange, this.state.listOfAllCollectionsCheckBoxes, this.state.keywordFilterString, this.handleSwitchange)}
            <Grid item xs={8} id="ontology-list-grid">
              <Grid container id="ontology-list-top-row">
                <Grid item xs={6}>
                  <br/>
                  <h3 className='h-headers'>Browse Ontologies</h3>
                </Grid>
                <Grid item xs={6}  id="ontologylist-sort-grid">
                  <div>
                    <br/>
                    <label for="ontology-list-sorting">sorted by</label>
                    <select id="ontology-list-sorting" value={this.state.sortField} onChange={this.handleSortChange}>
                      <option value={'numberOfTerms'}>Classes Count</option>
                      <option value={'numberOfProperties'}>Properties Count</option>
                      <option value={'numberOfIndividuals'}>Individuals Count</option>
                    </select>                  
                  </div>          
                </Grid>
              </Grid>              
              {this.createOntologyList()}              
              <Pagination 
                clickHandler={this.handlePagination} 
                count={this.pageCount()}
                initialPageNumber={this.state.pageNumber}               
              />
            </Grid>
          </Grid>
        </div>

      )
    }
  }
}

export default OntologyList
