import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import NodePage from '../NodePage/NodePage';
import { withRouter } from 'react-router-dom';
import { MatomoWrapper } from '../../Matomo/MatomoWrapper';
import Tree from './Tree';
import JumpTo from '../JumpTo/Jumpto';



class DataTree extends React.Component {
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

    this.handleTreeNodeSelection = this.handleTreeNodeSelection.bind(this);

  }

/**
 * Process the keyboard navigation
 * @param {*} event 
 */
// processKeyNavigation(event){
//   if(event.code === "ArrowDown"){
//     event.preventDefault();
//   }
//   let lastSelectedItem = this.state.lastKeySelectedItem;
//   if(!lastSelectedItem && ["ArrowDown", "ArrowUp"].includes(event.key)){
//     // nothing is selected. Tree div is not in focus: Select the first element
//     let node = document.getElementById("0").getElementsByClassName('tree-text-container')[0].getElementsByClassName('li-label-text')[0];
//     this.selectNode(node);
//     node.parentNode.classList.add('clicked');
//   }
//   else if(lastSelectedItem && event.key === "ArrowDown" && document.getElementById(lastSelectedItem).nextSibling){
//     // select the next siblings 
//     let node = document.getElementById(lastSelectedItem).nextSibling.getElementsByClassName('tree-text-container')[0].getElementsByClassName('li-label-text')[0];
//     this.selectNode(node);
//     node.parentNode.classList.add('clicked');
//     let nodePostion = document.getElementById(lastSelectedItem).nextSibling.offsetTop;
//     document.getElementById('tree-container').scrollTop = nodePostion;    
//   }
//   else if(lastSelectedItem && event.key === "ArrowUp" && document.getElementById(lastSelectedItem).previousSibling){
//     // select the previous siblings 
//     let node = document.getElementById(lastSelectedItem).previousSibling.getElementsByClassName('tree-text-container')[0].getElementsByClassName('li-label-text')[0];
//     this.selectNode(node);
//     node.parentNode.classList.add('clicked');
//     let nodePostion = document.getElementById(lastSelectedItem).nextSibling.offsetTop;
//     document.getElementById('tree-container').scrollTop = nodePostion;
//   }
//   else if(lastSelectedItem && event.key === "ArrowRight"){
//     // Expand the node if it has children
//     let node = document.getElementById(lastSelectedItem);
//     expandNode(node, this.state.ontologyId, this.state.childExtractName).then((res) => {      
//       this.props.domStateKeeper({__html:document.getElementById("tree-root-ul").outerHTML}, this.state, this.props.componentIdentity);
//     });   
//   }
// }



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


render(){
  return(    
     <div className="row tree-view-container"> 
        <div className="col-sm-6 tree-container-left-part">
        {this.props.componentIdentity === "term" &&
          <JumpTo
          ontologyId={this.props.ontology}
          type={"class"}
        />}
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

export default withRouter(DataTree);



