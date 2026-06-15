type GraphEdgeData = {
  source: string;
  target: string;
  uri: string;
  label: string;
};

class GraphEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  arrows: object;
  width: number;
  color: object;
  font: object;

  constructor({ edge }: { edge: GraphEdgeData }) {
    this.id = edge["source"] + edge["target"] + "&uri=" + edge["uri"];
    this.from = edge["source"];
    this.to = edge["target"];
    this.label = edge["label"];
    this.arrows = { to: true };
    this.width = 2;
    this.color = {
      color: "gray",
      highlight: "#00617C",
    };
    this.font = {
      size: 16,
    };
  }
}

export default GraphEdge;
