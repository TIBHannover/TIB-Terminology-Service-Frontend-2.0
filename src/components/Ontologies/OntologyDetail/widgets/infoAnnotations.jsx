import React from 'react'

class InfoAnnotations extends React.Component{
    constructor(props){
        super(props);
        this.setState = ({
            ontologyShowAll: false,
            showMoreLessOntologiesText: "+ Show more information",
            ontologyIriCopied: false,
            ontologyVersionCopied: false,
            ontologyHomepageCopied: false,
            ontologyTrackerCopied: false,
            ontologyObject: this.props.ontology

        })
        this.createAnnotations = this.createAnnotation.bind(this);
        this.handleOntologyShowMoreClick = this.handleOntologyShowMoreClick.bind(this);
        this.formatCreators = this.formatCreators.bind(this);
        this.alphabeticSort = this.alphabeticSort.bind(this);
        this.skosValue = this.skosValue.bind(this);
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

    createAnnotations(){
        let ontology = this.props.ontology;
        let entries = Object.entries(ontology.config.annotations);
        let annotations = [];
        for(let [key,value] of entries){
          annotations.push(
            <tr>
              <td className="ontology-overview-table-id-column"><b>{key}</b></td>
              <td>{(value).join(',\n')}</td>
            </tr>
            )
        }
        return annotations;
      };

    /**
     * Handle the show more button in the ontology facet list
     * @param {*} e 
     */
    handleOntologyShowMoreClick(e){                        
        if(this.state.ontologyShowAll){
            this.setState({
                showMoreLessOntologiesText: "+ Show more information",
                ontologyShowAll: false
            });
        }
        else{
            this.setState({
                showMoreLessOntologiesText: "- Show less",
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
            <div className="ontology-detail-table-wrapper">
                <div className='row'>
                  <div className='col-sm-11 ontology-detail-text'>
                    <h4><b>{}</b></h4>
                    <p>
                     {}
                    </p>
                  </div>
                </div>

            </div>              
            )
        }

}

export default InfoAnnotations