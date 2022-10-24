export function nfdi4IngAbout(){
    let content = [
        <div>
            <h2>Welcome to NFDI4Ing – the National Research Data Infrastructure for Engineering Sciences!</h2>
            <br></br>
            <h4>NFDI4Ing Mission</h4>
            <p className="justify">
                NFDI4Ing brings together the engineering communities. It offers a unique method-oriented and user-centred 
                approach in order to make engineering research data FAIR ( findable, accessible, interoperable, and re-usable).
                Before meeting the <a href="https://nfdi4ing.de/#meet_archetypes" target="_blank">archetypes</a> and 
                <a href="https://nfdi4ing.de/#exploring_projects" target="_blank">exploring our projects</a>, 
                you might want to have a look at the 
                <a href="https://nfdi4ing.de/#overview_taskareas" target="_blank">overview of task areas</a>.  
            </p>
            <br></br>
            <h4>NFDI4Ing Terminology Service</h4>
            <p className="justify">
                The terminology service (TS) will develop subject-specific terminologies, simultaneously fueling metadata 
                with terms and using the respective application profiles as a basis for refining formal ontologies for 
                the archetypes below. The terminology service will implement technical infrastructure for access, curation, 
                and subscription to terminologies, offering a single-point-of-entry to terminologies in NFDI4Ing. 
            </p>
            <br></br>
            <img src="/nfdi4ing_about_image.jpg" alt="about image" className="img-fluid about-image"></img>
            <br></br>
            <br></br>
            <h4>Motivation</h4>
            <p className="justify">
                The exploitation of data by academia and industry continues to be inefficient. The ambiguity of natural 
                language words and phrases used to annotate data with their meanings is perhaps the primary obstacle. 
                Semantics encoded in such form are inaccessible to machines and often ambiguous even to human experts. 
                The consequent lack of semantic data interoperability and under-performing machine support in tasks ranging 
                from discovering to cleaning and integrating data is the root cause for why data are under-exploited. 
                In response to these concerns, the research community is adopting the FAIR Data Principles. 
                Some of the principles have seen good progress in their implementation. A good example is the resolvable 
                persistent identification of data to ensure their findability and accessibility. The key remaining concern, 
                however, is the practice of using ambiguous words, phrases or even incomprehensible abbreviations to encode data 
                semantics and the elusive principle of data interoperability. As such, the definition of concepts, 
                associated attributes and relations that are readable and understandable, not only to target audiences 
                but also to machines, is key to <a href="https://doi.org/10.3233/ISU-170824" target="_blank">FAIRness</a>. 
            </p>
            <br></br>
            <h4>Aim</h4>
            <p className="justify">
                To address the concerns mentioned above, NFDI4Ing will develop, deploy and sustainably operate a 
                Terminology Service (TS) for the engineering community and associated disciplines and catalyse its 
                integration into operational infrastructures and diverse communities in research and industry. 
                The TS will enable semantic data interoperability, discovery and exploitation across engineering 
                disciplines and thus supports user-centric scientific, industrial and societal applications that 
                maximize the scientific and societal impact of research data. As such, it will include: 
                <ul>
                    <li>an intuitive interface for look up of uniquely identified vocabulary terms and their data (e.g. synonyms, equivalent terms, definitions and conceptual relations) to support domain experts in semantic data annotation across various NFDI4Ing archetypes,</li>
                    <li>a machine-readable access point for vocabulary terms and their data intended for use in RDM infrastructure,</li>
                    <li>the possibility to extend vocabularies by TS users and users of RDM infrastructure who offer data from TS in their services, and</li>
                    <li>a look up of entities so that ontology knowledge like context relations can be reconstructed.</li>
                </ul>
                The TS within NFDI4Ing is instrumental for establishing a comprehensive, integrated Internet of FAIR Data and 
                Services through semantic representation, terminology-based interoperability, and accessibility and interlinking of 
                research data. The TS and its approaches are underpinned by global and open standards, such as languages for 
                knowledge representation recommended by W3C and OGC. The design and implementation of the TS's functionalities 
                are built upon inclusive stakeholder participation (researchers from different scientific archetypes and 
                engineering disciplines). Stakeholders of the planned NFDI4Ing Terminology Service are data providers especially 
                coming from the NFDI4Ing archetypes, curators, researchers and other consumers.  Most of the existing vocabularies that are 
                used in engineering disciplines have a generic origin. Examples for this are descriptions for provenance 
                tracking (e.g., W3C <a href="https://www.w3.org/TR/prov-o/" target="_blank">PROV</a>),
                units and/or quantities used (e.g., measured quantities such as  
                <a href="https://cdd.iec.ch/" target="_blank"> IEC 61630</a>, 
                <a href="http://www.qudt.org/" target="_blank"> QUDT</a> and 
                <a href="https://github.com/HajoRijgersberg/OM" target="_blank"> OM</a>), 
                devices (e.g. Research Alliance  
                <a href="https://www.rd-alliance.org/groups/persistent-identification-instruments-wg" target="_blank"> 
                     WG for Persistent Identification of Instruments
                </a>)
                and experiments (e.g. the <a href="https://www.allotrope.org/allotrope-framework" target="_blank"> Allotrope Data Format (ADF)</a>) 
                Discipline-specific vocabularies mostly focus on engineering-related disciplines, for example 
                chemical (<a href="http://www.chemspider.com/" target="_blank">ChemSpider</a>)
                and material (<a href="http://www.chemspider.com/" target="_blank">MaterialHub</a>) databases as well as observations
                (e.g. <a href="https://www.w3.org/TR/vocab-data-cube/" target="_blank">RDF Data Cube Vocabulary</a>, 
                <a href="https://www.w3.org/TR/vocab-ssn/" target="_blank">Semantic Sensor Network ontology</a>) 
                and metrology (e.g. 
                    <a href="https://www.bipm.org/en/publications/guides/vim.html" target="_blank">VIM3</a>).
            </p>
            <br></br>
            <h4>Description of the planned Terminology Service NFDI4Ing</h4>
            <p className="justify">
                The functionality of the TS will include a reliable management system and storage infrastructure 
                for subject-specific vocabularies and ontologies, as well as smart access to (existing and newly created) 
                vocabularies and tools for collaborative creation. The Terminology Service will be characterized by 
                the following key services:
                <ul>
                    <li>Access: Well-defined human and machine interfaces to access terminology and single-point-of-entry for terminology in the NFDI4Ing.</li>
                    <li>Curation: Ticket-based help-desk for handling requests for new terminology or updates to existing terminology by stakeholder communities and quality assurance of terminology in the NFDI4Ing.</li>
                    <li>Subscription: Subscription-based notification for changes to existing terminology and mechanism to synchronize terminology producers and consumers.</li>
                </ul>
            </p>

        </div>
        

    ];

    return content;
}