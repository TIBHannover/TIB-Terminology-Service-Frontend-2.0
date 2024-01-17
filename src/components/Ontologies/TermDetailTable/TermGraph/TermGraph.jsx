import { useEffect} from 'react';



export const TermGraph = (props) => {

  function generateGraph(){
    if(props.iri){
        window["initLegacyGraphView"](
            process.env.REACT_APP_API_BASE_URL + `/`+ props.ontology + `/terms?iri=` , props.iri);
    }
  }


  useEffect(() => {
    generateGraph();
  }, []);


  return(
    <div id="ontology_vis"/>     
  )
}
