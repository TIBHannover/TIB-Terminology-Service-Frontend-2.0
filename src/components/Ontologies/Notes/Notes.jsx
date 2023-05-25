import React from "react";


class OntologyNotes extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
           notesList: []
        });

        this.getNotesForOntology = this.getNotesForOntology.bind(this);
    }


    getNotesForOntology(){
        let ontologyId = this.props.ontology;
        let url = process.env.REACT_APP_TEST_BACKEND_URL + '/getNotes/' + ontologyId;
        fetch(url).then((resp) => resp.json())
        .then((data) => {        
            this.setState({
                notesList: data['result']
            });
        });
    }

    componentDidMount(){
        this.getNotesForOntology();
    }



    render(){
        return (
            <div className="tree-view-container term-list-container">

            </div>
        );
    }

}

export default OntologyNotes;