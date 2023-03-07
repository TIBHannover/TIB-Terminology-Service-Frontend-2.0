import React from "react";
import {getListOfTerms} from '../../../api/fetchData';
import Pagination from "../../common/Pagination/Pagination";
import { withRouter } from 'react-router-dom';


class TermList extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            ontologyId: "",
            pageNumber: 0,
            pageSize: 20,
            listOfTerms: [],
            totalNumberOfTerms: 0,
            lastLoadedUrl: ""
        });

        this.loadComponent = this.loadComponent.bind(this);
        this.createList = this.createList.bind(this);
        this.pageCount = this.pageCount.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
        this.updateURL = this.updateURL.bind(this);
    }


    async loadComponent(){        
        let url = new URL(window.location);
        let pageNumberInUrl =url.searchParams.get('page');        
        pageNumberInUrl = !pageNumberInUrl ? 1 : parseInt(pageNumberInUrl);        
        let ontologyId = this.props.ontology;
        let listOfTermsAndStats = await getListOfTerms(ontologyId, pageNumberInUrl - 1, this.state.pageSize);
        this.setState({
            ontologyId: ontologyId,
            listOfTerms: listOfTermsAndStats['results'],
            totalNumberOfTerms: listOfTermsAndStats['totalTermsCount'],
            pageNumber: pageNumberInUrl - 1,
            lastLoadedUrl: window.location.href
        }, ()=> {
            this.updateURL(pageNumberInUrl);
        });
    }

   
    pageCount () {    
        if (isNaN(Math.ceil(this.state.totalNumberOfTerms / this.state.pageSize))){
            return 0;
        }
        return (Math.ceil(this.state.totalNumberOfTerms / this.state.pageSize))
    }


    handlePagination (value) {
        this.setState({
          pageNumber: value - 1          
        }, ()=> {
            this.updateURL(value);
        })
    }


    updateURL(pageNumber){                
        let currentUrlParams = new URLSearchParams();
        currentUrlParams.append('page', pageNumber);
        this.props.history.push(window.location.pathname + "?" + currentUrlParams.toString());
    }


    createList(){
        let result = [];
        let listOfterms = this.state.listOfTerms;
        let baseUrl = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/';
        for (let term of listOfterms){
            let termTreeUrl = baseUrl + encodeURIComponent(term['ontology_name']) + '/terms?iri=' + encodeURIComponent(term['iri']);
            result.push(
                <tr>
                    <td>
                        <a className="table-list-label-anchor"  href={termTreeUrl} target="_blank">
                            {term['label']}
                        </a>                        
                    </td>
                    <td>{term['short_form']}</td>
                    <td>{term['description'] ? term['description'] : ""}</td>
                </tr>
            );
        }
        return result;
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
            <div className="tree-view-container">
                <div className="row">
                    <div className="col-sm-4">
                        {/* jump to */}
                    </div>
                    <div className="col-sm-2">
                        <div className='form-inline result-per-page-dropdown-container'>
                            <div class="form-group">
                            <label for="list-result-per-page" className='col-form-label'>Result Per Page</label>
                            <select className='site-dropdown-menu list-result-per-page-dropdown-menu' id="list-result-per-page" value={this.state.pageSize}>
                                <option value={20} key="20">20</option>
                                <option value={30} key="30">30</option>
                                <option value={40} key="40">40</option>
                                <option value={50} key="50">50</option>
                            </select>  
                            </div>                                                                                
                        </div>
                    </div>
                    <div className="col-sm-3 text-right">
                        {"Showing " + "20" + " of " + this.state.totalNumberOfTerms + " Classes"}
                    </div>
                    <div className="col-sm-3">
                        <Pagination 
                            clickHandler={this.handlePagination} 
                            count={this.pageCount()}
                            initialPageNumber={this.state.pageNumber + 1}
                        />
                    </div>
                </div>               
                <table class="table table-striped term-list-table">
                    <thead>
                        <tr>                
                            <th scope="col">Label</th>
                            <th scope="col">ID</th>
                            <th scope="col">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.createList()}               
                    </tbody>
                </table>
            </div>
        );
    }

}

export default withRouter(TermList);