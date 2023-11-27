import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import NodePage from '../NodePage/NodePage';
import { withRouter } from 'react-router-dom';
import { MatomoWrapper } from '../../Matomo/MatomoWrapper';
import Tree from './Tree';
import JumpTo from '../JumpTo/Jumpto';
import PaneResize from '../../common/PaneResize/PaneResize';




class DataTreePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      selectedNodeIri: '',      
      showDetailTable: false,      
      termTree: false,
      propertyTree: false,
      ontologyId: ''
    })
    this.paneResize = new PaneResize();
    this.setComponentData = this.setComponentData.bind(this);
    this.handleTreeNodeSelection = this.handleTreeNodeSelection.bind(this);
    this.handleResetTreeEevent = this.handleResetTreeEevent.bind(this);
  }


  setComponentData(){
    let termTree = "";
    if (this.props.componentIdentity === "terms"){
      termTree = true;
    }
    else{
      termTree = false
    }
    this.setState({
      ontologyId: this.props.ontology.ontologyId,      
      selectedNodeIri: this.props.iri,
      termTree: termTree,
      propertyTree: !termTree
    });
  }


  handleTreeNodeSelection(selectedNodeIri, ShowDetailTable){
    if(this.props.componentIdentity === "terms"){
      this.setState({
        selectedNodeIri: selectedNodeIri,        
        showDetailTable: ShowDetailTable
      });
    }
    else{
      this.setState({
        selectedNodeIri: selectedNodeIri,        
        showDetailTable: ShowDetailTable
      });
    }
    
  }


  handleResetTreeEevent(){
    this.paneResize.resetTheWidthToOrignial();
  }


  componentDidMount(){
    this.setComponentData();
    this.paneResize.setOriginalWidthForLeftPanes();        
    document.body.addEventListener("mousedown", this.paneResize.onMouseDown);
    document.body.addEventListener("mousemove", this.paneResize.moveToResize);
    document.body.addEventListener("mouseup", this.paneResize.releaseMouseFromResize);
  }

  componentWillUnmount(){  
    document.body.addEventListener("mousedown", this.paneResize.onMouseDown);
    document.body.addEventListener("mousemove", this.paneResize.moveToResize);
    document.body.addEventListener("mouseup", this.paneResize.releaseMouseFromResize);
  }


render(){
  return(    
     <div className="tree-view-container resizable-container"> 
        <div className="tree-page-left-part" id="page-left-pane">       
          <JumpTo
            ontologyId={this.props.ontology.ontologyId}
            isSkos={this.props.isSkos} 
            componentIdentity={this.props.componentIdentity}         
           />
          <div className='tree-container'>
                <Tree
                  rootNodes={this.props.rootNodes}
                  obsoleteTerms={this.props.obsoleteTerms}                               
                  rootNodesForSkos={this.props.rootNodesForSkos}
                  componentIdentity={this.props.componentIdentity}
                  iri={this.props.iri}
                  key={this.props.key}                    
                  ontology={this.props.ontology.ontologyId}
                  rootNodeNotExist={this.props.rootNodeNotExist}
                  iriChangerFunction={this.props.iriChangerFunction}
                  lastState={this.props.lastState}
                  domStateKeeper={this.props.domStateKeeper}
                  isSkos={this.props.isSkos}
                  nodeSelectionHandler={this.handleTreeNodeSelection}
                  individualViewChanger={""}
                  handleResetTreeInParent={this.handleResetTreeEevent}
                />
          </div>
        </div>
        {this.state.showDetailTable && this.paneResize.generateVerticalResizeLine()}
        {this.state.showDetailTable &&
          <div className="node-table-container" id="page-right-pane">
            {this.state.termTree &&
                <MatomoWrapper>
                <NodePage
                  iri={this.state.selectedNodeIri}
                  ontology={this.props.ontology}
                  componentIdentity="terms"
                  extractKey="terms"
                  isSkos={this.props.isSkos}
                  isIndividual={false}
                  typeForNote="class"
                />
                </MatomoWrapper>        
            }
            {this.state.propertyTree &&           
              <MatomoWrapper>
              <NodePage
                  iri={this.state.selectedNodeIri}
                  ontology={this.props.ontology}
                  componentIdentity="props"
                  extractKey="properties"
                  isIndividual={false}
                  typeForNote="property"
              />
              </MatomoWrapper>}
          </div>
        }       
    </div>  
  )
}

}

export default withRouter(DataTreePage);



