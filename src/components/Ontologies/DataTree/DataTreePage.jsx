import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import NodePage from '../NodePage/NodePage';
import { withRouter } from 'react-router-dom';
import { MatomoWrapper } from '../../Matomo/MatomoWrapper';
import Tree from './Tree';
import JumpTo from '../JumpTo/Jumpto';



class DataTreePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      selectedNodeIri: '',
      showNodeDetailPage: false,
      componentIdentity: "",
      termTree: false,
      propertyTree: false,
      ontologyId: '' 
    })
    this.setComponentData = this.setComponentData.bind(this);
    this.handleTreeNodeSelection = this.handleTreeNodeSelection.bind(this);
  }


  setComponentData(){
    let termTree = "";
    if (this.props.componentIdentity === "term"){
      termTree = true;
    }
    else{
      termTree = false
    }
    this.setState({
      ontologyId: this.props.ontology,
      componentIdentity: this.props.componentIdentity,
      selectedNodeIri: this.props.iri,
      termTree: termTree,
      propertyTree: !termTree
    });
  }


/**
 * The function indicates what should happen when a tree node is selected 
 * Or when an Iri is given in the url
 */
handleTreeNodeSelection(selectedNodeIri, ShowDetailTable){
  this.setState({
    selectedNodeIri: selectedNodeIri,
    showNodeDetailPage: ShowDetailTable
  });
}


componentDidMount(){
  this.setComponentData();
}


render(){
  return(    
     <div className="row tree-view-container"> 
        <div className="col-sm-6 tree-container-left-part">       
          <JumpTo
            ontologyId={this.props.ontology}
            isSkos={this.props.isSkos} 
            componentIdentity={this.props.componentIdentity}         
           />
        <div className='row'>
              <Tree
                rootNodes={this.props.rootNodes}
                componentIdentity={this.props.componentIdentity}
                iri={this.props.iri}
                key={this.props.key}                    
                ontology={this.props.ontology}
                rootNodeNotExist={this.props.rootNodeNotExist}
                iriChangerFunction={this.props.iriChangerFunction}
                lastState={this.props.lastState}
                domStateKeeper={this.props.domStateKeeper}
                isSkos={this.props.isSkos}
                nodeSelectionHandler={this.handleTreeNodeSelection}
                individualViewChanger={""}
              />
        </div>                 
        
        </div>
        {this.state.termTree && this.state.showNodeDetailPage && 
          <div className="col-sm-6 node-table-container">
            <MatomoWrapper>
            <NodePage
              iri={this.state.selectedNodeIri}
              ontology={this.state.ontologyId}
              componentIdentity="term"
              extractKey="terms"
              isSkos={this.props.isSkos}
              isIndividual={false}
            />
            </MatomoWrapper>
        </div>
        }
        {this.state.propertyTree && this.state.showNodeDetailPage && 
          <div className="col-sm-6 node-table-container">
          <MatomoWrapper>
          <NodePage
              iri={this.state.selectedNodeIri}
              ontology={this.state.ontologyId}
              componentIdentity="property"
              extractKey="properties"
              isIndividual={false}
          />
          </MatomoWrapper>
        </div>
        }
    </div>  
  )
}

}

export default withRouter(DataTreePage);



