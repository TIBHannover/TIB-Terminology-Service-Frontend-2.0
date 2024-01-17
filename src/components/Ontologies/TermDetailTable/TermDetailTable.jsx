import {useEffect, useState} from 'react';
import NodePageTabConfig from './listOfComponentsTabs.json';
import NodeDetail from './NodeDetail/NodeDetail';
import { TermGraph } from './TermGraph/TermGraph';
import NoteList from '../Note/NoteList';
import {getNodeByIri, getSkosNodeByIri} from '../../../api/fetchData';
import { Link } from 'react-router-dom';
import Toolkit from '../../common/Toolkit';




const DETAIL_TAB_ID = 0;
const NOTES_TAB_ID = 1;
const GRAPH_TAB_ID = 2;



const TermDetailTable = (props) => {
  
  const [activeTab, setActiveTab] = useState(DETAIL_TAB_ID);
  const [lastRequestedTab, setLastRequestedTab] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [targetTerm, setTargetTerm] = useState({"iri": null} );  


  async function fetchTheTargetTerm(){
      let term = null
      if(props.isSkos && props.componentIdentity === "individual"){
        term = await getSkosNodeByIri(props.ontology.ontologyId, encodeURIComponent(props.iri));      
      }
      else{      
        term = await getNodeByIri(props.ontology.ontologyId, encodeURIComponent(props.iri), props.extractKey);      
      }
      setTargetTerm(term);       
  }


  function setTabOnLoad(){      
      let url = new URL(window.location);
      let requestedTab = url.searchParams.get("subtab");      
      let activeTabId = activeTab;            
      if (requestedTab !== lastRequestedTab && requestedTab === 'notes'){
        activeTabId = NOTES_TAB_ID;
      }
      else if (requestedTab !== lastRequestedTab && requestedTab === 'graph'){
        activeTabId = GRAPH_TAB_ID;      
      }
      else if (requestedTab !== lastRequestedTab){
        activeTabId = DETAIL_TAB_ID;
      }  
      
      if(activeTabId !== activeTab){
        setActiveTab(activeTabId);
        setWaiting(false);
        setLastRequestedTab(requestedTab);         
      }    
  }

  function tabChangeHandler(e, v){         
    try{
      let selectedTabId = e.target.dataset.value;      
      setWaiting(true);
      setActiveTab(selectedTabId);
      setWaiting(false);     
    } 
    catch(e){          
      setActiveTab(DETAIL_TAB_ID);
      setWaiting(false);       
    }      
  }


  useEffect(() =>{
    setTabOnLoad();
    fetchTheTargetTerm();    
  }, [props.iri, activeTab]);




  return (
    <RenderTermDetailTable 
        waiting={waiting}
        activeTab={activeTab}
        iri={props.iri}
        ontology={props.ontology}
        componentIdentity={props.componentIdentity}
        extractKey={props.extractKey}
        isSkos={props.isSkos}
        node={targetTerm}
        typeForNote={props.typeForNote}
        tabChangeHandler={tabChangeHandler}
    />
  );
}



const RenderTermDetailTable = (props) => {

  return(
    <div className='row'>
      <div className='col-sm-12'>
        <RenderTermDetailTab 
            componentIdentity={props.componentIdentity}
            tabChangeHandler={props.tabChangeHandler}
            activeTab={props.activeTab}
        />
        {!props.waiting && (props.activeTab === DETAIL_TAB_ID) &&
          <NodeDetail
            iri={props.iri}
            ontology={props.ontology.ontologyId}
            componentIdentity={props.componentIdentity}
            extractKey={props.extractKey}
            isSkos={props.isSkos}
            isIndividual={false}
            node={props.node}
          />
        }
        {!props.waiting && (props.activeTab === NOTES_TAB_ID) &&
          <NoteList                                                              
            componentIdentity={'notes'}
            key={'notesPage'}
            ontology={props.ontology}
            targetArtifactIri={props.iri}
            targetArtifactType={props.typeForNote}
            targetArtifactLabel={props.node.label}
            isGeneric={false}                                                                   
          />
        }
        {!props.waiting && (props.activeTab === GRAPH_TAB_ID) &&
          <TermGraph
            iri={props.iri}
            ontology={props.ontology.ontologyId}
            componentIdentity={props.componentIdentity}
            extractKey={props.extractKey}
            isSkos={props.isSkos}
            isIndividual={false}
          />
        }
      </div>        
    </div>
  );
}



const RenderTermDetailTab = (props) => {

  function  createTabs(){
      let result = [];         
      for(let configItemKey in NodePageTabConfig){
          let configObject = NodePageTabConfig[configItemKey];                 
          let linkUrl = Toolkit.setParamInUrl('subtab', NodePageTabConfig[configItemKey]['urlEndPoint'])
          if(props.componentIdentity === "terms" || configObject['id'] !== 'graph'){
            if(process.env.REACT_APP_NOTE_FEATURE !== "true" && configItemKey === "Notes"){
              continue;
            }
            result.push(
              <li className="nav-item ontology-detail-nav-item" key={configObject['keyForRenderAsTabItem']}>
                  <Link 
                      onClick={props.tabChangeHandler} 
                      data-value={configObject['tabId']} 
                      className={(props.activeTab === parseInt(configObject['tabId'])) ? "nav-link active" : "nav-link"}
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

  return (
    <ul className="nav nav-tabs nav-tabs-node">
          {createTabs()}
    </ul>
  );
}

export default TermDetailTable;
