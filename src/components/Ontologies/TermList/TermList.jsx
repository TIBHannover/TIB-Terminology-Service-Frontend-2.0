import React from "react";
import {getListOfTerms, getNodeByIri, getSubClassOf, getEqAxiom} from '../../../api/fetchData';
import Pagination from "../../common/Pagination/Pagination";
import { withRouter } from 'react-router-dom';
import JumpTo from "../JumpTo/Jumpto";
import {createClassListTableHeader, setContributorField} from './hekpers';


class TermList extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            ontologyId: "",
            pageNumber: 0,
            pageSize: localStorage.getItem('termListPageSize') ? localStorage.getItem('termListPageSize') : 20,
            listOfTerms: [],
            totalNumberOfTerms: 0,
            lastLoadedUrl: "",
            mode: "terms",
            iri: null,
            tableBodyContent: "",
            tableIsLoading: true
        });

        this.loadComponent = this.loadComponent.bind(this);
        this.createList = this.createList.bind(this);
        this.pageCount = this.pageCount.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
        this.updateURL = this.updateURL.bind(this);
        this.handlePageSizeDropDownChange = this.handlePageSizeDropDownChange.bind(this);
        this.resetList = this.resetList.bind(this);
        this.storePageSizeInLocalStorage = this.storePageSizeInLocalStorage.bind(this);
    }


    async loadComponent(){        
        let url = new URL(window.location);
        let pageNumberInUrl = url.searchParams.get('page');
        let sizeInUrl = url.searchParams.get('size');
        let iriInUrl = url.searchParams.get('iri');        
        pageNumberInUrl = !pageNumberInUrl ? 1 : parseInt(pageNumberInUrl);
        sizeInUrl = !sizeInUrl ? this.state.pageSize : parseInt(sizeInUrl);
        let ontologyId = this.props.ontology;
        let listOfTermsAndStats = {"results": [], "totalTermsCount":0 };
        if(!iriInUrl){
            listOfTermsAndStats = await getListOfTerms(ontologyId, pageNumberInUrl - 1, sizeInUrl);
            iriInUrl = null;
            sizeInUrl = localStorage.getItem('termListPageSize') ? localStorage.getItem('termListPageSize') : 20;
        }
        else{
            listOfTermsAndStats["results"] = [await getNodeByIri(ontologyId, encodeURIComponent(iriInUrl), this.state.mode)];
            listOfTermsAndStats["totalTermsCount"] = 1;
            pageNumberInUrl = 1;
            sizeInUrl = 1;
        }
        
        this.setState({
            ontologyId: ontologyId,
            listOfTerms: listOfTermsAndStats['results'],
            totalNumberOfTerms: listOfTermsAndStats['totalTermsCount'],
            pageNumber: pageNumberInUrl - 1,
            pageSize: sizeInUrl,
            lastLoadedUrl: window.location.href,
            iri: iriInUrl,
            tableBodyContent: ''
        }, ()=> {
            this.storePageSizeInLocalStorage(sizeInUrl);            
            this.updateURL(pageNumberInUrl, sizeInUrl, iriInUrl);
        });
    }



    storePageSizeInLocalStorage(size){
        if(parseInt(size) !== 1){
            localStorage.setItem('termListPageSize', size);
        }
    }


   
    pageCount () {    
        if (isNaN(Math.ceil(this.state.totalNumberOfTerms / this.state.pageSize))){
            return 0;
        }
        return (Math.ceil(this.state.totalNumberOfTerms / this.state.pageSize))
    }



    handlePagination (value) {
        this.setState({
          pageNumber: value - 1,
          tableIsLoading: true,
          listOfTerms: [],
          tableBodyContent: ""    
        }, ()=> {
            this.updateURL(value, this.state.pageSize);
        })
    }



    handlePageSizeDropDownChange(e){
        let size = parseInt(e.target.value);
        let pageNumber = this.state.pageNumber + 1;
        this.setState({
            pageSize: size,
            tableIsLoading: true,
            listOfTerms: [],
            tableBodyContent: "" 
        }, () => {        
            this.storePageSizeInLocalStorage(size);
            this.updateURL(pageNumber, size);
        });
    }



    resetList(){
        this.setState({
            iri: null,
            pageNumber: 0,
            pageSize: 20,
            tableIsLoading: true,
            listOfTerms: [],
            tableBodyContent: "" 
        }, () => {
            this.storePageSizeInLocalStorage(this.state.pageSize);
            this.updateURL(this.state.pageNumber + 1, this.state.pageSize, this.state.iri);
        });
    }



    updateURL(pageNumber, pageSize, iri=null){
        let currentUrlParams = new URLSearchParams();
        if(iri){
            currentUrlParams.append('iri', iri);
        }
        else{
            currentUrlParams.append('page', pageNumber);
            currentUrlParams.append('size', pageSize);
        }
        this.createList();               
        this.props.history.push(window.location.pathname + "?" + currentUrlParams.toString());
    }



    async createList(){
        let result = [];
        let listOfterms = this.state.listOfTerms;
        let baseUrl = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/';
        for (let term of listOfterms){
            let termTreeUrl = baseUrl + encodeURIComponent(term['ontology_name']) + '/terms?iri=' + encodeURIComponent(term['iri']);
            let subclassOfText = await getSubClassOf(term['iri'], term['ontology_name']);
            let equivalentToText = await getEqAxiom(term['iri'], term['ontology_name']);
            result.push(
                <tr>
                    <td>
                        <a className="table-list-label-anchor"  href={termTreeUrl} target="_blank">
                            {term['label']}
                        </a>                        
                    </td>
                    <td>{term['short_form']}</td>
                    <td>{term['description'] ? term['description'] : ""}</td>
                    <td>{term['annotation']['alternative term'] ? term['annotation']['alternative term'] : "N/A" }</td>
                    <td><span  dangerouslySetInnerHTML={{ __html: subclassOfText }} /></td>
                    <td><span  dangerouslySetInnerHTML={{ __html: equivalentToText }} /></td>
                    <td>{term['annotation']['example of usage'] ? term['annotation']['example of usage'] : "N/A" }</td>
                    <td>{term['annotation']['seeAlso'] ? term['annotation']['seeAlso'] : "N/A" }</td>
                    <td>{setContributorField(term)}</td>
                    <td>{term['annotation']['comment'] ? term['annotation']['comment'] : "N/A" }</td>
                </tr>
            );
        }
        
        if(result.length !== 0){
            this.setState({
                tableBodyContent: result,
                tableIsLoading: false
            });
        }
        
        
    }



    componentDidMount(){
        this.loadComponent();          
    }



    componentDidUpdate(){
        let currentUrl = window.location.href;
        if(currentUrl !== this.state.lastLoadedUrl){
            this.loadComponent();            
        }                
    }


    render(){
        return(
            <div className="tree-view-container term-list-container">
                <div className="row">
                    <div className="col-sm-4">
                        <div className="termlist-jumpto-container  list-header-element">
                            <JumpTo                        
                                ontologyId={this.state.ontologyId}                                
                                isSkos={this.props.isSkos}
                                componentIdentity={this.props.componentIdentity}
                                containerBootstrapClass="col-sm-12"
                            />
                        </div>                    
                    </div>
                    <div className="col-sm-2">
                        {!this.state.iri && 
                            <div className='form-inline list-header-element result-per-page-dropdown-container'>
                                <div class="form-group">
                                <label for="list-result-per-page" className='col-form-label'>Result Per Page</label>
                                <select className='site-dropdown-menu list-result-per-page-dropdown-menu' id="list-result-per-page" value={this.state.pageSize} onChange={this.handlePageSizeDropDownChange}>
                                    <option value={20} key="20">20</option>
                                    <option value={30} key="30">30</option>
                                    <option value={40} key="40">40</option>
                                    <option value={50} key="50">50</option>
                                </select>  
                                </div>                                                                                
                            </div>
                        }
                        {this.state.iri &&                            
                            <button className='btn btn-secondary btn-sm tree-action-btn list-header-element' onClick={this.resetList}>Show All Classes</button> 
                        }
                    </div>
                    <div className="col-sm-3 text-right list-header-element number-of-result-text-container">
                        <b>{"Showing " + (this.state.pageNumber * this.state.pageSize + 1) + " - " + ((this.state.pageNumber + 1) * this.state.pageSize) + " of " + this.state.totalNumberOfTerms + " Classes"}</b>
                    </div>
                    <div className="col-sm-3">
                        <Pagination 
                            clickHandler={this.handlePagination} 
                            count={this.pageCount()}
                            initialPageNumber={this.state.pageNumber + 1}
                        />
                    </div>
                </div>                 
                <div className="row class-list-tablle-holder">                                      
                    <table class="table table-striped term-list-table class-list-table">
                        {createClassListTableHeader()}
                        <tbody>
                            {this.state.tableIsLoading && <div className="isLoading"></div>}
                            {!this.state.tableIsLoading && this.state.tableBodyContent}               
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

export default withRouter(TermList);