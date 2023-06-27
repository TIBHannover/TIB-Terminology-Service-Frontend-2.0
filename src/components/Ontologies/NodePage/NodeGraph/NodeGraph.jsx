import React from 'react'

class NodeGraph extends React.Component{
    constructor(props){
        super(props)
        this.state = ({
          data: true,
          iri: "",
          iriIsCopied: false,
          prevNode: "",
          componentIdentity: "",
          ontology: "",
          isSkos: false,
          lastRequestedTab: "",
          waiting: false,
          showDataAsJsonBtnHref: ""

        })
        this.setComponentData = this.setComponentData.bind(this);
        this.generateGraph = this.generateGraph.bind(this);
    }

    async setComponentData(){
        let targetIri = this.props.iri;
        let ontology = this.props.ontology;
        let extractKey = this.props.extractKey;
        let componentIdentity = this.props.componentIdentity;
        let isSkos = this.props.isSkos;
        let node = {};
        let showDataAsJsonBtnHref = "";
        if(node.iri){
          this.setState({
            prevNode: node.iri,
            iri: targetIri,
            data: node,
            ontology: ontology,
            iriIsCopied: false,
            componentIdentity: componentIdentity,
            isSkos: isSkos,
            showDataAsJsonBtnHref:showDataAsJsonBtnHref
          });
        }
       
      }

    generateGraph(){
        if(this.props.iri){
            window["initLegacyGraphView"](
                process.env.REACT_APP_API_BASE_URL + `/`+ this.props.ontology + `/terms?iri=` , this.props.iri);
        }
    }

    componentDidMount(){
        this.generateGraph();
    }

    render(){
        return(
            <div id="ontology_vis"/>     
        )
    }

}

export default NodeGraph;