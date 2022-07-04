import React from 'react';
import '../../layout/ontologies.css';
import 'font-awesome/css/font-awesome.min.css';
import Grid from '@material-ui/core/Grid';
import TermPage from '../TermPage/TermPage';
import PropertyPage from '../PropertyPage/PropertyPage';
import Button from '@mui/material/Button';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { withRouter } from 'react-router-dom';
import { getChildrenJsTree} from '../../../api/fetchData';
import { buildHierarchicalArray, buildTreeListItem, nodeHasChildren, nodeIsRoot } from './helpers';



class DataTree extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      rootNodes: [],
      treeData: [],
      originalTreeData: [],
      selectedNodeIri: '',
      showNodeDetailPage: false,
      componentIdentity: "",
      termTree: false,
      propertyTree: false,
      openTreeRoute: [],
      isTreeRouteShown: false,
      ontologyId: '',
      childrenFieldName:'',
      ancestorsFieldName: '',
      searchWaiting: true,
      baseUrl: "https://service.tib.eu/ts4tib/api/ontologies/",
      childExtractName: "",
      targetNodeIri: "",
      treeDomContent: "",
      resetTreeFlag: false,
      siblingsVisible: false,
      siblingsButtonShow: false,
      reduceTreeBtnShow: false,
      reduceBtnActive: false,
      viewMode: true,
      reload: false
    })

    this.setTreeData = this.setTreeData.bind(this);
    this.buildTree = this.buildTree.bind(this);
    this.expandNode = this.expandNode.bind(this);
    this.processClick = this.processClick.bind(this);
    this.selectNode = this.selectNode.bind(this);
    this.processTree = this.processTree.bind(this);
    this.expandTargetNode = this.expandTargetNode.bind(this);
    this.resetTree = this.resetTree.bind(this);
    this.showSiblings = this.showSiblings.bind(this);
    this.reduceTree = this.reduceTree.bind(this);
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
    let resetFlag = this.state.resetTreeFlag;
    let viewMode = !this.state.reduceBtnActive;
    let reload = this.state.reload;    
    if ((rootNodes.length != 0 && this.state.rootNodes.length == 0) || resetFlag || reload){
        if(componentIdentity == 'term'){         
            this.setState({
                rootNodes: rootNodes,
                treeData: rootNodes,
                originalTreeData: rootNodes,
                componentIdentity: componentIdentity,
                termTree: true,
                propertyTree: false,
                ontologyId: ontologyId,
                childrenFieldName: "hierarchicalChildren",
                ancestorsFieldName: "hierarchicalAncestors",
                childExtractName: "terms",
                resetTreeFlag: false,
                reload: false
              }, async () => {
                await this.processTree(resetFlag, viewMode, reload);
              });              
        } 
        else if(componentIdentity == 'property'){
            this.setState({
              rootNodes: rootNodes,
              treeData: rootNodes,
              originalTreeData: rootNodes,
              componentIdentity: componentIdentity,
              termTree: false,
              propertyTree: true,
              ontologyId: ontologyId,
              childrenFieldName: "children",
              ancestorsFieldName: "ancestors",
              childExtractName: "properties",
              resetTreeFlag: false,
              reload: false 
            }, async () => {
              await this.processTree(resetFlag, viewMode, reload);
            });    
        }      
    }
  }


   /**
   * Process a tree to build it. The tree is either a complete tree or a sub-tree.
   * The sub-tree exist for jumping to a node directly given by its Iri.   
   * @returns 
   */
    async processTree(resetFlag, viewMode, reload){
      let target = this.props.iri;
      if (!target || resetFlag){
        this.buildTree(this.state.rootNodes);
        return true;
      }
      target = target.trim();
      let targetHasChildren = await nodeHasChildren(this.state.ontologyId, target, this.state.componentIdentity);
      if((target != undefined && this.state.targetNodeIri != target) || reload ){        
        let callHeader = {
          'Accept': 'application/json'
        };
        let getCallSetting = {method: 'GET', headers: callHeader};
        let extractName = this.state.childExtractName;
        let url = this.state.baseUrl;
        url += this.state.ontologyId + "/" + extractName + "/" + encodeURIComponent(encodeURIComponent(target)) + "/jstree?viewMode=All&siblings=" + viewMode;
        let list =  await (await fetch(url, getCallSetting)).json();        
        let roots = await buildHierarchicalArray(list, this.state.ontologyId, this.state.componentIdentity);        
        let childrenList = [];
        if(list.length === 1){
          // the target node is a root node
          let leafClass = " closed";
          let symbol = React.createElement("i", {"className": "fa fa-plus", "aria-hidden": "true"}, "");
          let textSpan = React.createElement("span", {"className": "li-label-text clicked targetNodeByIri"}, roots[0].text);
          if (! await nodeHasChildren(this.state.ontologyId, roots[0].iri, this.state.componentIdentity)){
            leafClass = " leaf-node";
            symbol = React.createElement("i", {"className": "fa fa-close"}, ""); 
          }
          let listItem = React.createElement("li", {         
            "data-iri":roots[0].iri, 
            "data-id": 0,
            "className": "tree-node-li " + leafClass,
            "id": roots[0].id
            }, symbol, textSpan, []              
          );
          let treeList = React.createElement("ul", {className: "tree-node-ul", id: "tree-root-ul"}, [listItem]);
          this.setState({
            targetNodeIri: target,
            searchWaiting: false,
            treeDomContent: treeList,
            selectedNodeIri: target,
            showNodeDetailPage: true,
            reduceTreeBtnShow: true,
            reload: false
          }); 

          return true;

        }

        for(let i=0; i < roots.length; i++){         
          let leafClass = "";
          let symbol = "";
          let textSpan = React.createElement("span", {"className": "li-label-text"}, roots[i].text);
          let targetHasChildren = await nodeHasChildren(this.state.ontologyId, roots[i].iri, this.state.componentIdentity);
          if (roots[i].childrenList.length === 0 && !targetHasChildren){
            //  root node is a leaf
            leafClass = " leaf-node";
            symbol = React.createElement("i", {"className": "fa fa-close"}, "");
          }
          
          else if(roots[i].childrenList.length === 0 && targetHasChildren){
            // root is not leaf but does not include the target node on its sub-tree
            leafClass = " closed";
            symbol = React.createElement("i", {"className": "fa fa-plus"}, "");

          }
          else{
            // root is not leaf and include the target node on its sub-tree
            leafClass = " opened";
            symbol = React.createElement("i", {"className": "fa fa-minus", "aria-hidden": "true"}, "");
          }
          
          let subList = "";
          if(roots[i].childrenList.length !== 0){
            subList = this.expandTargetNode(roots[i].childrenList, roots[i].id, target, targetHasChildren);
            
          }      
          let listItem = React.createElement("li", {         
              "data-iri":roots[i].iri, 
              "data-id": i,
              "className": "tree-node-li" + leafClass,
              "id": roots[i].id
            }, symbol, textSpan, subList
              
            );
          
          childrenList.push(listItem);
        }
        let treeList = React.createElement("ul", {className: "tree-node-ul", id: "tree-root-ul"}, childrenList);                 
        this.setState({
            targetNodeIri: target,
            searchWaiting: false,
            treeDomContent: treeList,
            selectedNodeIri: target,
            showNodeDetailPage: true,
            reduceTreeBtnShow: true,
            reload: false
        });    
      }
  }


/**
 * Expand a node in the tree in loading. Used for jumping directly to a node given by Iri.
 * @param {*} nodeList 
 * @param {*} parentId 
 * @returns 
 */
expandTargetNode(nodeList, parentId, targetIri, targetHasChildren){
  let subNodes = [];
  for(let i = 0; i < nodeList.length; i++){
    let childNodeChildren = [];
    if(nodeList[i].iri !== targetIri){
      let subUl = this.expandTargetNode(nodeList[i].childrenList, nodeList[i].id, targetIri, targetHasChildren);
      childNodeChildren.push(subUl);
    }

    let newId = nodeList[i].id;
    let nodeStatusClass = "opened";
    let iconClass = "fa fa-minus";
    let clickedClass = "";
    if (nodeList[i].iri === targetIri){
      if(targetHasChildren){
        nodeStatusClass = "closed";
        iconClass = "fa fa-plus";  
      }
      else{
        nodeStatusClass = "leaf-node";
        iconClass = "fa fa-close";
      }
      clickedClass = "clicked targetNodeByIri";
    }
    else{
      if(nodeList[i].children && nodeList[i].childrenList.length == 0){
        nodeStatusClass = "closed";
        iconClass = "fa fa-plus";  
      }
      else if(nodeList[i].children && nodeList[i].childrenList.length != 0){
        nodeStatusClass = "opened";
        iconClass = "fa fa-minus";
      }
      else{
        nodeStatusClass = "leaf-node";
        iconClass = "fa fa-close";
      }
    }
    let symbol = React.createElement("i", {"className": iconClass }, "");
    let label = React.createElement("span", {"className": "li-label-text " + clickedClass}, nodeList[i].text);
    let childNode = "";
    if(nodeList[i]['a_attr']["class"] === "part_of"){
      let partOfSymbol = React.createElement("span", {"className": "p-icon-style"}, "P");
      childNode = React.createElement("li", {
        "className": nodeStatusClass + " tree-node-li",
        "id": newId,
        "data-iri": nodeList[i].iri,
        "data-id": nodeList[i].id
      }, symbol, partOfSymbol, label, childNodeChildren);
    }
    else{
      childNode = React.createElement("li", {
        "className": nodeStatusClass + " tree-node-li",
        "id": newId,
        "data-iri": nodeList[i].iri,
        "data-id": nodeList[i].id
      }, symbol, label, childNodeChildren);
    }

    subNodes.push(childNode);
  }
  let ul = React.createElement("ul", {"className": "tree-node-ul", "id": "children_for_" + parentId}, subNodes);
  if (nodeList.length === 0){
    ul = "";
  }

  return ul;
  

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
        "id": i
      }
        , symbol, textSpan
        );
    childrenList.push(listItem);
  }
  let treeList = React.createElement("ul", {className: "tree-node-ul", id: "tree-root-ul"}, childrenList);
  this.setState({
    treeDomContent: treeList,
    targetNodeIri: false,
    searchWaiting: false,
    reload: false
  });
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
      let res =  await getChildrenJsTree(this.state.ontologyId, targetNodeIri, targetNodeId, this.state.childExtractName); 
      let ul = document.createElement("ul");
      ul.setAttribute("id", "children_for_" + Id);
      ul.classList.add("tree-node-ul");
      for(let i=0; i < res.length; i++){
        let listItem = buildTreeListItem(res[i]);
        ul.appendChild(listItem);      
      }      
      document.getElementById(Id).getElementsByTagName("i")[0].classList.remove("fa-plus");
      document.getElementById(Id).getElementsByTagName("i")[0].classList.add("fa-minus");
      document.getElementById(Id).classList.remove("closed");
      document.getElementById(Id).classList.add("opened");      
      document.getElementById(Id).appendChild(ul);
  }
  else if (!document.getElementById(Id).classList.contains("leaf-node")){
    // close an already expanded node
      document.getElementById(Id).classList.remove("opened");
      document.getElementById(Id).classList.add("closed");      
      document.getElementById(Id).getElementsByTagName("i")[0].classList.remove("fa-minus");
      document.getElementById(Id).getElementsByTagName("i")[0].classList.add("fa-plus");
      document.getElementById("children_for_" + Id).remove();
  }
      
}


/**
 * Select a node in tree
 * @param {*} e 
 */
selectNode(target){
  let selectedElement = document.getElementsByClassName("clicked");
  for(let i =0; i < selectedElement.length; i++){
    selectedElement[i].classList.remove("clicked");
  }
  
  if(!target.classList.contains("clicked")){
    target.classList.add("clicked");
    this.setState({
      showNodeDetailPage: true,
      selectedNodeIri: target.parentNode.dataset.iri
    });
  }
  else{
    target.classList.remove("clicked");
  }
}


/**
 * Process a click on the tree container div. 
 * @param {*} e 
 */
processClick(e){
  if (e.target.tagName === "SPAN"){ 
    this.selectNode(e.target);
  }
  else if (e.target.tagName === "I"){   
    // expand a node by clicking on the expand icon 
    this.expandNode(e.target.parentNode);
  }
}



/**
 * Reset tree view.
 */
resetTree(){
  this.props.history.push(window.location.pathname);
  this.setState({
    resetTreeFlag: true,
    treeDomContent: "",
    siblingsVisible: false,
    siblingsButtonShow: false,
    reload: false
  });
}


/**
 * Show an opened node siblings
 */
async showSiblings(){
  try{
    let targetNodes = document.getElementsByClassName("targetNodeByIri");
    if(!this.state.siblingsVisible){
        if(await nodeIsRoot(this.state.ontologyId, targetNodes[0].parentNode.dataset.iri, this.state.componentIdentity)){
          // Target node is a root node
          let callHeader = {
            'Accept': 'application/json'
          };
          let getCallSetting = {method: 'GET', headers: callHeader};
          let extractName = this.state.childExtractName;
          let url = this.state.baseUrl;
          url += this.state.ontologyId + "/" + extractName + "/" + encodeURIComponent(encodeURIComponent(targetNodes[0].parentNode.dataset.iri)) + "/jstree?viewMode=All&siblings=true";
          let res =  await (await fetch(url, getCallSetting)).json(); 
          for(let i=0; i < res.length; i++){
            if (res[i].iri === targetNodes[0].parentNode.dataset.iri){
              continue;
            }
            let listItem = buildTreeListItem(res[i]);
            document.getElementById("tree-root-ul").appendChild(listItem);
          }   

        }
        else{
          for (let node of targetNodes){
            let parentUl = node.parentNode.parentNode;
            let parentId = parentUl.id.split("children_for_")[1];
            let Iri = document.getElementById(parentId);
            Iri = Iri.dataset.iri;
            let res =  await getChildrenJsTree(this.state.ontologyId, Iri, parentId, this.state.childExtractName); 
            for(let i=0; i < res.length; i++){
              if (res[i].iri === node.parentNode.dataset.iri){
                continue;
              }
              let listItem = buildTreeListItem(res[i]);
              parentUl.appendChild(listItem);      
            }   
          }
        }
        
        this.setState({siblingsVisible: true});
    }
    else{
      if(await nodeIsRoot(this.state.ontologyId, targetNodes[0].parentNode.dataset.iri, this.state.componentIdentity)){
        // Target node is a root node
        let parentUl = document.getElementById("tree-root-ul");
        let children = [].slice.call(parentUl.childNodes);
        for(let i=0; i < children.length; i++){
          if(children[i].dataset.iri !== targetNodes[0].parentNode.dataset.iri){
            children[i].remove();
          }
        }
      }
      else{
        for (let node of targetNodes){
          let parentUl = node.parentNode.parentNode;
          let children = [].slice.call(parentUl.childNodes);
          for(let i=0; i < children.length; i++){
            if(children[i].dataset.iri !== node.parentNode.dataset.iri){
              children[i].remove();
            }
          }
        }
      }
      
      this.setState({siblingsVisible: false});
    }
  }
  catch(e){

  }
  
}


/**
 * Reduce tree. show/hide the sub-tree when a node is opened by iri.
 */
reduceTree(){
  let reduceBtnActive = this.state.reduceBtnActive;
  this.setState({
    reduceBtnActive: !reduceBtnActive,
    siblingsButtonShow: !reduceBtnActive,
    reload: true
  });
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
        <Grid item xs={6} className="tree-container">
          <Grid container>
            <Grid item xs={10}>
              {this.state.treeDomContent}
            </Grid>
            <Grid item xs={2}>
              <Button 
                    variant="contained" 
                    className='tree-action-btn' 
                    startIcon={<RestartAltIcon />}
                    onClick={this.resetTree}
                    >
                    Reset Tree
              </Button>
              {this.state.reduceTreeBtnShow && 
                <Button 
                    variant="contained" 
                    className='tree-action-btn'                     
                    onClick={this.reduceTree}
                    >
                    {!this.state.reduceBtnActive
                      ? "Show Sub Tree"
                      : "Show Full Tree"
                    }                    
                </Button>
              }                
              {this.state.siblingsButtonShow && 
                <Button 
                    variant="contained" 
                    className='tree-action-btn'                     
                    onClick={this.showSiblings}
                    >
                    {!this.state.siblingsVisible
                      ? "Show Siblings"
                      : "Hide Siblings"
                    }                    
                </Button>
              } 
            </Grid>
          </Grid>
        </Grid>
        {this.state.termTree && this.state.showNodeDetailPage && 
          <Grid item xs={6} className="node-table-container">
            <TermPage
              iri={this.state.selectedNodeIri}
              ontology={this.state.ontologyId}
            />
        </Grid>
        }
        {this.state.propertyTree && this.state.showNodeDetailPage && 
          <Grid item xs={6} className="node-table-container">
          <PropertyPage
              iri={this.state.selectedNodeIri}
              ontology={this.state.ontologyId}
          />
        </Grid>
        }
    </Grid>  
  )
}

}

export default withRouter(DataTree);



