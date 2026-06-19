import { TsTerm } from "./term";
import { OntologyTermData } from "../api/types/ontologyTypes";

export class TsSkosTerm extends TsTerm {
  static narrowerPred = "http://www.w3.org/2004/02/skos/core#narrower";

  instancesList: OntologyTermData[];
  constructor(skosTermJson: any, instancesList: OntologyTermData[] = []) {
    super(skosTermJson);
    this.instancesList = instancesList;
  }

  get hasChildren(): boolean {
    return (
      this.term[TsSkosTerm.narrowerPred] &&
      this.term[TsSkosTerm.narrowerPred].length
    );
  }
}
