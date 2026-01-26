import { TermSet } from "../api/types/termsetTypes";
import { OntologyTermDataV2 } from "../api/types/ontologyTypes";
import { ApiKey } from "../api/types/userTypes";

export class TsTermset {
  termsetData: TermSet;
  private _name: string;
  private _description: string;
  private _visibility: string;
  private _terms: OntologyTermDataV2[];
  private _created_at: string;
  private _creator: ApiKey | undefined;

  constructor(termset: TermSet) {
    this.termsetData = termset;
    this._description = this.termsetData.description ?? "";
    this._name = this.termsetData.name;
    this._visibility = this.termsetData.visibility;
    this._terms = this.termsetData.terms.map(twrapper => twrapper.json ?? {});
    this._created_at = this.termsetData.created_at;
    this._creator = this.termsetData.creator ?? undefined;
  }

  get id(): string {
    return this?.termsetData?.id ?? "";
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description ?? "";
  }

  get creator(): ApiKey | undefined {
    return this.termsetData.creator ?? undefined;
  }

  get creator_name(): string {
    if (!this._creator?.username) {
      return "";
    } else if (this._creator.owner && this._creator.name) {
      return this._creator.name;
    } else {
      return this._creator.username;
    }
  }

  get created_at(): string {
    return this._created_at;
  }

  get updated_at(): string | undefined {
    return this.termsetData.updated_at;
  }

  get visibility(): string {
    return this._visibility;
  }

  get terms(): OntologyTermDataV2[] {
    return this._terms;
  }

  set name(input: string) {
    this._name = input;
  }

  set description(input: string) {
    this._description = input;
  }

  set visibility(input: string) {
    if (["me", "internal", "public"].includes(input)) {
      this._visibility = input;
    } else {
      this._visibility = "me";
    }
  }

  set terms(input: OntologyTermDataV2[]) {
    this._terms = input;
  }

}

