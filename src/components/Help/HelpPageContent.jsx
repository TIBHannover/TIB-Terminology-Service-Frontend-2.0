export function renderHelpPage(){
    let content = [
        <div>
            <h3>Feedback and Suggestion</h3>
            <p>For feedback, enquiries or suggestion about TIB Terminology Service or to request a new terminology please visit <b><a href={"https://gitlab.com/TIBHannover/terminology/tib-terminology-service-issue-tracker"}>our issue tracker</a></b> (requires sign-in)</p>
            <br/>
            <h3>Frequently Asked Questions (FAQ)</h3>
            <br/>
            <h4>1 What is terminology ?</h4>
            <p>A terminology is a structured system of concepts representing a knowledge system and the means to express them. They are an essential condition for communication, e.g. in academic research.</p>
            <h4>2 Why should I use TIB Terminology Service in research data management (RDM) ?</h4>
            <p>Data on their own are not fit for reuse by researchers or machines (e.g. data management systems). Reusable data provide data about themselves (the so called “metadata”) in interoperable formats. These format should employ standardized syntaxes (e.g. XML), use well-known (meta-)data schemata (e.g. DataCite Metadata Schema) and controlled lists of values.</p>
            <p>Terminologies offer the building blocks for (meta-)data schemata and data annotation by defining important concepts of a domain. Furthermore, they allow persistent reference to concepts and terms by assigning them Uniform Resource Identifiers (URIs).</p>
            <p>TIB Terminology Service lets you browse and search multiple terminologies at a time. It helps you find the right terms provide information about your data, e.g. about</p>
            <ul>
                <li>the data elicitation process,</li>
                <li>data transformations,</li>
                <li>data analysis steps,</li>
                <li>etc.</li>
            </ul>
            <p>Reference to shared domain terminologies helps to make data FAIR and discoverable by peers and web services.</p>
            <h4>3 How can I use TIB Terminology Service for research data management ?</h4>
            <p>You can integrate TIB Terminology Service into your own applications via its REST API (see <b><a href={'https://service.tib.eu/ts4tib/swagger-ui.html'} target="_blank">Documentation</a></b>)</p>
            <p>Each concept is represented by a Uniform Resource Identifier (URI). You can use this URI in data documentation and data annotation to persistently refer to concept descriptions related to your research.</p>
            <h4>4 I do not find the terms I need - what can I do now ?</h4>
            <p>If you want to suggest a new terminology to be added to TIB Terminology Service leave an issue at <b><a href={"https://gitlab.com/TIBHannover/terminology/tib-terminology-service-issue-tracker"}>our issue tracker</a></b>.</p>
            <p>If you do not know a fitting terminology please get in touch with us (felix.engel [AT] tib.eu).</p>
            <p>We are constantly adding new contents to the service. In the meantime you could also visit other terminology services.</p>
            <h4>5 I am maintainer of a terminology - how can I have it added to the service ?</h4>
            <p>Please make sure that you provide your terminology</p>
            <ul>
                <li>as an open source project on a version management plaform like GitHub or at least as a self-hosted resource providing the required serializations</li>
                <li>with an open license (e.g. CC 0)</li>
                <li>conform to the Web Ontology Language (OWL 2)</li>
                <li>in one of the following serializations: RDF/XML (.rdf/.owl), Turtle (.ttl), OBO (.obo)-</li>
                <li>with machine-readable metadata</li>
            </ul>
            <p>Terminologies in a tabular format (.tsv, .csv, .xlsx) or in mark-up languages like XML (.xml) are not ready for ingest and require further processing.</p>
            <p>Make a request at <b><a href={"https://gitlab.com/TIBHannover/terminology/tib-terminology-service-issue-tracker"}>our issue tracker</a></b>.</p>
            <h4>6 How can I contribute to any of the terminologies ?</h4>
            <p>The terminologies listed on TIB Terminology Service are usually maintained by dedicated communities and developed on web services like GitHub or GitLab.</p>
            <p>If you have suggestions for a particular terminology you should visit their repository and open an issue.</p>
            <p>You can find the link to a terminology issue tracker in the “Request a term” button on each terminology’s overview page</p>
            <h4>7 Are there other services to look up terminology ?</h4>
            <p>Yes, there are but some of these do not offer an API. There are a several terminology portals offered by standardization bodies like ISO, DIN or IEC where you can look up standardized terms and definitions:</p>
            <ul>
                <li><b><a href={"https://www.iso.org/obp/ui#search"}>ISO Open Browsing Platform</a></b></li>
                <li><b><a href={"https://www.electropedia.org/"}>Electropedia</a></b></li>
                <li><b><a href={"https://www.din.de/de/service-fuer-anwender/din-term"}>DINTerm</a></b> (search for terms and definitions from German standards, requires registration)</li>
                <li><b><a href={"https://www.din.de/de/service-fuer-anwender/din-termonline"}>DINTerm Online</a></b> (search for terms and approved translations, available without registration)</li>
            </ul>
            <p>A multiple domain search for terms is also possible on services like</p>
            <ul>
                <li><b><a href={"https://bartoc-fast.ub.unibas.ch/bartocfast/"}>Bartoc FAST</a></b></li>
            </ul>
            <p>The following services allow the search for terminological collections which may contain relevant terms:</p>
            <ul>
                <li><b><a href={"https://bartoc.org/"}>Bartoc</a></b></li>
                <li><b><a href={"https://lov.linkeddata.es/dataset/lov/"}>Linked Open Vocabularies</a></b></li>
                <li><b><a href={"https://www.lod-cloud.net/"}>Linked Open Data Cloud</a></b></li>
                <li><b><a href={"https://archivo.dbpedia.org/list"}>DBpedia Archivo</a></b></li>
            </ul>
        </div>
    ];

    return content;
}