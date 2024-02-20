import {useEffect, useState} from 'react';
import NodePageTabConfig from './listOfComponentsTabs.json';
import { TermDetailTable } from './TermDetailTable/TermDetailTable';
import { TermGraph } from './TermGraph/TermGraph';
import NoteList from '../Note/NoteList';
import SkosApi from '../../../api/skos';
import TermApi from '../../../api/term';
import { Link } from 'react-router-dom';
import Toolkit from '../../../Libs/Toolkit';
import { getNoteList } from '../../../api/tsMicroBackendCalls';
import Graph from '../../common/Graph/Graph';




const DETAIL_TAB_ID = 0;
const NOTES_TAB_ID = 1;
const GRAPH_TAB_ID = 2;



const TermDetail = (props) => {
  
  const [activeTab, setActiveTab] = useState(DETAIL_TAB_ID);
  const [lastRequestedTab, setLastRequestedTab] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [targetTerm, setTargetTerm] = useState({"iri": null} );  
  const [notesCount, setNotesCount] = useState("")  


  async function fetchTheTargetTerm(){
      let term = null
      if(props.isSkos && props.componentIdentity === "individual"){
        let skosApi = new SkosApi({ontologyId:props.ontology.ontologyId, iri:props.iri})
        await skosApi.fetchSkosTerm();
        term = skosApi.skosTerm;      
      }
      else{
        let termApi = new TermApi(props.ontology.ontologyId, encodeURIComponent(props.iri), props.extractKey);
        await termApi.fetchTerm();      
        term = termApi.term;
      }

      let countOfNotes = 0;
      if(process.env.REACT_APP_NOTE_FEATURE === "true"){
        countOfNotes = await getNoteList({ontologyId:props.ontology.ontologyId, type:null, pageNumber:0, pageSize:1, targetTerm:null, onlyOntologyOriginalNotes:false});    
        countOfNotes = countOfNotes ? countOfNotes['stats']['total_number_of_records'] : 0;
      }

      setTargetTerm(term);   
      setNotesCount(countOfNotes);    
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



  return(
    <div className='row'>
      <div className='col-sm-12'>
        <RenderTermDetailTab 
            componentIdentity={props.componentIdentity}
            tabChangeHandler={tabChangeHandler}
            activeTab={activeTab}
            noteCounts={notesCount}
        />
        {!waiting && (activeTab === DETAIL_TAB_ID) &&
          <TermDetailTable
            iri={props.iri}
            ontology={props.ontology.ontologyId}
            componentIdentity={props.componentIdentity}
            extractKey={props.extractKey}
            isSkos={props.isSkos}
            isIndividual={false}
            node={targetTerm}
          />
        }
        {!waiting && (activeTab === NOTES_TAB_ID) &&
          <NoteList            
            key={'notesPage'}
            ontology={props.ontology}          
            term={targetTerm}    
            termType={props.typeForNote}                                                                 
          />
        }
        {!waiting && (activeTab === GRAPH_TAB_ID) &&        
          <Graph 
            ontologyId={props.ontology.ontologyId}
            termIri={props.iri}
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
          if(configItemKey === "Notes" && process.env.REACT_APP_NOTE_FEATURE !== "true"){
            continue;
          }
          if(configItemKey === "GraphView" && ["props", "individuals"].includes(props.componentIdentity)){
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
                    {configItemKey === "Notes" ? ` (${props.noteCounts})` : ""}
                </Link>
            </li>
          );          
        }

    return result;
  }

  return (
    <ul className="nav nav-tabs nav-tabs-node">
          {createTabs()}
    </ul>
  );
}

export default TermDetail;
