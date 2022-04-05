import React from 'react'
import './ClassTree.css';
import Grid from '@material-ui/core/Grid'
import TreeView from '@material-ui/lab/TreeView'
import StyledTreeItem from './widgets/StyledTreeItem'
import TermPage from '../TermPage/TermPage'
import { MinusSquare, PlusSquare, CloseSquare } from './widgets/icons'
import {getChildren} from '../../../api/nfdi4chemapi';

class ClassTree extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      rootTerms: this.props.rootTerms,
      expandedNodes: [],
      treeData: this.props.rootTerms,
      visitedNodes: [],
      currentExpandedTerm: '',
      currentClickedTerm: '',
      selectedTerm: '',
      showTermDetailPage: false
    })
  }

  
  /**
     * Construct the classes(terms) tree
     * @param {*} nodes
     * @returns
     */
  createTree = (nodes) => {
    return nodes.map((el) => {
      return (
        <StyledTreeItem key={el.id} nodeId={el.short_form} label={el.label} className="tree-element"
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
      let childrenNodes = await getChildren(node['_links']['children']['href'], 'term');
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
        selectedTerm: node,
        showTermDetailPage: true
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



  render () {
    return (
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
        {this.state.showTermDetailPage && <Grid item xs={7} id="terms-table-container">
          <TermPage
            term={this.state.selectedTerm}
          />
        </Grid>}
      </Grid>
    )
  }
}

export default ClassTree
