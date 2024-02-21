import { useEffect} from 'react';
import 'ols-graphview/css/OLS-graphview.css';




export const TermGraph = (props) => {

  const graphApp = require("ols-graphview");
  const graph = new graphApp();


  const visoptions = {
    physics: {
      enabled:false
    },
    hierarchical: {
      enabled:false,
      edgeMinimization: true,
    },
  }
  



  function initLegacyGraphView(endpointPrefix, termiri, olsMode) {
    let tmpnetworkOptions={ webservice : {URL: endpointPrefix, OLSschema:olsMode}}
    
    if(document.getElementById('ontology_vis')){
      document.getElementById('ontology_vis').innerHTML = '';
    }
    graph.visstart("ontology_vis", termiri, tmpnetworkOptions, {}, visoptions);
}




  function generateGraph(){
   if(props.iri){
      let termType = "terms";      
      let termFetchUrl = `${process.env.REACT_APP_API_BASE_URL}/${props.ontology}/${termType}?iri=`;
      initLegacyGraphView(termFetchUrl, props.iri, true);
    }
  }


  useEffect(() => {
    generateGraph();
  }, []);


  useEffect(() => {
    generateGraph();
  }, [props.iri]);


  return(
    <div id="ontology_vis"/>     
  )
}
