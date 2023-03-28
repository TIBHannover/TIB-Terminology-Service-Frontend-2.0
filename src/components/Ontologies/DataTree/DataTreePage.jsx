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
      showNodeDetailPageClass: false,
      showNodeDetailPageProperty: false,
      componentIdentity: "",
      termTree: false,
      propertyTree: false,
      ontologyId: ''
    })
    this.paneResize = new PaneResize();
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


  handleTreeNodeSelection(selectedNodeIri, ShowDetailTable, componentIdentity){
    if(componentIdentity === "term"){
      this.setState({
        selectedNodeIri: selectedNodeIri,
        showNodeDetailPageClass: ShowDetailTable
      });
    }
    else{
      this.setState({
        selectedNodeIri: selectedNodeIri,
        showNodeDetailPageProperty: ShowDetailTable
      });
    }
    
  }


  componentDidMount(){
    this.setComponentData();        
    document.body.addEventListener("mousedown", this.paneResize.onMouseDown, false);
    document.body.addEventListener("mousemove", this.paneResize.moveToResize);
    document.body.addEventListener("mouseup", this.paneResize.releaseMouseFromResize);
  }

  componentWillUnmount(){  
    document.body.addEventListener("mousedown", this.paneResize.onMouseDown, false);
    document.body.addEventListener("mousemove", this.paneResize.moveToResize);
    document.body.addEventListener("mouseup", this.paneResize.releaseMouseFromResize);
  }


render(){
  return(    
     <div className="tree-view-container resizable-container"> 
        <div className="tree-page-left-part" id="page-left-pane">       
          <JumpTo
            ontologyId={this.props.ontology}
            isSkos={this.props.isSkos} 
            componentIdentity={this.props.componentIdentity}         
           />
          <div className='tree-container'>
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
        {this.paneResize.generateVerticalResizeLine()}
        <div className="node-table-container" id="page-right-pane">
          {this.state.termTree && this.state.showNodeDetailPageClass &&           
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
          }
          {this.state.propertyTree && this.state.showNodeDetailPageProperty &&           
            <MatomoWrapper>
            <NodePage
                iri={this.state.selectedNodeIri}
                ontology={this.state.ontologyId}
                componentIdentity="property"
                extractKey="properties"
                isIndividual={false}
            />
            </MatomoWrapper>}
        </div>        
    </div>  
  )
}

}

export default withRouter(DataTreePage);



