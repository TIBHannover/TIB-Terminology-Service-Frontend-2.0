import React from 'react';
import Grid from '@material-ui/core/Grid';

class OntoHeader extends React.Component{
    constructor(props){
        super(props)
        this.setState({
            title:"",
            ontologyId: ""
        })
        this.getOntoConfig = this.getOntoConfig.bind(this);

    }
/**
   * Get the ontology detail config
   */
  async getOntoConfig(ontologyId){
    let getConfig = await fetch(`https://service.tib.eu/ts4tib/api/ontologies/` + ontologyId)
    getConfig = (await getConfig.json())['config'];
    this.setState({
      getConfig: getConfig 
    })
  }

  render(){
    return(
        <div container className="onto-title">
            {this.state.getConfig.title}
        </div>
    )
  }

}
export default OntoHeader;