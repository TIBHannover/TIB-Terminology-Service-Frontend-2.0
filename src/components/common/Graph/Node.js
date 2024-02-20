class GraphNode{
    constructor({node}){
        this.id = node['iri'];
        this.label= node['label'];
        this.color = {
            background: '#efbfbf'
        }
    }
}

export default GraphNode;