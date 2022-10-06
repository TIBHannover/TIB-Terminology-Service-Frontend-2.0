import collectionsInfoJson from "../../assets/collectionsText.json";

export function nfdi4chemAbout(){
    let content = [
        <div>
            <br/>
            <div>
                <p>The Terminology Service is a repository for chemistry ontologies. It is a central point of access to the latest versions of these ontologies providing comprehensive information about their scope, application and curators. The ontologies have been selected by the following set of criteria :</p>
                <ul>
                    <li>•	The ontology should provide terms and relations to describe research activities and research data in chemistry. We although considered terminologies, taxonomies and controlled vocabularies, as it might not be necessary to make full use of description logic to semantically describe research data depending on the involved stakeholders</li>
                    <li>•	The ontology should have been developed by or in cooperation with domain experts to ensure chemistry knowledge is codified accurately</li>
                    <li>•	The ontology should adhere to best practices in ontology development</li>
                    <li>•	The ontology should be FAIR (Findable, Accessible, Interoperable Reusable), i.e. indexed in a prominent registry, accessible via a permanent URL and provided with a documentation. The ontology must provide a machine-readable license information-. The ontology should be aligned with compatible upper ontologies and should be reusable in a modular way</li>
                    <li>•	The  ontology should be actively and openly maintained</li>
                    <li>•	The ontology should be used in prominent applications</li>
                </ul>
                <br/>
                <h3>How to use the Terminology Service</h3>
                <p>The TS can used either be used by browsing or searching ontologies in the Graphical user interface or programmatically by querying the API. The latter one is of special interest for other services or software</p>
                <br/>
                <p>You can start your journey with the ontology list and general information about the various ontologies. You can narrow down the list by a keyword filter and move to the detail view of an ontology where you can download the latest ontology version or open the hierarchical tree view of classes (terms, concepts) or properties. The detail view of a class provide information about the definition, IRI and Curie and relations and more.</p>
                <br/>
                <p>Alternatively, you can search the TS by ontology, term or properties. The search bar is available in every page. Again, you can filter the result list by type or ontology. From the result list, you can switch to the detail view of an ontology, class or property.</p>
                <br/>
                <h3>How to use the API of the Terminology Service</h3>
                <p>All information about the ontologies and the terms, properties and relations of the ontologies can be queried by the API. This is especially useful, if you want to use ontology terms in your own service or software. For more details, visit the <a href="/api">API documentation</a></p>
                <br/>
                <h3>NFDI4Chem Terminology Service and the Federation of Services</h3>
                <p>The NFDI4Chem Terminology Service is developed and maintained by TIB - Leibniz Information Centre for Science and Technology. It is part of the service federation of the NFDI4Chem consortium within the National Research Data Infrastructure. Future development will include curation and creation tools for ontologies.</p>
                <br/>
                <h3>Publications</h3>
                <p>Steinbeck C, Koepler O, Bach F, Herres-Pawlis S, Jung N, Liermann J, et al. NFDI4Chem - Towards a National Research Data Infrastructure for Chemistry in Germany. Research Ideas and Outcomes. 2020;6: e55852. <a href="https://doi.org/10.3897/rio.6.e55852">doi:10.3897/rio.6.e55852</a></p>
                <br/>
                <p>Strömert P, Hunold J, Castro A, Neumann S, Koepler O. Ontologies4Chem: the landscape of ontologies in chemistry. Pure Appl Chem. 2022 [cited 2 May 2022] <a href="https://doi.org/10.1515/pac-2021-2007">doi:10.1515/pac-2021-2007</a></p>
                <br/>
                <h3>Videos</h3>
                <p>Recordings of our 1st Ontologies4Chem Workshop in October 2022 on <a href="https://www.youtube.com/playlist?list=PLlTKDYkC1Ls8wiHU-DzN1KwapxRpLkfVa">YouTube</a></p>
            </div>
        </div>
    ];

    return content;
}