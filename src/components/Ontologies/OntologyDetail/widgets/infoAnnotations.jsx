import React from 'react'

class InfoAnnotations extends React.Component{
    constructor(props){
        super(props);
        this.setState = ({

        })
        this.createTable = this.createTable.bind(this);
        this.handleOntologyShowMoreClick = this.handleOntologyShowMoreClick.bind(this);
    }

    createTable(){
        let ontology = this.props.ontology;
        let entries = Object.entries(ontology.config.annotations);
        let listItems = entries.map(([key, value]) => (
          <div className="ontology-detail-table-wrapper">
            <table className="ontology-detail-table">
                <tbody>
                    <tr>
                      <td className="ontology-overview-table-id-column"><b>{key}</b></td>
                      <td>{value}</td>
                    </tr>
                </tbody>
            </table>
           </div>             
        ));
        return <ul>{listItems}</ul>;
      };

    /**
     * Handle the show more button in the ontology facet list
     * @param {*} e 
     */
    handleOntologyShowMoreClick(e){                        
        if(this.state.ontologyShowAll){
            this.setState({
                showMoreLessOntologiesText: "+ Show More",
                ontologyShowAll: false
            });
        }
        else{
            this.setState({
                showMoreLessOntologiesText: "- Show Less",
                ontologyShowAll: true
            });
        }

    }

    componentDidMount(){
        this.createTable();
    }

    componentDidUpdate(){
        this.createTable();
    }


    render(){
        return(
            <div>
              {this.createTable()}
            </div>
        )
    }

}

export default InfoAnnotations