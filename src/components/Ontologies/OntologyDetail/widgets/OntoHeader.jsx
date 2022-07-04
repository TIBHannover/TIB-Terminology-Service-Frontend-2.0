import React from 'react'

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

}
export default OntoHeader;