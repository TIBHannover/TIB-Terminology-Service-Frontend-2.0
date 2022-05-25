import React, { createElement } from 'react';
import ReactDOM from 'react-dom'
import '../../layout/ontologies.css';
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
    // console.info(e.target.id);
    if(e.target.tagName === "LI"){
        let targetNodeIri = e.target.dataset.iri;
        let targetNodeId = e.target.dataset.id;
        let Id = e.target.id;
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
              // let expandSign = "";              
              // if(res[i].children){              
              //   expandSign = document.createElement("i");
              //   expandSign.classList.add("fa-light");
              //   expandSign.classList.add("fa-square-plus");                
              // }
              // else{
              //   expandSign = document.createElement("i");
              //   expandSign.classList.add("fa-light");
              //   expandSign.classList.add("fa-square-plus");                
              // }

              let newId = res[i].id + "_" +  Math.floor(Math.random() * 10000);
              let label = document.createTextNode(res[i].text);
              let listItem = document.createElement("li");         
              listItem.setAttribute("id", newId);
              listItem.setAttribute("data-iri", res[i].iri);
              listItem.setAttribute("data-id", res[i].id);
              // listItem.appendChild(expandSign);
              listItem.appendChild(label);
              listItem.classList.add("closed");
              listItem.classList.add("tree-node-li");
              ul.appendChild(listItem);      
            }
            document.getElementById(Id).classList.remove("closed");
            document.getElementById(Id).classList.add("opened");
            document.getElementById(Id).appendChild(ul);
        }
        else{
            document.getElementById(Id).classList.remove("opened");
            document.getElementById(Id).classList.add("closed");
            document.getElementById("children_for_" + Id).remove();
        }
        
      }
  }


  buildTree(rootNodes){
    let childrenList = [];
    for(let i=0; i < rootNodes.length; i++){           
      let listItem = React.createElement("li", {         
          "data-iri":rootNodes[i].iri, 
          "data-id": i,
          "className": "closed tree-node-li",
          "id": i + "_" +  Math.floor(Math.random() * 10000)
        }
          , rootNodes[i].label
          );
      childrenList.push(listItem);
    }
    let treeList = React.createElement("ul", {className: "tree-node-ul"}, childrenList);
    return treeList;
  }


  render(){
    return(
      <Grid container spacing={0} className="tree-view-container" onClick={(e) => this.expandNode(e)} >
          <Grid item xs={5} className="tree-container">
              {this.buildTree(this.state.rootNodes)}
          </Grid>
      </Grid>  
    )
  }





}

export default DataTree;



