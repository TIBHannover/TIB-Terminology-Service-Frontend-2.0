import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import NodePage from '../NodePage/NodePage';
import { withRouter } from 'react-router-dom';
import { MatomoWrapper } from '../../Matomo/MatomoWrapper';
import Tree from './Tree';
import JumpTo from '../JumpTo/Jumpto';



class DataTree extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      selectedNodeIri: '',
      showNodeDetailPage: false,
      componentIdentity: "",
      termTree: false,
      propertyTree: false,
      ontologyId: '',  
      isSkos: false      
    })

  }


componentDidMount(){
  // document.addEventListener('click', this.handleClickOutside, true);
}


render(){
  return(    
     <div className="row tree-view-container"> 
        <div className="col-sm-6 tree-container-left-part">
        <JumpTo
          ontologyId={this.props.ontology}
        />
        <div className='row'>
              <Tree
                rootNodes={this.props.rootNodes}
                componentIdentity={this.props.componentIdentity}
                iri={this.props.iri}
                key={this.props.key}                    
                ontology={this.props.ontology}
                rootNodeNotExist={this.props.rootNodeNotExist}
                iriChangerFunction={this.props.iriChangerFunction}
                lastState={this.props.lastState}
                domStateKeeper={this.props.domStateKeeper}
                isSkos={this.props.isSkos}
              />
        </div>                 
        
        </div>
        {this.state.termTree && this.state.showNodeDetailPage && 
          <div className="col-sm-6 node-table-container">
            <MatomoWrapper>
            <NodePage
              iri={this.state.selectedNodeIri}
              ontology={this.state.ontologyId}
              componentIdentity="term"
              extractKey="terms"
              isSkos={this.state.isSkos}
            />
            </MatomoWrapper>
        </div>
        }
        {this.state.propertyTree && this.state.showNodeDetailPage && 
          <div className="col-sm-6 node-table-container">
          <MatomoWrapper>
          <NodePage
              iri={this.state.selectedNodeIri}
              ontology={this.state.ontologyId}
              componentIdentity="property"
              extractKey="properties"
          />
          </MatomoWrapper>
        </div>
        }
    </div>  
  )
}

}

export default withRouter(DataTree);



