import React from 'react';
import './DataTree.css';
import Grid from '@material-ui/core/Grid';
import TreeView from '@material-ui/lab/TreeView';
import StyledTreeItem from './widgets/StyledTreeItem';
import TermPage from '../TermPage/TermPage';
import PropertyPage from '../PropertyPage/PropertyPage';
import { MinusSquare, PlusSquare, CloseSquare } from './widgets/icons';
import {getChildren, getTreeRoutes} from '../../../api/nfdi4chemapi';
import { click } from '@testing-library/user-event/dist/click';

class ClassTree extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      rootNodes: [],
      expandedNodes: [],
      treeData: [],
      visitedNodes: [],
      currentExpandedTerm: '',
      currentClickedTerm: '',
      selectedNode: '',
      showNodeDetailPage: false,
      componentIdentity: "",
      termTree: false,
      propertyTree: false,
      targetNodeIri: "",
      openTreeRoute: []
    })
    this.setTreeData = this.setTreeData.bind(this);
    this.processTarget = this.processTarget.bind(this);
    this.expandTreeByTarget = this.expandTreeByTarget.bind(this);
  }


  /**
   * set data from input props
   * @param {*} nodes 
   * @returns 
   */
  setTreeData(){
    let rootNodes = this.props.rootNodes;
    let componentIdentity = this.props.componentIdentity;
    if (componentIdentity != this.state.componentIdentity && rootNodes.length != 0 && this.state.rootNodes.length == 0){
        if(componentIdentity == 'term'){
            this.setState({
                rootNodes: rootNodes,
                treeData: rootNodes,
                componentIdentity: componentIdentity,
                termTree: true,
                propertyTree: false
              });
              this.processTarget(componentIdentity, rootNodes);
        }
        else if(componentIdentity == 'property'){
            this.setState({
                rootNodes: rootNodes,
                treeData: rootNodes,
                componentIdentity: componentIdentity,
                termTree: false,
                propertyTree: true
              });
              this.processTarget(componentIdentity, rootNodes);
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
      target = target.trim();
      if(target != undefined && this.state.targetNodeIri != target){
        let ancestors = [];
        if(componentIdentity == "term"){
          ancestors = await getTreeRoutes(target, 'terms', [], false);
        }
        else{
          ancestors = await getTreeRoutes(target, 'properties', [], false);
        }
        
        this.setState({
            targetNodeIri: target,
            openTreeRoute: ancestors
        });
          
      }
  }

  /**
   * Exapand the tree when there is an input target (term/property). Used for showing the selected term/property detail when 
   * called directy by url via 'iri' 
   * @param {*} nodes 
   * @returns 
   */
  expandTreeByTarget(){
    let routes = this.state.openTreeRoute;
    console.info(routes);
    routes = routes.reverse();
    if (routes.length > 0){
      for(let i=0; i < routes.length; i++){
        let treeElement = document.getElementById('tree_element_' + routes[i]);
        if(treeElement !== null && treeElement.getElementsByTagName('ul').length == 0){
          treeElement.getElementsByClassName('MuiTreeItem-content')[0].click();
        }
      }
      
    }
  }

  
  /**
     * Construct the tree
     * @param {*} nodes
     * @returns
     */
  createTree = (nodes) => {
    return nodes.map((el) => {
      return (
        <StyledTreeItem 
          key={el.id} 
          nodeId={el.short_form} 
          label={el.label} 
          className="tree-element"
          id={"tree_element_" + el.short_form}
          defaultCollapseIcon={<MinusSquare />}
          defaultExpandIcon={<PlusSquare />}
          defaultEndIcon={<CloseSquare />}>
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
    if (node.short_form === shortForm && node.has_children) {
      let childrenNodes = await getChildren(node['_links']['hierarchicalChildren']['href'], this.state.componentIdentity);
      if (childrenNodes.length > 0){
        node.children = childrenNodes;
        this.setState({
          expandedNodes: expanded,
          currentExpandedTerm: node
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
    if (node.short_form === shortForm) {
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
    this.expandTreeByTarget();
  }
  

  render () {
      
    return (
        <div>
             { this.state.termTree &&
                <Grid container spacing={0} id="term-view-container">
                    <Grid item xs={5} id="terms-tree-container">
                        <TreeView
                        defaultCollapseIcon={<MinusSquare />}
                        defaultExpandIcon={<PlusSquare />}
                        defaultEndIcon={<CloseSquare />}
                        expanded={this.state.expandedNodes}
                        onNodeToggle={this.handleChange}
                        onNodeSelect={this.handleSelect}

                        >
                        {this.createTree(this.state.treeData)}
                        </TreeView>
                    </Grid>
                    {this.state.showNodeDetailPage && <Grid item xs={7} id="terms-table-container">
                        <TermPage
                        term={this.state.selectedNode}
                        />
                    </Grid>}
                </Grid> 
             }
             { this.state.propertyTree && 
                <Grid container spacing={0} id="term-view-container">
                    <Grid item xs={5} id="props-tree-container">
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
                    {this.state.showNodeDetailPage && <Grid item xs={7} id="props-table-container">
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
