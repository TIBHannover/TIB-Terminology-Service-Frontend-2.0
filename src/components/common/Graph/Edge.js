class GraphEdge{
    constructor({edge}){
        this.id = edge['source'] + edge['target'] + "&uri=" + edge['uri'];
        this.from = edge['source'];
        this.to = edge['target'];
        this.label = edge['label'];
        this.arrows = {to:true};
        this.width = 2;          
        this.color = {
            color: 'gray',
            highlight:'#00617C'
        };
        this.font = {
            size:16
        };
    }
}

export default GraphEdge;