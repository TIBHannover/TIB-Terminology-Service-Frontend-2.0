import React, { createElement } from 'react';
import ReactDOM from 'react-dom'
import '../../layout/ontologies.css';
import Grid from '@material-ui/core/Grid';
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

  componentDidMount(){
    this.setTreeData();
  }

  componentDidUpdate(){
    this.setTreeData();
  }



  async expandNode(e){
    let targetNodeIri = e.currentTarget.dataset.iri;
    let targetNodeId = e.currentTarget.dataset.id;
    let Id = e.currentTarget.id;
    let callHeader = {
      'Accept': 'application/json'
    };
    let getCallSetting = {method: 'GET', headers: callHeader};
    let url = "https://service.tib.eu/ts4tib/api/ontologies/";
    let extractName = "terms";
    url += this.state.ontologyId + "/" + extractName + "/" + encodeURIComponent(encodeURIComponent(targetNodeIri)) + "/jstree/children/" + targetNodeId;
    let res =  await (await fetch(url, getCallSetting)).json(); 
    let children = [];
    let ul = document.createElement("ul");
    for(let i=0; i < res.length; i++){
      let newId = res[i].text + "_" +  Math.floor(Math.random() * 10000);
      let label = document.createTextNode(res[i].text);
      let listItem = document.createElement("li", {
          onClick: (e) => {this.expandNode(e)},
          "data-iri":res[i].iri, 
          "data-id": res[i].id, 
          "id": newId}
          );
      listItem.appendChild(label);
      ul.appendChild(listItem);
      // children.push(listItem);
    }
    document.getElementById(Id).appendChild(ul);
    // console.info(children);    
  }


  buildTree(rootNodes){
    let childrenList = [];
    for(let i=0; i < rootNodes.length; i++){
      let listItem = React.createElement("li", {
          onClick: (e) => {this.expandNode(e)},
          "data-iri":rootNodes[i].iri, 
          "data-id": i,
          "id": rootNodes[i].short_form + "_" +  Math.floor(Math.random() * 10000)
        }
          , rootNodes[i].label
          );
      childrenList.push(listItem);
    }
    let treeList = React.createElement("ul", {}, childrenList);
    return treeList;
  }


  render(){
    return(
      <Grid container spacing={0} className="tree-view-container">
          <Grid item xs={5} className="tree-container">
              {this.buildTree(this.state.rootNodes)}
          </Grid>
      </Grid>  
    )
  }





}

export default DataTree;



