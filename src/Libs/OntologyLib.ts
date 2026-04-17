import {resolveOrcidId} from "../api/general";
import {OrcidPerson} from "../api/types/other";
import {createElement, ReactElement} from "react";
import {TsOntology} from "../concepts";

class OntologyLib {

    static getCurrentOntologyIdFromUrlPath() {
        let currentUrlPath = window.location.pathname.split("ontologies/");
        let ontologyIdInUrl = "";
        if (currentUrlPath.length === 2 && currentUrlPath[1] !== "") {
            ontologyIdInUrl = currentUrlPath[1].includes("/")
                ? currentUrlPath[1].split("/")[0].trim()
                : currentUrlPath[1].trim();
        }
        return ontologyIdInUrl;
    }

    static async formatCreator(ontology: TsOntology): Promise<ReactElement> {
        let creatorsElements: ReactElement[] = [];
        for (let cr of ontology.creator) {
            if (cr.includes("orcid.org/")) {
                let orcidId = cr.split("orcid.org/")[1];
                orcidId = orcidId.trim();
                let person = await resolveOrcidId(orcidId);
                if (!person.name) {
                    creatorsElements.push(createElement("p", {}, cr));
                    continue;
                }
                let icon = createElement("i", {className: "fa-brands fa-orcid small-orcid-icon"});
                let anchor = createElement("a", {
                    href: person.profile,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "me-4"
                }, `${person.name} ${person.family}`, icon);
                creatorsElements.push(anchor);
            } else {
                creatorsElements.push(createElement("p", {}, cr));
            }
        }
        return createElement("div", {}, [...creatorsElements]);

    }

}


export default OntologyLib;
