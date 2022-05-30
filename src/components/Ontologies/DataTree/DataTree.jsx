import React, { createElement } from 'react';
import ReactDOM from 'react-dom'
import '../../layout/ontologies.css';
import 'font-awesome/css/font-awesome.min.css';
import Grid from '@material-ui/core/Grid';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import CancelPresentationOutlinedIcon from '@mui/icons-material/CancelPresentationOutlined';
import {getChildren, getNodeByIri} from '../../../api/fetchData';



class DataTree extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      rootNodes: [],
      expandedNodes: [],
      treeData: [],
      originalTreeData: [],
      visitedNodes: [],
      currentExpandedTerm: '',
      currentClickedTerm: '',
      selectedNode: '',
      showNodeDetailPage: false,
      componentIdentity: "",
      termTree: false,
      propertyTree: false,
      targetNodeIri: "",
      openTreeRoute: [],
      isTreeRouteShown: false,
      alreadyExistedNodesInTree: {},
      ontologyId: '',
      childrenFieldName:'',
      ancestorsFieldName: '',
      searchWaiting: true,
      treeDataFlatPointers: {},
      originalTreeDataFlatPointers: {}
    })

    this.setTreeData = this.setTreeData.bind(this);
    this.buildTree = this.buildTree.bind(this);
    this.expandNode = this.expandNode.bind(this);
    this.processClick = this.processClick.bind(this);
    this.buildTreeListItem = this.buildTreeListItem.bind(this);
  }



  /**
   * set data from input props
   * @param {*} nodes 
   * @returns 
   */
   async setTreeData(){
    let rootNodes = this.props.rootNodes;
    let ontologyId = this.props.ontology;
    let componentIdentity = this.props.componentIdentity;
    if (componentIdentity != this.state.componentIdentity && rootNodes.length != 0 && this.state.rootNodes.length == 0){
        if(componentIdentity == 'term'){         
            this.setState({
                rootNodes: rootNodes,
                treeData: rootNodes,
                originalTreeData: rootNodes,
                componentIdentity: componentIdentity,
                termTree: true,
                propertyTree: false,
                alreadyExistedNodesInTree: this.props.existedNodes,
                ontologyId: ontologyId,
                childrenFieldName: "hierarchicalChildren",
                ancestorsFieldName: "hierarchicalAncestors"
              });              
        }       
    }
  }


  /**
 * Build the first layer of the tree (root nodes).
 * @param {*} rootNodes 
 * @returns 
 */
  buildTree(rootNodes){
  let childrenList = [];
  for(let i=0; i < rootNodes.length; i++){
    let leafClass = " closed";
    let symbol = React.createElement("i", {"className": "fa fa-plus", "aria-hidden": "true"}, "");
    let textSpan = React.createElement("span", {"className": "li-label-text"}, rootNodes[i].label);
    if (!rootNodes[i].has_children){
      leafClass = " leaf-node";
      symbol = React.createElement("i", {"className": "fa fa-close"}, "");
    }    
    let listItem = React.createElement("li", {         
        "data-iri":rootNodes[i].iri, 
        "data-id": i,
        "className": "tree-node-li" + leafClass,
        "id": i + "_" +  Math.floor(Math.random() * 10000)
      }
        , symbol, textSpan
        );
    childrenList.push(listItem);
  }
  let treeList = React.createElement("ul", {className: "tree-node-ul"}, childrenList);
  return treeList;
}



/**
 * Expand/collapse a node on click
 */
async expandNode(e){
  let targetNodeIri = e.dataset.iri;
  let targetNodeId = e.dataset.id;
  let Id = e.id;
  if(document.getElementById(Id).classList.contains("closed")){
      // expand node
      let callHeader = {
        'Accept': 'application/json'
      };
      let getCallSetting = {method: 'GET', headers: callHeader};
      let url = "https://service.tib.eu/ts4tib/api/ontologies/";
      let extractName = "terms";
      url += this.state.ontologyId + "/" + extractName + "/" + encodeURIComponent(encodeURIComponent(targetNodeIri)) + "/jstree/children/" + targetNodeId;
      let res =  await (await fetch(url, getCallSetting)).json(); 
      let ul = document.createElement("ul");
      ul.setAttribute("id", "children_for_" + Id);
      ul.classList.add("tree-node-ul");
      for(let i=0; i < res.length; i++){
        let listItem = this.buildTreeListItem(res[i]);
        ul.appendChild(listItem);      
      }      
      document.getElementById(Id).getElementsByTagName("i")[0].classList.remove("fa-plus");
      document.getElementById(Id).getElementsByTagName("i")[0].classList.add("fa-minus");
      document.getElementById(Id).classList.remove("closed");
      document.getElementById(Id).classList.add("opened");
      document.getElementById(Id).appendChild(ul);
  }
  else{
    // close an already expanded node
      document.getElementById(Id).classList.remove("opened");
      document.getElementById(Id).classList.add("closed");
      document.getElementById(Id).getElementsByTagName("i")[0].classList.remove("fa-minus");
      document.getElementById(Id).getElementsByTagName("i")[0].classList.add("fa-plus");
      document.getElementById("children_for_" + Id).remove();
  }
      
}


/**
 * Build a list (li) element for the tree veiw
 * @param {*} childNode
 */
  buildTreeListItem(childNode){
    let newId = childNode.id + "_" +  Math.floor(Math.random() * 10000);
    let label = document.createTextNode(childNode.text);
    let labelTextSpan = document.createElement("span");
    labelTextSpan.classList.add("li-label-text");
    labelTextSpan.appendChild(label);
    let symbol = document.createElement("i");
    let listItem = document.createElement("li");
    listItem.setAttribute("id", newId);
    listItem.setAttribute("data-iri", childNode.iri);
    listItem.setAttribute("data-id", childNode.id);                  
    if(childNode.children){
      listItem.classList.add("closed");
      symbol.classList.add('fa');
      symbol.classList.add('fa-plus');
    }
    else{
      listItem.classList.add("leaf-node");
      symbol.classList.add('fa');
      symbol.classList.add('fa-close');
    }
    listItem.appendChild(symbol);
    listItem.appendChild(labelTextSpan);
    listItem.classList.add("tree-node-li");

    return listItem;
  }



/**
 * Process a click on the tree container div. 
 * @param {*} e 
 */
processClick(e){
  if(e.target.tagName === "LI"){
      this.expandNode(e.target);
    }
  else if (e.target.tagName === "SPAN"){
    // console.info(e.target.parentNode);
    this.expandNode(e.target.parentNode);
  }
}


componentDidMount(){
  this.setTreeData();
}

componentDidUpdate(){
  this.setTreeData();
}



render(){
  return(
    <Grid container spacing={0} className="tree-view-container" onClick={(e) => this.processClick(e)} >
        <Grid item xs={5} className="tree-container">
            {this.buildTree(this.state.rootNodes)}
        </Grid>
    </Grid>  
  )
}

}

export default DataTree;



