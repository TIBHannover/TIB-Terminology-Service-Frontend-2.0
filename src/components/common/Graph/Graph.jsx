import { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import TermApi from '../../../api/term';


const Graph = (props) => {

    const [graphNetwork, setGraphNetwork] = useState();
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
                graphNodes.push(
                    {
                        id: node['iri'], 
                        label:node['label'],
                        color:{
                            background: '#efbfbf'
                        }
                    }
                )
            }
            for (let edge of graphData['edges']){
                graphEdges.push(
                    {
                        from: edge['source'],
                        to:edge['target'],
                        label:edge['label'],
                        arrows:{to:true},
                        width: 2,                        
                        color:{
                            color: '#3bba54',
                            highlight:'#218284'
                        },
                        font:{
                            size:16
                        }
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
        if(container.current){
            setGraphNetwork(new Network(container.current, { nodes, edges }, options));
        }
    }, [container, nodes, edges]);

    return <div ref={container} style={{ height: '700px', width: '800px' }} />;
};

export default Graph;
