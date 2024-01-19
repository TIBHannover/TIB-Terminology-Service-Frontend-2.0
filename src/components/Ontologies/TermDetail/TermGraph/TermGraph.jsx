import { useEffect} from 'react';



export const TermGraph = (props) => {

  function generateGraph(){
    if(props.iri){
      let termType = "terms";      
      let termFetchUrl = `${process.env.REACT_APP_API_BASE_URL}/${props.ontology}/${termType}?iri=`;
      window["initLegacyGraphView"](termFetchUrl, props.iri);
    }
  }


  useEffect(() => {
    generateGraph();
  }, []);


  return(
    <div id="ontology_vis"/>     
  )
}
