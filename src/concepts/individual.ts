import { createElement } from "react";
import { TsTerm } from "./term";

export class TsIndividual extends TsTerm {
  get type(): string {
    return "individual";
  }

  get isIndividual() {
    return true;
  }

  get parentClasses(): React.ReactNode[] | "" {
    if (this.directParent.length > 0) {
      let links: React.ReactNode[] = [];
      for (let parentIri of this.directParent) {
        let parentClassUrl = `${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${this.ontologyId}/terms?iri=${encodeURIComponent(parentIri)}`;
        links.push(
          createElement(
            "span",
            {},
            createElement(
              "a",
              {
                rel: "noopener noreferrer",
                target: "_blank",
                href: parentClassUrl,
              },
              this.getIndividualLabelForLinkedEntity(parentIri),
            ),
            createElement("br"),
          ),
        );
      }
      return links;
    }
    return "";
  }

  private getIndividualLabelForLinkedEntity(iri: string): string {
    try {
      return this.term["linkedEntities"]?.[iri]?.["label"]?.[0] ?? "N/A";
    } catch {
      return "N/A";
    }
  }
}
