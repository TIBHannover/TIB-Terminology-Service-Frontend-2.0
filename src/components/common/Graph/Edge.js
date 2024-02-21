class GraphEdge{
    constructor({edge}){
        this.id = edge['source'] + edge['target'] + "&uri=" + edge['uri'];
        this.from = edge['source'];
        this.to = edge['target'];
        this.label = edge['label'];
        this.arrows = {to:true};
        this.width = 2;          
        this.color = {
            color: '#3bba54',
            highlight:'#218284'
        };
        this.font = {
            size:16
        };
    }
}

export default GraphEdge;