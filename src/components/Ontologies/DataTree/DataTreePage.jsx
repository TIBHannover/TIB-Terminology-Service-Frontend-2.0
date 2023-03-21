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
      lastPageX: event.pageX,
      resizeOn: true
    });
  }

  moveToResize(event){
    if(!this.state.resizeOn){
      return null;
    }
    let targetElement = event.target;
    if (!targetElement.classList.contains('tree-view-resize-area')){
      return null;
    }
    let addedWidth = (event.pageX - this.state.lastPageX) / 3;    
    let treeLeftPane = document.getElementById("tree-container-left-pane");
    let currentWidth = parseInt(treeLeftPane.offsetWidth);    
    treeLeftPane.style.width = (currentWidth + addedWidth) + "px";    
  }

  releaseMouseFromResize(event){
    if(!this.state.resizeOn){
      return null;
    }    
    this.setState({
      resizeOn: false,
      lastPageX: event.pageX
    });    
  }


  componentDidMount(){
    this.setComponentData();
    document.body.addEventListener("mousedown", this.onMouseDown, false);
    document.body.addEventListener("mousemove", this.moveToResize);
    document.body.addEventListener("mouseup", this.releaseMouseFromResize);
  }

  componentWillUnmount(){
    // document.body.removeEventListener("mousemove", this.onMouseDown, false);
  }


render(){
  return(    
     <div className="row tree-view-container"> 
        <div className="col-sm-6 tree-container-left-part" id="tree-container-left-pane">       
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
        <div className='col-sm-1 tree-view-resize-area'></div>
        {this.state.termTree && this.state.showNodeDetailPage && 
          <div className="col-sm-5 node-table-container">
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
          <div className="col-sm-5 node-table-container">
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



