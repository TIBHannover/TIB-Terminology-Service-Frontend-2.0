type GraphNodeData = {
  iri: string;
  label: string;
};

class GraphNode {
  id: string;
  label: string;
  color: object;
  shape: string;
  font: object;

  constructor({ node }: { node: GraphNodeData }) {
    this.id = node["iri"];
    this.label = node["label"];
    this.color = {
      background: "#0E6668",
      highlight: {
        border: "#404040",
        background: "#404040",
      },
    };
    this.shape = "box";
    this.font = {
      color: "white",
    };
  }
}

export default GraphNode;
