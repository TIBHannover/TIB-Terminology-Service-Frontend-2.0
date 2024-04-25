class GraphNode{
    constructor({node}){
        this.id = node['iri'];
        this.label= node['label'];
        this.color = {
            background: '#0E6668',
            highlight: {
                border: '#404040',
                background: '#404040'
            }
        };
        this.shape = 'box';        
        this.font = {
            color: 'white',
        };
        
    }
}

export default GraphNode;