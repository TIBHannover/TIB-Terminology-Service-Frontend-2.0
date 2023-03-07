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
        let ontologyId = this.props.ontologyId;
        let listOfTerms = await getListOfTerms(ontologyId, this.state.pageNumber, this.state.pageSize);
        this.setState({
            ontologyId: ontologyId,
            listOfTerms: listOfTerms
        });
    }


    createList(){
        
    }



    render(){
        return(
            <div>
                term list
            </div>
        );
    }

}

export default TermList;