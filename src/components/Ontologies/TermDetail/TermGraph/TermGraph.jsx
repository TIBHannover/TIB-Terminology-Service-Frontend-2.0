import { useEffect} from 'react';



export const TermGraph = (props) => {


    function initLegacyGraphView(endpointPrefix, termiri, olsMode) {
      let tmpnetworkOptions={ webservice : {URL: endpointPrefix, OLSschema:olsMode}}
      let term = termiri
      let visoptions = {
        physics: {
          enabled:false
        },
        hierarchical: {
          enabled:false,
          edgeMinimization: true,
        },
      }
      
    let app = require("ols-graphview");
    let instance = new app();
    if(document.getElementById('ontology_vis')){
      document.getElementById('ontology_vis').innerHTML = '';
    }
    instance.visstart("ontology_vis", term, tmpnetworkOptions, {}, visoptions);
  }


  function generateGraph(){
    if(props.isSkos){      
      let termFetchUrl = `${process.env.REACT_APP_API_BASE_URL}/${props.ontology}/skos/${encodeURIComponent(encodeURIComponent(props.iri))}/graph`;
      initLegacyGraphView(termFetchUrl, "", false);
    }
    else if(props.iri){
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
