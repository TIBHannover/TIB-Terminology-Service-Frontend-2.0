import collectionsInfoJson from "../../assets/collectionsText.json";


export function generalAbout(){
    let content = [
        <div>
            <br/>
            <div>
                <p>The NFDI4Chem Terminology Service is a repository for chemistry and related ontologies providing a single point of access to the latest ontology versions. You can browse or search the ontologies and look into their terms and relations. The Terminology Service can be used either by humans throught the website or by machines via the TS API. The ontologies have been selected based on their relevance for chemistry in general and for research data management for chemistry in particular. The NFDI4Chem Terminology Service is developed and maintained by TIB - Leibniz Information Centre for Science and Technology. It is part of the service portfolio of the NFDI4Chem consortium within the National Research Data Infrastructure. Future development will include curation and creation tools for terminologies. </p>
                <h3>Description of NFDI4Chem consortium</h3>
                <br/>
                <img src={collectionsInfoJson["NFDI4Chem"]["logo"]} alt="nfdi4chemservice"/>
                <br/><br/>
                <p>As part of the outstanding National Research Data Infrastructure (NFDI) initiative for Germany as a center of science, the NFDI4Chem consortium has been formed for the field of chemistry. The overarching aim of this association of universities and non-university research institutions, infrastructure facilities, computing centers, and national professional societies (GDCh, DBG, DPhG) is to organize sustainable Research Data Management (RDM) in chemistry in order to better exploit the great potential of research data as a valuable resource for science and research. In addition to the digitalization and networking of all data-based processes in chemical research, our vision also includes the establishment and maintenance of the national research data infrastructure for chemistry and the development of innovative and easy-to-use services for the best possible subsequent use of research data. The associated cultural change in the chemical community is to be accompanied by a holistic education & training concept with, among other things, extensive measures to promote Open Science and RDM in accordance with the FAIR (<b>F</b>indable, <b>A</b>ccessible, <b>I</b>nteroperable and <b>R</b>eusable) data principles. In order to ensure the findability and thus the reusability of research data, comprehensive and, above all, meaningful (semantic) data annotation with the help of suitable metadata is indispensable. This in turn requires a uniform (metadata) vocabulary or standardized terminology, preferably on an ontological basis.</p>
            </div>                            
            <div>
            <h3>What is TIB Terminology Service?</h3>
            <p>TIB Terminology Service is an open source, free of charge web service hosted by <a href="https://www.tib.eu/de/">TIB – Leibniz Information Centre for Science and Technology and University Library.</a></p>
            <p>TIB Terminology Service intends to be your one-stop-shop for terminology search, browsing and look-up. In particular, it enables you to:</p>
            <ul>
                <li>Access the latest versions of the most relevant terminologies from chemistry, engineering, architecture and many more domains.</li>
                <li>Explore domain knowledge via concept hierarchies, find synonyms or translations of terms, look up definitions and retrieve a concept’s persistent identifier.</li>
                <li>Use TIB Terminology Service data (JSON) in your own service or application via REST API.</li>
                <li>Publish your own terminology on TIB Terminology Service.</li>
            </ul>
            <h3>Roadmap</h3>
            <p>TIB Terminology Service is still under development. In the future, more contents and functionality will be added, e.g.</p>
            <ul>
                <li>further general-purpose and domain terminologies,</li>
                <li>reliable storage for newly developed terminologies,</li>
                <li>tools for the collaborative creation of terminologies (e.g. versioning system, online editor)</li>
                <li>a help-desk to assist the user community in the curation of terminologies.</li>
            </ul>
            <h3>Community Terminology Services</h3>
            <p>Visit our community services with specific collections for engineering, chemistry or economics:</p>
            <img src={collectionsInfoJson["NFDI4Ing"]["logo"]} alt="nfdi4ing" />
            <img src={collectionsInfoJson["NFDI4Chem"]["logo"]} alt="nfdi4chem" style={{ borderWidth: 0, height: '300px' }}/>
            <img src={collectionsInfoJson["CoyPu"]["logo"]} alt="coypu" style={{ borderWidth: 0, height: '100px' }}/>
            </div>                
        </div>
    ];

    return content;
}