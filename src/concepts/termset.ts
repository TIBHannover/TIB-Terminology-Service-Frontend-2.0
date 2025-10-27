import { TermSet } from "../api/types/termsetTypes";
import { OntologyTermDataV2 } from "../api/types/ontologyTypes";

class TsTermset {
  termsetData: TermSet;

  constructor(termset: TermSet) {
    this.termsetData = termset;
  }

  get id(): string {
    return this?.termsetData?.id ?? "";
  }

  get name(): string {
    return this.termsetData.name;
  }

  get description(): string {
    return this.termsetData.description ?? "";
  }

  get creator(): string {
    return this.termsetData.creator;
  }

  get created_at(): string {
    return this.termsetData.created_at;
  }

  get updated_at(): string | undefined {
    return this.termsetData.updated_at;
  }

  get visibility(): string {
    return this.termsetData.visibility;
  }

  get terms(): OntologyTermDataV2[] {
    return this.termsetData.terms;
  }

  set name(input: string) {
    this.name = input;
  }

  set description(input: string) {
    this.description = input;
  }

  set visibility(input: string) {
    if (["me", "internal", "public"].includes(input)) {
      this.visibility = input;
    } else {
      this.visibility = "me";
    }
  }

  set terms(input: OntologyTermDataV2[]) {
    this.terms = input;
  }

}

export default TsTermset;
