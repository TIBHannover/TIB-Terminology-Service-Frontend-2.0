import React from 'react'

class NodeWebVowl extends React.Component{
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
        //this.generateGraph = this.generateGraph.bind(this);
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


    render(){
        return(
          <div>
            <iframe
                    title="WebVOWL"
                    style={{ position: 'center', height: '100%', width: '100%', border: 'none', minHeight: '70vh' }}
                    loading="lazy"
                    src={`https://service.tib.eu/webvowl/#iri=${this.props.iri}`}
                  />

          </div>
               
        )
    }

}

export default NodeWebVowl;