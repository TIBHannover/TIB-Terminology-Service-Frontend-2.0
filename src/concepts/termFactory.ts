import { OntologyTermDataV2, OntologyTermData } from "../api/types/ontologyTypes";
import { TsClass } from "./class";
import { TsProperty } from "./property";
import { TsIndividual } from "./individual";
import { TsTerm } from "./term";


export class TermFactory {

  static createTermForTS(termData: OntologyTermDataV2, instancesList: OntologyTermData[] = []) {
    let type = "";
    if (termData.type && termData.type.length > 0) {
      type = termData.type[0];
    }
    if(["class", "classes"].includes(type)){
      return new TsClass(termData, instancesList);
    }else if(["property", "properties", "dataProperty", "objectProperty", "annotationProperty"].includes(type)){
      return new TsProperty(termData);
    }else if(["individual", "individuals"].includes(type)){
      return new TsIndividual(termData);
    }else{
      return new TsTerm(termData)
    }
  }
}

