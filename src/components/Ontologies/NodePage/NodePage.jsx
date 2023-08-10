import React from 'react';
import {renderNodePageTabs} from './helpers';
import NodePageTabConfig from './listOfComponentsTabs.json';
import NodeDetail from './NodeDetail/NodeDetail';
import queryString from 'query-string'; 
import NodeGraph from './NodeGraph/NodeGraph';
import NoteList from '../Note/NoteList';
import {getNodeByIri, getSkosNodeByIri} from '../../../api/fetchData';


const DETAIL_TAB_ID = 0;
const NOTES_TAB_ID = 1;
const GRAPH_TAB_ID = 2;


class NodePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({            
      prevNode: "",      
      activeTab: DETAIL_TAB_ID,      
      lastRequestedTab: "",
      waiting: false,
      targetTerm: {"iri": null}      
    })
    this.tabChange = this.tabChange.bind(this);
    this.setTabOnLoad = this.setTabOnLoad.bind(this);
    this.fetchTheTargetTerm = this.fetchTheTargetTerm.bind(this);
  }


  setTabOnLoad(){
    let requestedTab = '';    
    let lastRequestedTab = this.state.lastRequestedTab;    
    if (requestedTab !== lastRequestedTab && requestedTab === 'notes'){
      this.setState({        
        activeTab: NOTES_TAB_ID,
        waiting: false,
        lastRequestedTab: requestedTab,
        
      });
    }
    if (requestedTab !== lastRequestedTab && requestedTab === 'graph'){
      this.setState({        
        activeTab: GRAPH_TAB_ID,
        waiting: false,
        lastRequestedTab: requestedTab,
        
      });
    }
    else if (requestedTab !== lastRequestedTab){
      this.setState({        
        activeTab: DETAIL_TAB_ID,
        waiting: false,
        lastRequestedTab: requestedTab

      });
    }
  }

  

  tabChange = (e, v) => {
    try{
      let selectedTabId = e.target.dataset.value;         
      this.setState({
        waiting: true
      });
  
      this.setState({
        activeTab: parseInt(selectedTabId),
        waiting: false
      });
    } 
    catch(e){
      this.setState({
        activeTab: DETAIL_TAB_ID,
        waiting: false
      });
    }      
  }



  async fetchTheTargetTerm(){
    let term = null
    if(this.props.isSkos){
      term = await getSkosNodeByIri(this.props.ontology.ontologyId, encodeURIComponent(this.props.iri));      
    }
    else{      
      term = await getNodeByIri(this.props.ontology.ontologyId, encodeURIComponent(this.props.iri), this.props.extractKey);      
    }
    this.setState({
      targetTerm: term,
      prevNode: this.props.iri
    });
  }



  componentDidMount(){         
      this.setTabOnLoad();
      this.fetchTheTargetTerm();  
  }


  componentDidUpdate(){      
      this.setTabOnLoad();      
      let prevNode = this.state.prevNode;                
      if(this.props.iri !== prevNode){
        this.fetchTheTargetTerm();        
      }
  }


  render () {    
    return (
      <div className='row'>
        <ul className="nav nav-tabs nav-tabs-node">
          {renderNodePageTabs(NodePageTabConfig, this.tabChange, this.props.ontology.ontologyId, this.state.activeTab, this.props.componentIdentity)}
        </ul>
        {!this.state.waiting && (this.state.activeTab === DETAIL_TAB_ID) &&
          <NodeDetail
            iri={this.props.iri}
            ontology={this.props.ontology.ontologyId}
            componentIdentity={this.props.componentIdentity}
            extractKey={this.props.extractKey}
            isSkos={this.props.isSkos}
            isIndividual={false}
            node={this.state.targetTerm}
          />
        }
        {!this.state.waiting && (this.state.activeTab === NOTES_TAB_ID) &&
          <NoteList                                                              
            componentIdentity={'notes'}
            key={'notesPage'}
            ontology={this.props.ontology}
            targetArtifactIri={this.props.iri}
            targetArtifactType={this.props.typeForNote}
            // targetNoteId={this.props.match.params.targetId}                                                            
          />
        }
        {!this.state.waiting && (this.state.activeTab === GRAPH_TAB_ID) &&
          <NodeGraph
          iri={this.props.iri}
          ontology={this.props.ontology.ontologyId}
          componentIdentity={this.props.componentIdentity}
          extractKey={this.props.extractKey}
          isSkos={this.props.isSkos}
          isIndividual={false}
          />
        }
      </div>
    )
  }
}

export default NodePage;
