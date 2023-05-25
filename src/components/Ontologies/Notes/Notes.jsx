import React from "react";


class OntologyNotes extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
           notesList: []
        });

        this.getNotesForOntology = this.getNotesForOntology.bind(this);
        this.createNotesList = this.createNotesList.bind(this);
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


    createNotesList(){
        let notes = this.state.notesList;
        let result = [];
        for(let note of notes){            
            result.push(
                <div className="row">
                    <div className="col-sm-12 note-list-card">
                        <a href='#' className="note-list-title">{note['title']}</a>                        
                        <br/>
                        <small>
                            <ul className="">
                                <li>type: {note['component']}</li>
                                <li>iri: {note['target_iri']}</li>
                            </ul>                            
                        </small>
                        <div>
                            <small>
                                {" opened on " + note['created_at'] + " by " + note['creator_user']}
                            </small>
                        </div>

                    </div>
                </div>
            );
        }
        return result;

    }



    componentDidMount(){
        this.getNotesForOntology();
    }



    render(){
        return (
            <div className="tree-view-container notes-container">
                <div className="row">
                    <div className="col-sm-8">
                        {this.createNotesList()}
                    </div>
                </div>
            </div>
        );
    }

}

export default OntologyNotes;