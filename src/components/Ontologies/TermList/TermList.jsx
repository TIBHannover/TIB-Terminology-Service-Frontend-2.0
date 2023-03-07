import React from "react";
import {getListOfTerms} from '../../../api/fetchData';


class TermList extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            ontologyId: "",
            pageNumber: 0,
            pageSize: 20,
            listOfTerms: []
        });

        this.loadComponent = this.loadComponent.bind(this);
        this.createList = this.createList.bind(this);
    }


    async loadComponent(){
        let ontologyId = this.props.ontology;
        let listOfTerms = await getListOfTerms(ontologyId, this.state.pageNumber, this.state.pageSize);
        this.setState({
            ontologyId: ontologyId,
            listOfTerms: listOfTerms
        });
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



    render(){
        return(
            <div className="tree-view-container">
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

export default TermList;