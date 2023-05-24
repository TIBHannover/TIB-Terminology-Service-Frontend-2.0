import React from 'react';


const DETAIL_TAB_ID = 0;

class ontologyDetail extends React.Component{
    constructor(props){
        super(props)
        this.state= ({

        })
        this.tabChange = this.tabChange.bind(this);
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