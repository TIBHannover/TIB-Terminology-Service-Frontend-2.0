import React from 'react';
import '../../layout/ontologies.css';
import Grid from '@material-ui/core/Grid';
import TreeView from '@material-ui/lab/TreeView';
import StyledTreeItem from './widgets/StyledTreeItem';
import { MinusSquare, PlusSquare, CloseSquare } from './widgets/icons';
import CircularProgress from '@mui/material/CircularProgress';
import TermPage from '../TermPage/TermPage';
import PropertyPage from '../PropertyPage/PropertyPage';



class ClassTree extends React.Component {
    constructor (props) {
        super(props);
        this.state = ({
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
            isTreeLoaded: false
          })
          this.setTreeData = this.setTreeData.bind(this);        
    }


    async setTreeData(){        
        let ontologyId = this.props.ontology;
        let componentIdentity = this.props.componentIdentity;
        let urlSubPath = "";
        let isTermtree = "";
        if(componentIdentity === "term"){
          urlSubPath = "/termtree";
          isTermtree = true;
        }
        else if (componentIdentity === "property"){
          urlSubPath = "/propertytree";
          isTermtree = false;
        }

        let callHeader = {
            'Accept': 'application/json'
          };
        let getCallSetting = {method: 'GET', headers: callHeader};
        let url = "https://service.tib.eu/ts4tib/api/ontologies/uat/concepthierarchy?find_roots=SCHEMA&narrower=false&individual_count=1000000";
        // let url = "http://terminology02.develop.service.tib.eu:8080/ts4tib/api/ontologies/" + ontologyId +  urlSubPath + "?includeObsoletes=false";
        let data =  await (await fetch(url, getCallSetting)).json();
        this.setState({
            treeData: data,
            originalTreeData: data,
            ontologyId: ontologyId,
            isTreeLoaded: true,
            componentIdentity: componentIdentity,
            termTree: isTermtree,
            propertyTree: !isTermtree
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
              data-node={JSON.stringify(el.data)}              
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
         let node = JSON.parse(e.currentTarget.offsetParent.dataset.node);
        this.setState({
          selectedNode: node,
          showNodeDetailPage: true
        })
      }

      componentDidMount(){
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
                        {this.state.showNodeDetailPage && 
                        <Grid item xs={7} className="node-table-container">                      
                            {this.state.termTree &&  
                            <TermPage
                              iri={this.state.selectedNode.iri}
                              ontology={this.state.selectedNode.ontology_name}
                            />
                            }
                            {this.state.propertyTree &&  
                            <PropertyPage
                              property={this.state.selectedNode}
                              />
                            }
                        </Grid>}                            
                    </Grid> 
                 }
                 
            </div>
         
        )
      }
    


}

export default ClassTree;