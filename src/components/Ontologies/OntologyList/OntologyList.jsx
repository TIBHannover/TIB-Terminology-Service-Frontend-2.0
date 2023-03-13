import React from 'react';
import queryString from 'query-string'; 
import { getAllOntologies, getCollectionOntologies } from '../../../api/fetchData';
import {BuildCollectionForCard, CreateFacet, ontology_has_searchKey, createCollectionsCheckBoxes, sortArrayOfObjectBasedOnKey} from './helpers';
import Pagination from "../../common/Pagination/Pagination";
import { Helmet, HelmetProvider } from 'react-helmet-async';



const TITLE_SORT_KEY = "title";
const CLASS_SORT_KEY = "numberOfTerms";
const PROPERT_SORT_KEY = "numberOfProperties";
const INDIVIDUAL_SORT_KEY = "numberOfIndividuals";
// const TIME_SORT_KEY = "";



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
      sortField: TITLE_SORT_KEY,
      selectedCollections: [],
      listOfAllCollectionsCheckBoxes: [],
      keywordFilterString: "",
      exclusiveCollections: false
    })
    this.setComponentData = this.setComponentData.bind(this);
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


   async setComponentData (){    
    try{
      let allOntologies = await getAllOntologies();
      allOntologies = sortArrayOfObjectBasedOnKey(allOntologies, this.state.sortField);
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
        ontologies: allOntologies,
        unFilteredOntologies: allOntologies,
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
      sortBy = TITLE_SORT_KEY;
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
    let ontologies = this.state.ontologies;
    let sortedOntology = sortArrayOfObjectBasedOnKey(ontologies, e.target.value);
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
      // do check
      selectedCollections.push(collection);
      document.getElementById(e.target.id).checked = true;
    }
    else{
      // do uncheck
      let index = selectedCollections.indexOf(collection);
      selectedCollections.splice(index, 1);        
      document.getElementById(e.target.id).checked = false;    
    }
    this.runFacet(selectedCollections, this.state.keywordFilterString);
  }


  /**
   * Handle the switch change between inersection and union
   */
  handleSwitchange(e){
    this.setState({
      exclusiveCollections: e.target.checked
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

    if(this.state.sortField !== TITLE_SORT_KEY){
      currentUrlParams.append('sorting', this.state.sortField);
    }
    
    currentUrlParams.append('page', this.state.pageNumber);
    this.props.history.push(window.location.pathname + "?" + currentUrlParams.toString());
  }



async runFacet(selectedCollections, enteredKeyword, page=1){
  if (selectedCollections.length === 0 && enteredKeyword === "" && this.state.sortField === TITLE_SORT_KEY){
    // no filter exist
    let preOntologies = this.state.unFilteredOntologies;
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

  ontologies = sortArrayOfObjectBasedOnKey(ontologies, this.state.sortField);
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
            <div className="row result-card" id={'ontology_' + i} key={item.ontologyId}>
              <div className='col-sm-9'>
                <div className="ontology-card-title-section">                            
                  <a  href={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + item.ontologyId} className='ontology-button btn btn-primary'>{item.ontologyId}</a>
                  <a  href={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + item.ontologyId} className="ontology-title-text-in-box"><b>{item.config.title}</b></a>
                </div>
                <div className="ontology-card-description">
                  <p>{item.config.description ? item.config.description : ""}</p>
                </div>
                {process.env.REACT_APP_PROJECT_ID === "general" &&
                <div className='ontology-card-collection-name'>
                  <b>Collections:</b>              
                  {item.config.classifications[0]
                    ? BuildCollectionForCard(item.config.classifications[0].collection)
                    : "-"
                    }
                </div>}
              </div>
              <div className="col-sm-3 ontology-card-meta-data">
                <span className='ontology-meta-data-field-span'>{item.numberOfTerms} Classes</span>
                <hr/>
                <span className='ontology-meta-data-field-span'>{item.numberOfProperties} Properties</span>
                <hr />
                <span className='ontology-meta-data-field-span'>Loaded: {item.loaded ? item.loaded.split("T")[0] : "N/A"}</span>
              </div>
            </div>                    
      )
    }

    return ontologyList
  }

  componentDidUpdate(){
    let allCollections = document.getElementsByClassName('collection-checkbox');
    for(let checkbox of allCollections){
      if(checkbox.dataset.ischecked === "true"){
        document.getElementById(checkbox.id).checked = true;
      }
      delete checkbox.dataset.ischecked;
    }
  }
  
  componentDidMount(){
    this.setComponentData();
  }


  render () {    
    const { error, isLoaded } = this.state
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else {
      return (
        <div className='row justify-content-center' id="ontologyList-wrapper-div">
          <HelmetProvider>
            <div>
              <Helmet>
                 <title>Ontologies</title>
              </Helmet>
            </div>
          </HelmetProvider>
          <div className='col-sm-8'>
            <div className='row'>
              {CreateFacet(this.filterWordChange, this.state.listOfAllCollectionsCheckBoxes, this.state.keywordFilterString, this.handleSwitchange)}
              <div className='col-sm-8' id="ontology-list-grid">
                <div className='row' id="ontology-list-top-row">
                  <div className='col-sm-8'>                    
                    <h3 className='h-headers'>Browse Ontologies</h3>
                  </div>
                  <div className='col-sm-4 form-inline'  id="ontologylist-sort-grid">
                    <div class="form-group">
                      <label for="ontology-list-sorting" className='col-form-label'>sorted by</label>
                      <select className='site-dropdown-menu' id="ontology-list-sorting" value={this.state.sortField} onChange={this.handleSortChange}>
                        <option value={TITLE_SORT_KEY} key={TITLE_SORT_KEY}>Alphabetically</option>
                        <option value={CLASS_SORT_KEY} key={CLASS_SORT_KEY}>Classes Count</option>
                        <option value={PROPERT_SORT_KEY} key={PROPERT_SORT_KEY}>Properties Count</option>
                        <option value={INDIVIDUAL_SORT_KEY} key={INDIVIDUAL_SORT_KEY}>Individuals Count</option>
                      </select>  
                    </div>                                                                                
                  </div>
                </div>              
                {this.createOntologyList()}              
                <Pagination 
                  clickHandler={this.handlePagination} 
                  count={this.pageCount()}
                  initialPageNumber={this.state.pageNumber}               
                />
              </div>
            </div>
          </div>          
        </div>

      )
    }
  }
}

export default OntologyList
