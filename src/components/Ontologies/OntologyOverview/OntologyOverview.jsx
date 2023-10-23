import React from 'react';
import InfoAnnotations from './widgets/infoAnnotations';
import OntologyStatsBox from './widgets/stats';




class OntologyOverview extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      ontologyShowAll: false,
      showMoreLessOntologiesText: "+ Show More",
      showDataAsJsonBtnHref: ""      
    })
    
    this.handleOntologyShowMoreClick = this.handleOntologyShowMoreClick.bind(this);
    this.showOntoJson = this.showOntoJson.bind(this);
  }

  async showOntoJson(){
    let showDataAsJsonBtnHref = "";
    if(this.props.ontology){
      showDataAsJsonBtnHref = process.env.REACT_APP_API_BASE_URL + "/" + this.props.ontology.ontologyId;
    }
    this.setState({
      showDataAsJsonBtnHref: showDataAsJsonBtnHref
    })
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

  componentDidMount(){
    this.showOntoJson();
  }


  render () {
   return(
      <div  key={'ontolofyOverviewPage'} className="row ontology-detail-page-container">        
        <div className='col-sm-9'>
          <InfoAnnotations ontology={this.props.ontology} />
        </div>
        <div className='col-sm-3'>
          <OntologyStatsBox ontology={this.props.ontology} />
          <br></br>          
          <div className='row'>
               <div className='col-sm-12 node-metadata-value'>
                 <a 
                   href={this.state.showDataAsJsonBtnHref} 
                   target='_blank' 
                   rel="noreferrer"
                   className='btn btn-primary btn-dark download-ontology-btn'
                  >
                    Show Ontology Metdata as JSON
                 </a>
               </div>            
             </div>
        </div>
    </div>
   );
  }
}


export default OntologyOverview;
