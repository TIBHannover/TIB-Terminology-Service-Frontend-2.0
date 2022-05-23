import React from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";




const Example = (data) => (

  <List
    className="List"
    // innerElementType="ul"
    height={1000}
    itemCount={data.length}
    itemSize={35}
    width={400}
  >
      {({ index, style }) => {
      return (
        <li style={style}>
          {data[index].label}
        </li>
      );
    }}
  </List>
  // <AutoSizer>
  //   {({ height, width }) => (
      
  //   )}
  // </AutoSizer>
);




class ClassTree extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({      
      treeData: [],
      rootNodes: [],
      componentIdentity: "",
      termTree: true,
      propertyTree: false,                
      ontologyId: "",
      childrenFieldName: "hierarchicalChildren",
      ancestorsFieldName: "hierarchicalAncestors"
    })
    this.setTreeData = this.setTreeData.bind(this);
    // this.Example = this.Example.bind(this);
    // this.processTarget = this.processTarget.bind(this);
    // this.expandTreeByTarget = this.expandTreeByTarget.bind(this);
    // this.handleResetTreeBtn = this.handleResetTreeBtn.bind(this);   
    // this.setTreeDataPointers = this.setTreeDataPointers.bind(this);

  }

  async setTreeData(){
    let rootNodes = this.props.rootNodes;
    let ontologyId = this.props.ontology;
    let componentIdentity = this.props.componentIdentity;
    if (componentIdentity != this.state.componentIdentity && rootNodes.length != 0 && this.state.rootNodes.length == 0){
        if(componentIdentity == 'term'){         
            this.setState({                
                treeData: rootNodes, 
                rootNodes: rootNodes,               
                componentIdentity: componentIdentity,
                termTree: true,
                propertyTree: false,                
                ontologyId: ontologyId,
                childrenFieldName: "hierarchicalChildren",
                ancestorsFieldName: "hierarchicalAncestors"
              })              
        }              
    }
  }

  componentDidMount(){
    this.setTreeData();
  }

  componentDidUpdate(){
    this.setTreeData();
  }


  render (){
    return(
     <Example data={this.state.treeData} /> 
    )
  }




}

export default ClassTree;