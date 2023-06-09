import React from 'react';
import {classMetaData, propertyMetaData, formatText, renderNodePageTabs} from './helpers';
import NodePageTabConfig from './listOfComponentsTabs.json';
import NodeDetail from './NodeDetail/NodeDetail';
import NodeNotes from './NodeNotes/NodeNotes';
import queryString from 'query-string'; 
import NodeGraph from './NodeGraph/NodeGraph';


const DETAIL_TAB_ID = 0;
const NOTES_TAB_ID = 1;
const GRAPH_TAB_ID = 2;


class NodePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      data: true,
      iriIsCopied: false,
      prevNode: "",
      componentIdentity: "",
      activeTab: DETAIL_TAB_ID,
      isSkos: false,
      lastRequestedTab: "",
      waiting: false,
      showDataAsJsonBtnHref: ""
    })
    this.tabChange = this.tabChange.bind(this);
    this.setTabOnLoad = this.setTabOnLoad.bind(this);
  }

  /**
   * Set the active tab and its page on load
   */
  setTabOnLoad(){
    let requestedTab = '';
    // let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
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

  /**
     * Handle the tab change in the node detail Top menu
     *
     * @param {*} e
     * @param {*} value
     */
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



  componentDidMount(){         
      this.setTabOnLoad();     
  }


  componentDidUpdate(){      
      this.setTabOnLoad();
  }

  componentWillUnmount(){
    this.setTabOnLoad();
  }


  render () {    
    return (
      <div className='row'>
        <ul className="nav nav-tabs nav-tabs-node">
          {renderNodePageTabs(NodePageTabConfig, this.tabChange, this.props.ontology, this.state.activeTab, this.props.componentIdentity)}
        </ul>
        {!this.state.waiting && (this.state.activeTab === DETAIL_TAB_ID) &&
          <NodeDetail
          iri={this.props.iri}
          ontology={this.props.ontology}
          componentIdentity={this.props.componentIdentity}
          extractKey={this.props.extractKey}
          isSkos={this.props.isSkos}
          isIndividual={false}
          />
        }
        {!this.state.waiting && (this.state.activeTab === NOTES_TAB_ID) &&
          <NodeNotes/>
        }
        {!this.state.waiting && (this.state.activeTab === GRAPH_TAB_ID) &&
          <NodeGraph
          iri={this.props.iri}
          ontology={this.props.ontology}
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
