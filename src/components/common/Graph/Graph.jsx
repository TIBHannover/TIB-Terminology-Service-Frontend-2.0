import { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import TermApi from '../../../api/term';


const Graph = (props) => {

    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);


    const container = useRef(null);
    const options = {};



    async function fetchGraphData(){
        let termApi = new TermApi(props.ontologyId, props.termIri, "class");
        let graphData = await termApi.fetchGraphData();
        let graphNodes = [];
        let graphEdges = [];
        if(graphData){
            for (let node of graphData['nodes']){
                graphNodes.push({id: node['iri'], label:node['label']})
            }
            for (let edge of graphData['edges']){
                graphEdges.push(
                    {
                        from: edge['source'],
                        to:edge['target'],
                        label:edge['label'],
                        arrows:{to:true}
                    }
                )
            }
        }
        setNodes(graphNodes);
        setEdges(graphEdges);
    }
        

    
    useEffect(() => {
        fetchGraphData();
    }, []);



    useEffect(() => {
        const network = container.current && new Network(container.current, { nodes, edges }, options);
    }, [container, nodes, edges]);

    return <div ref={container} style={{ height: '500px', width: '800px' }} />;
};

export default Graph;
