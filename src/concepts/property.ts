import { TsTerm } from "./";
import { PropDomainRangeObj } from "./types";

export class TsProperty extends TsTerm {

  override get type(): string {
    return "property";
  }

  override get isIndividual(): boolean {
    return false;
  }

  get domains(): PropDomainRangeObj[] {
    try {
      if (this.term[TsProperty.PROPERTY_DOMAIN_PURL]) {
        let domains = [];
        if (typeof this.term[TsProperty.PROPERTY_DOMAIN_PURL] === "string") {
          domains.push(this.term[TsProperty.PROPERTY_DOMAIN_PURL]);
        } else {
          domains = this.term[TsProperty.PROPERTY_DOMAIN_PURL];
        }
        const listOfDomainObjects = [];
        for (let iri of domains) {
          let domainObj = { ontologyId: "", iri: iri, label: "" };
          domainObj.ontologyId = this.term["linkedEntities"][iri]["definedBy"][0];
          domainObj.label = this.term["linkedEntities"][iri]["label"][0];
          listOfDomainObjects.push(domainObj);
        }
        return listOfDomainObjects;
      }
      return [];
    } catch {
      return [];
    }
  }

  get ranges(): PropDomainRangeObj[] {
    try {
      if (this.term[TsProperty.PROPERTY_RANGE_PURL]) {
        let ranges = [];
        if (typeof this.term[TsProperty.PROPERTY_RANGE_PURL] === "string") {
          ranges.push(this.term[TsProperty.PROPERTY_RANGE_PURL]);
        } else {
          ranges = this.term[TsProperty.PROPERTY_RANGE_PURL];
        }
        this.term["ranges"] = [];
        for (let iri of ranges) {
          let rangeObj = { ontologyId: "", iri: iri, label: "" };
          rangeObj.ontologyId = this.term["linkedEntities"][iri]["definedBy"][0];
          rangeObj.label = this.term["linkedEntities"][iri]["label"][0];
          this.term["ranges"].push(rangeObj);
        }
      }
      return [];
    } catch {
      return [];
    }
  }
}

