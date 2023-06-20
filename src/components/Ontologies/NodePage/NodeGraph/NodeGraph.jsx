import React from 'react'

class NodeGraph extends React.Component{
    constructor(props){
        super(props)
        this.state = ({
          data: true,
          iriIsCopied: false,
          prevNode: "",
          componentIdentity: "",
          isSkos: false,
          lastRequestedTab: "",
          waiting: false,
          showDataAsJsonBtnHref: ""

        })
        this.setComponentData = this.setComponentData.bind(this);
    }

    async setComponentData(){
        let targetIri = this.props.iri;
        let ontology = this.props.ontology;
        let extractKey = this.props.extractKey;
        let componentIdentity = this.props.componentIdentity;
        let isSkos = this.props.isSkos;
        let node = {};
        let showDataAsJsonBtnHref = "";
        if(isSkos){
          node = await getSkosNodeByIri(ontology, encodeURIComponent(targetIri));
          showDataAsJsonBtnHref = process.env.REACT_APP_API_BASE_URL + "/" + node.ontology_name + "/individuals" + "?iri=" + encodeURIComponent(node.iri);
        }
        else{      
          node = await getNodeByIri(ontology, encodeURIComponent(targetIri), extractKey, this.props.isIndividual);
          showDataAsJsonBtnHref = process.env.REACT_APP_API_BASE_URL + "/" + node.ontology_name + "/" + extractKey + "?iri=" + encodeURIComponent(node.iri);
        }
        if(node.iri){
          this.setState({
            prevNode: node.iri,
            data: node,
            iriIsCopied: false,
            componentIdentity: componentIdentity,
            isSkos: isSkos,
            showDataAsJsonBtnHref:showDataAsJsonBtnHref
          });
        }
       
      }

    render(){
        return(
            <div>
                Graph view 
            </div>
        )
    }

}

export default NodeGraph;