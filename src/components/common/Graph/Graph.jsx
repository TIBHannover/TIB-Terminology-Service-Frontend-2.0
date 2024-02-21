import { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import TermApi from '../../../api/term';
import GraphNode from './Node';
import GraphEdge from './Edge';
import Toolkit from '../../../Libs/Toolkit';



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
        },
        physics: {
            enabled: true,
            barnesHut: {
              gravitationalConstant: -20000,
              centralGravity: 0.3,
              springLength: 10, 
              springConstant: 0.04,
              damping: 0.09,
              avoidOverlap: 0,
              stabilization: false
            }
        }
    };



    async function fetchGraphData(ontologyId, targetIri, reset=false){
        let termApi = new TermApi(ontologyId, targetIri, "class");
        let graphData = await termApi.fetchGraphData();
        let graphNodes = [...nodes];
        let graphEdges = [...edges];
        if(reset){
            graphNodes = [];
            graphEdges = [];
        }
        if(graphData){
            for (let node of graphData['nodes']){
                let gNode = new GraphNode({node:node});
                if(!Toolkit.objectExistInList(graphNodes, "id", gNode.id)){
                    graphNodes.push(gNode);
                }                
            }
            for (let edge of graphData['edges']){                
                let gEdge = new GraphEdge({edge:edge});
                if(!Toolkit.objectExistInList(graphEdges, "id", gEdge.id)){
                    graphEdges.push(gEdge);
                }                
            }
        }
        setNodes(graphNodes);
        setEdges(graphEdges);
    }



    function resetGraph(){
        fetchGraphData(props.ontologyId, props.termIri, true);
    }

    
    useEffect(() => {
        fetchGraphData(props.ontologyId, props.termIri);
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
                    fetchGraphData(props.ontologyId, nodeIri);                     
                }
            });
        }
    }, [graphNetwork]);



    return (
        <div className='graph-section'>
            <br></br>
            <div className='graph-control-panel'>
                <button className='btn btn-sm btn-secondary graph-ctl-btn' onClick={resetGraph}>Reset</button>
                <button className='btn btn-sm btn-secondary graph-ctl-btn'>Remove</button>
                <button className='btn btn-sm btn-secondary graph-ctl-btn'>Visit</button>
            </div>
            <div ref={container} className='graph-container' />
        </div>
    );
};

export default Graph;
