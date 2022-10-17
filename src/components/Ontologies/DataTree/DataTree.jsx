import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import NodePage from '../NodePage/NodePage';
import { withRouter } from 'react-router-dom';
import { getChildrenJsTree} from '../../../api/fetchData';
import { buildHierarchicalArray, buildTreeListItem, nodeHasChildren, nodeIsRoot, expandTargetNode, expandNode, nodeExistInList } from './helpers';



class DataTree extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      rootNodes: [],
      selectedNodeIri: '',
      showNodeDetailPage: false,
      componentIdentity: "",
      termTree: false,
      propertyTree: false,
      ontologyId: '',      
      childExtractName: "",
      targetNodeIri: "",
      treeDomContent: "",
      resetTreeFlag: false,
      siblingsVisible: false,
      siblingsButtonShow: false,
      reduceTreeBtnShow: false,
      reduceBtnActive: true,
      viewMode: true,
      reload: false,
      isLoadingTheComponent: true,
      noNodeExist: false
    })

    this.setTreeData = this.setTreeData.bind(this);
    this.buildTree = this.buildTree.bind(this);
    this.processClick = this.processClick.bind(this);
    this.selectNode = this.selectNode.bind(this);
    this.processTree = this.processTree.bind(this);
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
                componentIdentity: componentIdentity,
                termTree: true,
                propertyTree: false,
                ontologyId: ontologyId,
                childExtractName: "terms",
                resetTreeFlag: false,
                reload: false,
                noNodeExist: false
              }, async () => {
                await this.processTree(resetFlag, viewMode, reload);
              });              
        } 
        else if(componentIdentity == 'property'){
            this.setState({
              rootNodes: rootNodes,              
              componentIdentity: componentIdentity,
              termTree: false,
              propertyTree: true,
              ontologyId: ontologyId,
              childExtractName: "properties",
              resetTreeFlag: false,
              reload: false,
              noNodeExist: false
            }, async () => {
              await this.processTree(resetFlag, viewMode, reload);
            });    
        }      
    }
    else if(rootNodes.length === 0 && !this.state.noNodeExist && this.props.rootNodeNotExist){
      this.setState({
        isLoadingTheComponent: false,
        noNodeExist: true
      });
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
        let url = process.env.REACT_APP_API_BASE_URL + "/";
        url += this.state.ontologyId + "/" + extractName + "/" + encodeURIComponent(encodeURIComponent(target)) + "/jstree?viewMode=All&siblings=" + viewMode;
        let list =  await (await fetch(url, getCallSetting)).json();        
        let roots = buildHierarchicalArray(list);
        let childrenList = [];        
        if(nodeExistInList(target, roots)){
          // the target node is a root node
          let childrenList = [];
          let i = 0;
          for(let rootNodes of roots){            
            let leafClass = " closed";
            let symbol = React.createElement("i", {"className": "fa fa-plus", "aria-hidden": "true"}, "");
            let textSpan = React.createElement("span", {"className": "li-label-text"}, rootNodes.text);
            if(rootNodes.iri === target){
              textSpan = React.createElement("span", {"className": "li-label-text clicked targetNodeByIri"}, rootNodes.text);
            }
            if (!rootNodes.children){
              leafClass = " leaf-node";
              // symbol = React.createElement("i", {"className": "fa fa-close"}, "");
              symbol = React.createElement("i", {"className": ""}, "");
            }    
            let listItem = React.createElement("li", {         
                "data-iri":rootNodes.iri, 
                "data-id": i,
                "className": "tree-node-li" + leafClass,
                "id": i
              }
                , symbol, textSpan
                );
            childrenList.push(listItem);
            i += 1;
          }          
          let treeList = React.createElement("ul", {className: "tree-node-ul", id: "tree-root-ul"}, childrenList);
          this.setState({
            targetNodeIri: target,
            treeDomContent: treeList,
            selectedNodeIri: target,
            showNodeDetailPage: true,
            reduceTreeBtnShow: true,
            reload: false,
            isLoadingTheComponent: false,
            siblingsButtonShow: true
          }); 

          return true;

        }

        for(let i=0; i < roots.length; i++){         
          let leafClass = "";
          let symbol = "";
          let textSpan = React.createElement("span", {"className": "li-label-text"}, roots[i].text);          
          if (roots[i].childrenList.length === 0 && !roots[i].children && !roots[i].opened){
            //  root node is a leaf
            leafClass = " leaf-node";
            // symbol = React.createElement("i", {"className": "fa fa-close"}, "");
            symbol = React.createElement("i", {"className": ""}, "");
          }
          
          else if(roots[i].childrenList.length === 0 && roots[i].children && !roots[i].opened){
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
            subList = expandTargetNode(roots[i].childrenList, roots[i].id, target, targetHasChildren);
            
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
            treeDomContent: treeList,
            selectedNodeIri: target,
            showNodeDetailPage: true,
            reduceTreeBtnShow: true,
            reload: false,
            isLoadingTheComponent: false,
            siblingsButtonShow: true
        });    
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
      // symbol = React.createElement("i", {"className": "fa fa-close"}, "");
      symbol = React.createElement("i", {"className": ""}, "");
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
    reload: false,
    isLoadingTheComponent: false
  });
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

    let currentUrlParams = new URLSearchParams();
    currentUrlParams.append('iri', target.parentNode.dataset.iri);
    this.props.history.push(window.location.pathname + "?" + currentUrlParams.toString());

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
    expandNode(e.target.parentNode, this.state.ontologyId, this.state.childExtractName);
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
    reload: false,
    showNodeDetailPage: false,
    reduceTreeBtnShow: false
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
          let url = process.env.REACT_APP_API_BASE_URL + "/";
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
    // console.info(e.stack);    
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
    <div className="row tree-view-container" onClick={(e) => this.processClick(e)} > 
        <div className="col-sm-6 tree-container">
        {this.state.isLoadingTheComponent && <div className="isLoading"></div>}
        {this.state.noNodeExist && <div className="no-node">It is currently not possible to load this tree. Please try later.</div>}
        {!this.state.isLoadingTheComponent && !this.state.noNodeExist && 
          <div className='row'>
            <div className='col-sm-10'>
              {this.state.treeDomContent}
            </div>
            <div className='col-sm-2'>
              <button className='btn btn-secondary btn-sm tree-action-btn' onClick={this.resetTree}>Reset</button> 
              {this.state.reduceTreeBtnShow && 
                <button className='btn btn-secondary btn-sm tree-action-btn' onClick={this.reduceTree}>
                  {!this.state.reduceBtnActive
                        ? "Sub Tree"
                        : "Full Tree"
                  }
                </button>                
              }                
              {this.state.siblingsButtonShow && 
                <button className='btn btn-secondary btn-sm tree-action-btn' onClick={this.showSiblings}>
                  {!this.state.siblingsVisible
                      ? "Show Siblings"
                      : "Hide Siblings"
                    }    
                </button>                
              } 
            </div>
          </div>}
        </div>
        {this.state.termTree && this.state.showNodeDetailPage && 
          <div className="col-sm-6 node-table-container">
            <NodePage
              iri={this.state.selectedNodeIri}
              ontology={this.state.ontologyId}
              componentIdentity="term"
              extractKey="terms"
            />
        </div>
        }
        {this.state.propertyTree && this.state.showNodeDetailPage && 
          <div className="col-sm-6 node-table-container">
          <NodePage
              iri={this.state.selectedNodeIri}
              ontology={this.state.ontologyId}
              componentIdentity="property"
              extractKey="properties"
          />
        </div>
        }
    </div>  
  )
}

}

export default withRouter(DataTree);



