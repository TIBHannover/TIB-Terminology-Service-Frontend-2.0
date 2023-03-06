import React from 'react'

class InfoAnnotations extends React.Component{
    constructor(props){
        super(props);
        this.setState = ({
            ontologyShowAll: false,
            showMoreLessOntologiesText: "+ Show additional information",
            ontologyIriCopied: false,
            ontologyVersionCopied: false,
            ontologyHomepageCopied: false,
            ontologyTrackerCopied: false,
            ontologyObject: this.props.ontology

        })
        this.createTable = this.createTable.bind(this);
        this.handleOntologyShowMoreClick = this.handleOntologyShowMoreClick.bind(this);
    }

      formatCreators (creators) {
        let answer = []
        let value = []
        for (let i = 0; i < creators.length; i++) {
          value.push(creators[i])
        }
        answer = value.join(',\n')
        return answer
      }
      
      alphabeticSort(item){
         return item.sort();
      }
      
      skosValue(skos){
        return JSON.parse(skos);
      }

    createTable(){
        let ontology = this.props.ontology;
        let entries = Object.entries(ontology.config.annotations);
        let listItems = entries.map(([key, value]) => (
          <div className="ontology-detail-table-wrapper">
            <table className="ontology-detail-table">
                <tbody>
                    <tr>
                      <td style={{width: "150px"}}><b>{key}</b></td>
                      <td>{(value).join(',\n')}</td>
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
                <div className='row'>
                  <div className='col-sm-11 ontology-detail-text'>
                     <h4><b>Annotations</b></h4>
                  </div>
                  {this.createTable()}
                </div>
              )
        }

}

export default InfoAnnotations