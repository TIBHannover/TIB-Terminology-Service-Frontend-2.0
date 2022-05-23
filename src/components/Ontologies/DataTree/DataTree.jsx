import React from 'react';
import '../../layout/ontologies.css';
import Grid from '@material-ui/core/Grid';
import TreeView from '@material-ui/lab/TreeView';
import StyledTreeItem from './widgets/StyledTreeItem';
import { MinusSquare, PlusSquare, CloseSquare } from './widgets/icons';
import CircularProgress from '@mui/material/CircularProgress';



class ClassTree extends React.Component {
    constructor (props) {
        super(props);
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
            originalTreeDataFlatPointers: {},
            isTreeLoaded: false
          })
          this.setTreeData = this.setTreeData.bind(this);        
    }


    async setTreeData(){        
        let ontologyId = this.props.ontology;
        let componentIdentity = this.props.componentIdentity;
        let callHeader = {
            'Accept': 'application/json'
          };
        let getCallSetting = {method: 'GET', headers: callHeader};
        // let url = "https://service.tib.eu/ts4tib/api/ontologies/uat/concepthierarchy?find_roots=SCHEMA&narrower=false&individual_count=1000000";
        let url = "http://terminology02.develop.service.tib.eu:8080/ts4tib/api/ontologies/" + ontologyId + "/termtree?includeObsoletes=false";
        let res =  await (await fetch(url, getCallSetting)).json();
        this.setState({
            treeData: res,
            ontologyId: ontologyId,
            isTreeLoaded: true
        });

    }


    createTree =  (nodes) => {    
        return nodes.map((el, index) => {
          return (
            <StyledTreeItem 
              key={el.data.iri}
              nodeId={el.data.short_form + "_" + index}          
              label={ el.data.label}   
              className="tree-element"          
              defaultCollapseIcon={<MinusSquare />}
              defaultExpandIcon={<PlusSquare />}
              defaultEndIcon={<CloseSquare />}
              >
              {Array.isArray(el.children) && !el.leaf
                ? this.createTree(el.children)
                : null
                }
            </StyledTreeItem>
          )
        })
      }


      handleChange = (e, value) => {
        this.setState({
            expandedNodes:value
          });
      }

      handleSelect = (e, value) => {   
        
      }

      componentDidMount(){
          if(!this.state.isTreeLoaded){
            this.setTreeData();
          }
        
      }
    
      componentDidUpdate(){
        if(!this.state.isTreeLoaded){
            this.setTreeData();
          }
      }
    

      render () {
      
        return (
            <div>
                 {!this.state.isTreeLoaded && 
                    <div className='loading-sign-div'>
                    <CircularProgress  size={100} />
                    </div>
                  }  
                 { 
                    <Grid container spacing={0} className="tree-view-container">
                        <Grid item xs={5} className="tree-container">                                      
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
                            {/* <TermPage
                            term={this.state.selectedNode}
                            /> */}
                        </Grid>}
                    </Grid> 
                 }
                 
            </div>
         
        )
      }
    


}

export default ClassTree;