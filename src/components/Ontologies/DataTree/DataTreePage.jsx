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
      ontologyId: '',
      lastPageX: 0,
      resizeOn: false
    })
    this.setComponentData = this.setComponentData.bind(this);
    this.handleTreeNodeSelection = this.handleTreeNodeSelection.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.moveToResize = this.moveToResize.bind(this);
    this.releaseMouseFromResize = this.releaseMouseFromResize.bind(this);
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


  handleTreeNodeSelection(selectedNodeIri, ShowDetailTable){
    this.setState({
      selectedNodeIri: selectedNodeIri,
      showNodeDetailPage: ShowDetailTable
    });
  }


  onMouseDown(event){
    let targetElement = event.target;
    if (!targetElement.classList.contains('tree-view-resize-area')){
      return null;
    }
    this.setState({
      lastPageX: event.clientX,
      resizeOn: true
    });
  }

  moveToResize(event){
    if(!this.state.resizeOn){
      return null;
    }   
    let addedWidth = (event.clientX - this.state.lastPageX) / 1;    
    let treeLeftPane = document.getElementById("tree-page-left-pane");
    let treeRightPane = document.getElementById("tree-page-right-pane");
    let currentWidthLeft = parseInt(treeLeftPane.offsetWidth);    
    let currentWidthRight = parseInt(treeRightPane.offsetWidth);    
    treeLeftPane.style.width = (currentWidthLeft + addedWidth) + "px";
    treeRightPane.style.width = (currentWidthRight - addedWidth) + "px";
    this.setState({lastPageX: event.clientX});  
    this.adjustFontSizeBasedOnResize('tree-node-li', currentWidthLeft + addedWidth);
    this.adjustFontSizeBasedOnResize('fa-plus', currentWidthLeft + addedWidth);
    this.adjustFontSizeBasedOnResize('fa-minus', currentWidthLeft + addedWidth);
    this.adjustFontSizeBasedOnResize('p-icon-style', currentWidthLeft + addedWidth);    
    this.adjustTreeNodeWidthBasedOnResize('tree-text-container', currentWidthLeft + addedWidth);    
    this.adjustTreeNodeWidthBasedOnResize('li-label-text', currentWidthLeft + addedWidth);    
  }


  adjustFontSizeBasedOnResize(targetClassName , currentSize){
    let allNodes = document.getElementsByClassName(targetClassName);    
    let newFontSize = "13px"
    if(currentSize < 700 && currentSize >= 401){
          newFontSize = "7px";
    }
    else if(currentSize < 400){
      newFontSize = "5px";
    }
    for(let node of allNodes){
      node.style.fontSize = newFontSize;
    }
  }

  adjustTreeNodeWidthBasedOnResize(targetClassName , currentSize){
    let allNodes = document.getElementsByClassName(targetClassName);    
    let newWidth = "400px"; 
    if(currentSize < 850 && currentSize >= 600){
      newWidth = "200px";
    }
    else if(currentSize < 600 && currentSize >= 400){
      newWidth = "140px";
    }
    else if(currentSize < 400){
      newWidth = "70px";
    }
    for(let node of allNodes){
      node.style.width = newWidth;
    }
  }


  releaseMouseFromResize(event){
    if(!this.state.resizeOn){
      return null;
    }    
    this.setState({
      resizeOn: false      
    });
  }


  componentDidMount(){
    this.setComponentData();
    document.body.addEventListener("mousedown", this.onMouseDown, false);
    document.body.addEventListener("mousemove", this.moveToResize);
    document.body.addEventListener("mouseup", this.releaseMouseFromResize);
  }

  componentWillUnmount(){
    document.body.addEventListener("mousedown", this.onMouseDown, false);
    document.body.addEventListener("mousemove", this.moveToResize);
    document.body.addEventListener("mouseup", this.releaseMouseFromResize);
  }


render(){
  return(    
     <div className="tree-view-container resizable-container"> 
        <div className="tree-page-left-part" id="tree-page-left-pane">       
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
        <div className='tree-view-resize-area'></div>
        <div className="node-table-container" id="tree-page-right-pane">
          {this.state.termTree && this.state.showNodeDetailPage &&           
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
          {this.state.propertyTree && this.state.showNodeDetailPage &&           
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



