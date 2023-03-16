import React from 'react';
import InfoAnnotations from './widgets/infoAnnotations';
import OntologyStatsBox from './widgets/stats';


class OntologyOverview extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      ontologyShowAll: false,
      showMoreLessOntologiesText: "+ Show More"      
    })
    
    this.handleOntologyShowMoreClick = this.handleOntologyShowMoreClick.bind(this);
  }


  
  handleOntologyShowMoreClick(e){                        
    if(this.state.ontologyShowAll){
        this.setState({
            showMoreLessOntologiesText: "+ Show additional information",
            ontologyShowAll: false
        });
    }
    else{
        this.setState({
            showMoreLessOntologiesText: "- Show less information",
            ontologyShowAll: true
        });
    }

  } 


  render () {
   return(
      <div  key={'ontolofyOverviewPage'} className="row ontology-detail-page-container">        
        <div className='col-sm-9'>
          <InfoAnnotations ontology={this.props.ontology} />
        </div>
        <div className='col-sm-3'>
          <OntologyStatsBox ontology={this.props.ontology} />
        </div>
    </div>
   );
  }
}


export default OntologyOverview;
