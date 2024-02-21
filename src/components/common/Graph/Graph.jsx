import { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import TermApi from '../../../api/term';
import GraphNode from './Node';
import GraphEdge from './Edge';
import Toolkit from '../../../Libs/Toolkit';



const Graph = (props) => {
    
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [selectedEdges, setSelectedEdges] = useState([]);
    

    const nodes = useRef(new DataSet([]));
    const edges = useRef(new DataSet([]));
    const graphNetwork = useRef({});
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
            }
        }
    };



    async function fetchGraphData(ontologyId, targetIri, reset=false){
        let termApi = new TermApi(ontologyId, targetIri, "class");
        let graphData = await termApi.fetchGraphData();        
        if(reset){
            nodes.current.clear();
            edges.current.clear();
            return true;
        }
        if(graphData){
            for (let node of graphData['nodes']){
                let gNode = new GraphNode({node:node});                
                if(!nodes.current.get(gNode.id)){
                    nodes.current.add(gNode);
                }                
            }
            for (let edge of graphData['edges']){                
                let gEdge = new GraphEdge({edge:edge});                
                if(!edges.current.get(gEdge.id)){
                    edges.current.add(gEdge);
                }                
            }
        }
    }



    function resetGraph(){
        fetchGraphData(props.ontologyId, props.termIri, true);
    }



    function removeFromGraph(){        
        for (let id of selectedNodes){                        
            nodes.current.remove({id: id});        
        }
        for (let id of selectedEdges){                        
            edges.current.remove({id: id});           
        }     
    }

    
    useEffect(() => {       
        let data = {nodes: nodes.current, edges: edges.current}; 
        graphNetwork.current = new Network(container.current, data, options);        
        fetchGraphData(props.ontologyId, props.termIri);
    }, []);


    useEffect(() => {        
        if(graphNetwork.current){                        
            graphNetwork.current.on("doubleClick", function (params) {        
                if (params.nodes.length > 0) {
                    let nodeIri = params.nodes[0];
                    fetchGraphData(props.ontologyId, nodeIri);                     
                }
            });
    
            graphNetwork.current.on("click", function (params) {        
                if(params.event.tapCount === 1){
                    // single click. Needed to differentiate it from double click
                    setSelectedNodes(params.nodes);
                    setSelectedEdges(params.edges);
                }
            });        
        }
    }, [graphNetwork]);



    return (
        <div className='graph-section'>
            <br></br>
            <div className='graph-control-panel'>
                <button className='btn btn-sm btn-secondary graph-ctl-btn' onClick={resetGraph}>Reset</button>
                <button className='btn btn-sm btn-secondary graph-ctl-btn' onClick={removeFromGraph}>Remove</button>
                <button className='btn btn-sm btn-secondary graph-ctl-btn'>Visit</button>
            </div>
            <div ref={container} className='graph-container' />
        </div>
    );
};

export default Graph;
