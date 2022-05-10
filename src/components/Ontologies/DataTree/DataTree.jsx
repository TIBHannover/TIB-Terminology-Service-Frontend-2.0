import React from 'react';
import '../../layout/ontologyDetailPage.css';
import Grid from '@material-ui/core/Grid';
import TreeView from '@material-ui/lab/TreeView';
import StyledTreeItem from './widgets/StyledTreeItem';
import TermPage from '../TermPage/TermPage';
import PropertyPage from '../PropertyPage/PropertyPage';
import { MinusSquare, PlusSquare, CloseSquare } from './widgets/icons';
import Button from '@mui/material/Button';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CircularProgress from '@mui/material/CircularProgress';
import {getChildren, getTreeRoutes, getNodeByIri} from '../../../api/fetchData';


class ClassTree extends React.Component {
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
      searchWaiting: true
    })
    this.setTreeData = this.setTreeData.bind(this);
    this.processTarget = this.processTarget.bind(this);
    this.expandTreeByTarget = this.expandTreeByTarget.bind(this);
    this.handleResetTreeBtn = this.handleResetTreeBtn.bind(this);   

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
              }, async () => {
                await this.processTarget(componentIdentity, rootNodes);
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
                alreadyExistedNodesInTree: this.props.existedNodes,
                ontologyId: ontologyId,
                childrenFieldName: "children",
                ancestorsFieldName: "ancestors"
              }, async () => {
                await this.processTarget(componentIdentity, rootNodes);
              });
              
        }
       
    }
  }

  /**
   * process and get the target. The target is an specific target node (term/property) given in the url.
   * @param {*} nodes 
   * @returns 
   */
  async processTarget(componentIdentity, rootNodes){
      let target = this.props.iri;
      let mode = '';
      let ontologyId = this.props.ontology;
      if (!target){
        this.setState({
          targetNodeIri: false,
          openTreeRoute: [],
          searchWaiting: false
        });
        return 0;
      }
      target = target.trim();
      target = encodeURIComponent(target);
      if(target != undefined && this.state.targetNodeIri != target){
        let ancestors = [];
        let customTreeData = [];
        if(componentIdentity == "term"){
          await getTreeRoutes(ontologyId, target, 'terms', ancestors, customTreeData, this.state.childrenFieldName, this.state.ancestorsFieldName); 
          mode = "terms";         
        }
        else{
          await getTreeRoutes(ontologyId, target, 'properties', ancestors, customTreeData, this.state.childrenFieldName, this.state.ancestorsFieldName);
          mode = "properties";          
        }
        
        this.setState({
            targetNodeIri: target,
            openTreeRoute: ancestors,
            treeData:customTreeData,
            searchWaiting: false
        }, () => {
          this.expandTreeByTarget(target, mode, ontologyId);
        });          
      }
  }



  /**
   * Exapand the tree when there is an input target (term/property). Used for showing the selected term/property detail when 
   * called directy by url via 'iri' 
   * @param {*} nodes 
   * @returns 
   */
 expandTreeByTarget(targetNodeIri, mode, ontologyId){
    let routes = this.state.openTreeRoute;
    let expandedNodes = [];
    for(let i=0; i < routes.length; i++){
      let theRoute = routes[i];
      for(let j=0; j < theRoute.length; j++){
        if(!expandedNodes.includes(theRoute[j])){
          expandedNodes.push(theRoute[j]);
        }
      }
    }    
    this.setState({
      expandedNodes: expandedNodes
    }, async() => {
      let node = await getNodeByIri(ontologyId, targetNodeIri, mode);
      let targetElement = document.querySelectorAll('[id^="tree_element_' + node['short_form'].trim() + '"]');
      targetElement[0].getElementsByClassName('MuiTreeItem-content')[0].click();      
    });
  }

  
  /**
     * Construct the tree
     * @param {*} nodes
     * @returns
     */
  createTree =  (nodes) => {    
    return nodes.map((el) => {
      return (
        <StyledTreeItem 
          key={el.id} 
          nodeId={el.modified_short_form} 
          label={  el.part_of
                  ? <div><span class="p-icon-style">P</span>  {el.label}</div>
                  : <div>{el.label}</div>
            }   
          className="tree-element"
          id={"tree_element_" + el.modified_short_form}
          defaultCollapseIcon={<MinusSquare />}
          defaultExpandIcon={<PlusSquare />}
          defaultEndIcon={<CloseSquare />}
          >
          {Array.isArray(el.children) && el.children.length > 0
            ? this.createTree(el.children)
            : el.has_children}
        </StyledTreeItem>
      )
    })
  }



  /**
     * Expand a node on the tree
     * @param {*} node
     * @param {*} shortForm
     * @param {*} expanded
     */
 async updateNodeInTree (node, shortForm, expanded) {
    if (node.modified_short_form === shortForm && node.has_children) {
      let [childrenNodes, alreadyExistedNodesInTree] = await getChildren(node, this.state.childrenFieldName, this.state.componentIdentity, this.state.alreadyExistedNodesInTree);
      if (childrenNodes.length > 0){
        node.children = childrenNodes;
        this.setState({
          expandedNodes: expanded,
          currentExpandedTerm: node,
          alreadyExistedNodesInTree: alreadyExistedNodesInTree
        });
      }      
    } 
    else if (node.has_children) {
      for (let i = 0; i < node.children.length; i++) {
        this.updateNodeInTree(node.children[i], shortForm, expanded)
      }
    }
  }



  /**
     * handle toggle node on the tree. calls node expansion
     * @param {*} e
     * @param {*} value
     */
  handleChange = (e, value) => {
    this.setState({
      expandedNodes:value
    });
    const vNodes = this.state.visitedNodes
    if (!vNodes.includes(value[0])) {
      vNodes.push(value[0])
      const tree = this.state.treeData
      for (let i = 0; i < tree.length; i++) {
        this.updateNodeInTree(tree[i], value[0], value)
        this.setState({
          treeData: tree
        })
      }
    }
    this.setState({
      visitedNodes: vNodes
    })
  }



  /**
     * find the selected node on the tree. Used in term detail component
     * @param {*} node
     * @param {*} shortForm
     */
  findSelectedTerm (node, shortForm) {
    if (node.modified_short_form === shortForm) {
      this.setState({
        selectedNode: node,
        showNodeDetailPage: true
      })
    } else if (node.has_children) {
      for (let i = 0; i < node.children.length; i++) {
        this.findSelectedTerm(node.children[i], shortForm)
      }
    }
  }


  /**
   * handle the click on the reset button tree. 
   * @param {*} e 
   * @param {*} value 
   */
  handleResetTreeBtn(){
    let initialTreeData = this.state.originalTreeData;
    this.setState({
      treeData: initialTreeData,
      expandedNodes: [],
      visitedNodes: [],
      currentExpandedTerm: '',
      currentClickedTerm: '',
      selectedNode: '',
      showNodeDetailPage: false,
      targetNodeIri: "",
      openTreeRoute: [],
      isTreeRouteShown: false
    });
  }



  /**
     * Event handler for selecting a node in a tree
     * @param {*} e
     * @param {*} value
     */
  handleSelect = (e, value) => {
    const tree = this.state.treeData
    for (let i = 0; i < tree.length; i++) {
      this.findSelectedTerm(tree[i], value)
    }
  }


  componentDidMount(){
    this.setTreeData();
  }

  componentDidUpdate(){
    this.setTreeData();
  }
  

  render () {
      
    return (
        <div>
             {this.state.searchWaiting && 
                <div className='loading-sign-div'>
                <CircularProgress  size={100} />
                </div>
              }  
             { !this.state.searchWaiting && this.state.termTree &&
                <Grid container spacing={0} className="tree-view-container">
                    <Grid item xs={5} className="tree-container">
                        <Button 
                          variant="contained" 
                          className='reset-tree-btn' 
                          startIcon={<RestartAltIcon />}
                          onClick={this.handleResetTreeBtn}
                          >
                          Reset Tree
                        </Button> 
                        <hr />
                        <TreeView
                        defaultCollapseIcon={<MinusSquare />}
                        defaultExpandIcon={<PlusSquare />}
                        defaultEndIcon={<CloseSquare />}
                        expanded={this.state.expandedNodes}
                        onNodeToggle={this.handleChange}
                        onNodeSelect={this.handleSelect}
                        defaultExpanded={this.state.expandedNodes}
                        >
                        {this.createTree(this.state.treeData)}
                        </TreeView>
                    </Grid>
                    {this.state.showNodeDetailPage && <Grid item xs={7} className="node-table-container">
                        <TermPage
                        term={this.state.selectedNode}
                        />
                    </Grid>}
                </Grid> 
             }
             { !this.state.searchWaiting && this.state.propertyTree && 
                <Grid container spacing={0} className="tree-view-container">
                    <Grid item xs={5} className="tree-container">
                      <Button 
                            variant="contained" 
                            className='reset-tree-btn' 
                            startIcon={<RestartAltIcon />}
                            onClick={this.handleResetTreeBtn}
                            >
                            Reset Tree
                          </Button> 
                          <hr />
                      <TreeView
                          defaultCollapseIcon={<MinusSquare />}
                          defaultExpandIcon={<PlusSquare />}
                          defaultEndIcon={<CloseSquare />}
                          expanded={this.state.expandedNodes}
                          onNodeToggle={this.handleChange}
                          onNodeSelect={this.handleSelect}
                          defaultExpanded={this.state.expandedNodes}

                      >
                          {this.createTree(this.state.treeData)}
                      </TreeView>
                    </Grid>
                    {this.state.showNodeDetailPage && <Grid item xs={7} className="node-table-container">
                    <PropertyPage
                        property={this.state.selectedNode}
                    />
                    </Grid>}

                </Grid>             
             }
        </div>
     
    )
  }
}

export default ClassTree
