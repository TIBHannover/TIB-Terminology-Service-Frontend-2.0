import { useEffect} from 'react';



export const TermGraph = (props) => {

  function generateGraph(){
    if(props.isSkos){      
      let termFetchUrl = `${process.env.REACT_APP_API_BASE_URL}/${props.ontology}/skos/${encodeURIComponent(encodeURIComponent(props.iri))}/graph`;
      window["initLegacyGraphView"](termFetchUrl, "", false);
    }
    else if(props.iri){
      let termType = "terms";      
      let termFetchUrl = `${process.env.REACT_APP_API_BASE_URL}/${props.ontology}/${termType}?iri=`;
      window["initLegacyGraphView"](termFetchUrl, props.iri, true);
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
