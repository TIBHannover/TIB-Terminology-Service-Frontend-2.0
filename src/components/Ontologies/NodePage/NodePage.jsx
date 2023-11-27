import React from 'react';
import NodePageTabConfig from './listOfComponentsTabs.json';
import NodeDetail from './NodeDetail/NodeDetail';
import queryString from 'query-string'; 
import NodeGraph from './NodeGraph/NodeGraph';
import NoteList from '../Note/NoteList';
import {getNodeByIri, getSkosNodeByIri} from '../../../api/fetchData';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Toolkit from '../../common/Toolkit';




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
    this.renderTabs = this.renderTabs.bind(this);
  }


  setTabOnLoad(){
    let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
    let requestedTab = targetQueryParams.subtab;       
    let lastRequestedTab = this.state.lastRequestedTab;    
    let activeTabId = this.state.activeTab;            
    if (requestedTab !== lastRequestedTab && requestedTab === 'notes'){
      activeTabId = NOTES_TAB_ID;
    }
    else if (requestedTab !== lastRequestedTab && requestedTab === 'graph'){
      activeTabId = GRAPH_TAB_ID;      
    }
    else if (requestedTab !== lastRequestedTab){
      activeTabId = DETAIL_TAB_ID;
    }  
    
    if(activeTabId !== this.state.activeTab){
        this.setState({        
          activeTab: activeTabId,
          waiting: false,
          lastRequestedTab: requestedTab      
        });
    }    
  }

  

  tabChange = (e, v) => {         
    try{
      let selectedTabId = e.target.dataset.value;      
      this.setState({waiting: true});  
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
    if(this.props.isSkos && this.props.componentIdentity === "individual"){
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

 

  renderTabs(){
      let result = [];         
      for(let configItemKey in NodePageTabConfig){
          let configObject = NodePageTabConfig[configItemKey];                 
          let linkUrl = Toolkit.setParamInUrl('subtab', NodePageTabConfig[configItemKey]['urlEndPoint'])
          if(this.props.componentIdentity === "term" || configObject['id'] !== 'graph'){
            if(process.env.REACT_APP_NOTE_FEATURE !== "true" && configItemKey === "Notes"){
              continue;
            }
            result.push(
              <li className="nav-item ontology-detail-nav-item" key={configObject['keyForRenderAsTabItem']}>
                  <Link 
                      onClick={this.tabChange} 
                      data-value={configObject['tabId']} 
                      className={(this.state.activeTab === parseInt(configObject['tabId'])) ? "nav-link active" : "nav-link"}
                      to={linkUrl}           
                      >              
                      {configObject['tabTitle']}
                  </Link>
              </li>
            );
          }      
        }
  
    return result;
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
          {this.renderTabs()}
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
            targetArtifactLabel={this.state.targetTerm.label}
            isGeneric={false}
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

export default withRouter(NodePage);
