import { TsTerm } from "./term";

export class TsSkosTerm extends TsTerm {
  static narrowerPred = "http://www.w3.org/2004/02/skos/core#narrower";

  constructor(skosTermJson: any) {
    super(skosTermJson);
  }

  get hasChildren(): boolean {
    return this.term[TsSkosTerm.narrowerPred] && this.term[TsSkosTerm.narrowerPred].length;
  }
}

