import { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import TermApi from '../../../api/term';
import GraphNode from './Node';
import GraphEdge from './Edge';



const Graph = (props) => {

    const [graphNetwork, setGraphNetwork] = useState(null);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);


    const container = useRef(null);
    const options = {
        autoResize: true,
        height: '100%',
        width: '100%',
        locale: 'en',
        layout: {
            randomSeed: 1,
            improvedLayout:true,
            clusterThreshold: 150,           
        }
    };



    async function fetchGraphData(){
        let termApi = new TermApi(props.ontologyId, props.termIri, "class");
        let graphData = await termApi.fetchGraphData();
        let graphNodes = [];
        let graphEdges = [];
        if(graphData){
            for (let node of graphData['nodes']){
                let gNode = new GraphNode({node:node});
                graphNodes.push(gNode);
            }
            for (let edge of graphData['edges']){
                let gEdge = new GraphEdge({edge:edge});
                graphEdges.push(gEdge);
            }
        }
        setNodes(graphNodes);
        setEdges(graphEdges);
    }

    
    useEffect(() => {
        fetchGraphData();
    }, []);



    useEffect(() => {        
        if(container.current){
            setGraphNetwork(new Network(container.current, { nodes, edges }, options));            
        }
    }, [container, nodes, edges]);



    useEffect(() => {        
        if(graphNetwork){            
            graphNetwork.on("doubleClick", function (params) {        
                if (params.nodes.length > 0) {
                    let nodeIri = params.nodes[0];                              
                }
            });
        }
    }, [graphNetwork]);


    return <div ref={container} style={{ height: '700px', width: '800px' }} />;
};

export default Graph;
