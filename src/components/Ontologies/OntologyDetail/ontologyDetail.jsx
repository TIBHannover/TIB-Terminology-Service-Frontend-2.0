import React from 'react';
import queryString from 'query-string'; 
import NodePage from '../NodePage/NodePage';


const DETAIL_TAB_ID = 0;
const NOTES_TAB_ID = 1;

class ontologyDetail extends React.Component{
    constructor(props){
        super(props)
        this.state= ({
            waiting: false,
            activeTab: DETAIL_TAB_ID

        })
        this.tabChange = this.tabChange.bind(this);
        this.setTabOnLoad = this.setTabOnLoad.bind(this);
    }

 /**
   * Set the active tab and its page on load
   */
  setTabOnLoad(){
    let requestedTab = this.props.match.params.tab;
    let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
    let lastRequestedTab = this.state.lastRequestedTab;    
    if (requestedTab !== lastRequestedTab && requestedTab === 'terms'){
      this.setState({        
        activeTab: NOTES_TAB_ID,
        waiting: false,
        lastRequestedTab: requestedTab,
        targetTermIri: targetQueryParams.iri
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
     * Handle the tab change in the ontology detail Top menu
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
}

export default ontologyDetail;