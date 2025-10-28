import TsTerm from "./term";
import TsClass from "./class";
import TsProperty from "./property";
import TsIndividual from "./individual";
import { OntologyTermDataV2, OntologyTermData } from "../api/types/ontologyTypes";


class TermFactory {

  static createTermForTS(termData: OntologyTermDataV2, instancesList: OntologyTermData[] = []) {
    let type = "";
    if (termData.type && termData.type.length > 1) {
      type = termData.type[0];
    }
    switch (type) {
      case "class":
        return new TsClass(termData, instancesList);
      case "property":
        return new TsProperty(termData);
      case "individual":
        return new TsIndividual(termData);
      default:
        return new TsTerm(termData)
    }
  }
}

export default TermFactory;
