import {Link} from "react-router-dom";

export function renderDocumentation() {
    let content = [
        <div>
            <p>
                This service offers an intuitive search functionality which is based on a SOLR search index on
                identifiers and
                terms.
                TIB Terminology Service can be used both manually and programmatically. Manual access (User Interface)
                appeals
                to a
                larger audience whereas programmatical access (REST Interface) can play a key role in larger contexts.
                For this reason, they are both essential features of the service.
            </p>
            <br/>
            <h3>User Interface Specification of TIB Terminology Service</h3>
            <p>
                There are two main ways of browsing the Terminology Service . You can either browse the available
                ontologies via
                the Ontologies
                tab or you can make search on all available ontologies by using the search box in the main page.
                If you browse the available ontologies, you should pick an ontology from the list and then you can
                browse
                through its tree view to lower levels or you can make a search for a specific term in that particular
                ontology
                through its search box. Alternatively, if you make a search from the search box provided in the home
                page,
                the results will be displayed based on all ontologies that include the searched term. By using advanced
                search
                options,
                results can be filtered by entity type or ontology. The entity types used for filtering are class,
                property,
                individual or ontology respectively. As a result, your search leads you to the graph based view of a
                term
                regardless
                of your browsing methodology. RDF serializations of the latest ontology version are offered as downloads
                through
                the service.
            </p>
            <br/>
            <h3>REST Interface for TIB Terminology Service</h3>
            <p>
                The service also offers an API that allows to retrieve information on terms and their relations as json
                data for
                use in other webservices,
                e.g. in services of the research data management infrastructure of various research communities. In
                applications
                like research
                data management systems, ontological terms and their unique identifiers can, for example, be used as
                metadata on
                research data
                artifacts - thereby making research (meta)data more findable and interoperable. The REST API interface
                of the
                TIB Central
                Terminology Service starts with
                <b><a href="https://api.terminology.tib.eu/api/" rel="nofollow noreferrer"
                      target="_blank"> https://api.terminology.tib.eu/api/</a></b>.
                This API enables to query all the terminologies of various research communities maintained by TIB. The
                methodology on how
                to use this interface is explained in the
                <b><a href="https://api.terminology.tib.eu/swagger-ui/index.html"
                      rel="nofollow noreferrer" target="_blank"> Swagger
                    Documentation</a></b> in detail.
                The underlying models can also be viewed through this documentation for a deeper understanding of the
                API
                commands. Besides,
                it is possible to execute the publicly available API commands from
                the <b><a href="https://api.terminology.tib.eu/swagger-ui/index.html" rel="nofollow noreferrer"
                          target="_blank">Swagger
                Documentation</a></b>
            </p>
            <br/>
            <h3>Rest Interface for MOD (Metadata for Ontology Description and Publication Ontology)</h3>
            <p>
                The objective is to implement the MOD-API specification (<a
                href="https://fair-impact.github.io/MOD-API/" target="_blank"
                rel="nofollow noreferrer">https://fair-impact.github.io/MOD-API/</a>)
                to improve the availability, accessibility, and interoperability of terminologies maintained within TIB,
                thereby supporting a wide range of downstream services, particularly within the European Open Science
                Cloud.
                To achieve this, our initial focus is on providing the most commonly used API endpoints, facilitating
                the discovery,
                retrieval, and access of terminologies. This API enables users to efficiently retrieve metadata
                associated with various artifacts,
                streamlining the utilization and integration of research data. The API follows MOD-API standards,
                ensuring compatibility
                and supports FAIR principles (Findable, Accessible, Interoperable, Reusable). Detailed guidance on its
                usage,
                including endpoint descriptions, request/response structures, and practical examples, is provided in the
                accompanying <b><a href="https://api.terminology.tib.eu/swagger-ui/index.html" rel="nofollow noreferrer"
                                   target="_blank">Swagger
                Documentation</a></b>.
                For further information on the importance of semantic artifact descriptions in the context of producing
                data that aligns with the FAIR guiding principles, please refer to:
                <br/>
                <b><a href="https://zenodo.org/records/10725304" target="_blank" className="ms-1 me-1"
                      rel="nofollow noreferrer">https://zenodo.org/records/10725304</a></b>
                and
                <b><a href="https://fair-impact.github.io/MOD/index-en.html" target="_blank" className="ms-1"
                      rel="nofollow noreferrer">https://fair-impact.github.io/MOD/index-en.html</a></b>
            </p>
            <h3>Report an Issue</h3>
            <p>
                For feedback, enquiries or suggestion about TIB Terminology Service:
                <b><Link className="btn-secondary btn btn-sm ms-1 pt-0 pb-0 pl-1 pr-1"
                         to={process.env.REACT_APP_PROJECT_SUB_PATH + "/contact"}>Contact us</Link></b>
            </p>
            <p>
                To request a new terminology:
                <b><Link className="btn-secondary btn btn-sm pt-0 pb-0 pl-1 pr-1 me-1 ms-1"
                         to={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologysuggestion"}>Ontology suggestion</Link></b>
                (requires sign-in)
            </p>
        </div>
    ];

    return content;
}