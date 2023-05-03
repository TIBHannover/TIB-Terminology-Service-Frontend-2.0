export function nfdi4IngHelp(){
    let content = [
        <div>
            <h2>Frequently Asked Questions about the NFDI4Ing Terminology Service</h2>
            {/* accordion-1 start */}
            <div id="usage-accordion-1">
                <div class="card">
                    <div class="card-header" id="usage-heading-1">
                    <h5 class="mb-0">
                        <button class="btn btn-link collpase-text-btn" data-toggle="collapse" data-target="#usage-collapse-1" aria-expanded="false" aria-controls="usage-collapse-1">
                            What is terminology?
                        </button>
                    </h5>
                    </div>

                    <div id="usage-collapse-1" class="collapse" aria-labelledby="usage-heading-1" data-parent="#usage-accordion-1">
                        <div class="card-body">
                            <p className='justify'>
                                Every field of expertise - be it a science, be it a trade, be it a craft – comes with its 
                                own body of knowledge, comprised of specialized concepts, relations between these concepts as 
                                well as the necessary terms to communicate about these concepts. As such, terminology is 
                                the most important tool for any kind of collaboration among experts, e.g. formulating research 
                                hypotheses as well as collecting, analysing and interpreting research data.
                            </p>                            
                        </div>
                    </div>
                </div>
            </div>
            {/* accordion-1 end */} 
            <br></br>
            {/* accordion-2 start */}
            <div id="usage-accordion-2">
                <div class="card">
                    <div class="card-header" id="usage-heading-2">
                    <h5 class="mb-0">
                        <button class="btn btn-link collpase-text-btn" data-toggle="collapse" data-target="#usage-collapse-2" aria-expanded="false" aria-controls="usage-collapse-2">
                            What has terminology to do with research data management (RDM)?
                        </button>
                    </h5>
                    </div>

                    <div id="usage-collapse-2" class="collapse" aria-labelledby="usage-heading-2" data-parent="#usage-accordion-2">
                        <div class="card-body">
                            <p className='justify'>
                                Concise terminology usually plays an important role in data interpretation and in 
                                “writing up the research”. However, it is already used and needed much earlier than that 
                                and also plays a role in professional research data management: Research data on their 
                                own are useless. Without annotations and accompanying information 
                                (e.g. about the data elicitation process, data transformations, or data analysis) data 
                                are simply meaningless and not fit for reuse. These “data about data” are called metadata. 
                                Metadata are key to making data discoverable and reusable in future contexts. 
                                They are usually given in a well-structured format following a recognized schema, 
                                often with expected and authorized sets of values. Naturally, domain-specific metadata need to 
                                make use of a domain’s terminology – ideally in a consistent and harmonized manner and with means 
                                of persistent reference.
                            </p>                            
                        </div>
                    </div>
                </div>
            </div>
            {/* accordion-2 end */} 
            <br></br>
            {/* accordion-3 start */}
            <div id="usage-accordion-3">
                <div class="card">
                    <div class="card-header" id="usage-heading-3">
                    <h5 class="mb-0">
                        <button class="btn btn-link collpase-text-btn" data-toggle="collapse" data-target="#usage-collapse-3" aria-expanded="false" aria-controls="usage-collapse-3">
                            How can I use NFDI4Ing’s Terminology Service for research data management?
                        </button>
                    </h5>
                    </div>
                    <div id="usage-collapse-3" class="collapse" aria-labelledby="usage-heading-3" data-parent="#usage-accordion-3">
                        <div class="card-body">
                            <p className='justify'>
                                NFDI4Ing’s Terminology Service provides domain-specific concepts, their terms and relations to 
                                other concepts, their definition and other types of information, from a range of 
                                engineering-related terminology collections. Each concept is represented by a 
                                <a href="https://en.wikipedia.org/wiki/Uniform_Resource_Identifier" target={"_blank"}> Uniform Resource Identifier (URI)</a>. 
                                You can use the URI of a fitting concept 
                                (instead of a potentially ambiguous natural language expression!) 
                                for your research data documentation and annotation and thus persistently 
                                refer to a reliable description of a concept related to your work. 
                                You can also integrate terminological items into your own applications via the 
                                <a href="/docs" target={"_blank"}> Terminology Service’s API</a>. 
                                Learn more about the API here or at its 
                                <a href="http://service.tib.eu/ts4tib/swagger-ui.html" target={"_blank"}><b> Swagger Documentation</b></a>. 
                                In the future, the terminology from the Terminology Service will also be integrated 
                                into other NFDI4Ing services for research data management where it makes terminology 
                                available for standardized data description – increasing the Findability, 
                                Interoperability and Reusability of research data in the NFDI4Ing overall infrastructure.
                            </p>                            
                        </div>
                    </div>
                </div>
            </div>
            {/* accordion-3 end */} 
            <br></br>
            {/* accordion-4 start */}
            <div id="usage-accordion-4">
                <div class="card">
                    <div class="card-header" id="usage-heading-4">
                    <h5 class="mb-0">
                        <button class="btn btn-link collpase-text-btn" data-toggle="collapse" data-target="#usage-collapse-4" aria-expanded="false" aria-controls="usage-collapse-4">
                            I do not find the terms I need – what can I do now?
                        </button>
                    </h5>
                    </div>
                    <div id="usage-collapse-4" class="collapse" aria-labelledby="usage-heading-4" data-parent="#usage-accordion-4">
                        <div class="card-body">
                            <p className='justify'>
                                Please get in touch with us to let us know your demand. Write a mail to felix.engel [AT] tib.eu or 
                                leave an issue at our <a href="https://git.rwth-aachen.de/nfdi4ing/metadata4ing/terminology-service-issue-tracker/-/issues" target={"_blank"}> issue tracker</a>. 
                                If you know of a source containing relevant terminology, 
                                you can also suggest this at the issue tracker. Please notice, that a terminology collection 
                                can be ingested fastest, if it comes in a certain format and with a free license. 
                                Other terminology sources will need additional processing steps or might not be eligible at all. 
                            </p>                            
                        </div>
                    </div>
                </div>
            </div>
            {/* accordion-4 end */} 
            <br></br>
            {/* accordion-5 start */}
            <div id="usage-accordion-5">
                <div class="card">
                    <div class="card-header" id="usage-heading-5">
                    <h5 class="mb-0">
                        <button class="btn btn-link collpase-text-btn" data-toggle="collapse" data-target="#usage-collapse-5" aria-expanded="false" aria-controls="usage-collapse-5">
                            What technical formats does the Terminology Service ingest?
                        </button>
                    </h5>
                    </div>
                    <div id="usage-collapse-5" class="collapse" aria-labelledby="usage-heading-5" data-parent="#usage-accordion-5">
                        <div class="card-body">
                            <p className='justify'>
                                NFDI4Ing’s Terminology Service is a repository software that was designed to ingest terminologies 
                                employing these standards and that are ready for the Semantic Web. Terminology that is documented 
                                in other forms, needs to be transformed for an ingest. A terminology should therefore use one of 
                                the serializations RDF/XML (.rdf/.owl), Turtle (.ttl) and OBO (.obo). Terminologies in a 
                                tabular format (.tsv, .csv, .xlsx) or in mark-up languages like XML (.xml) 
                                are not ready for ingest and require further processing
                            </p>                            
                        </div>
                    </div>
                </div>
            </div>
            {/* accordion-5 end */}
            <br></br>
            {/* accordion-6 start */}
            <div id="usage-accordion-6">
                <div class="card">
                    <div class="card-header" id="usage-heading-6">
                    <h5 class="mb-0">
                        <button class="btn btn-link collpase-text-btn" data-toggle="collapse" data-target="#usage-collapse-6" aria-expanded="false" aria-controls="usage-collapse-6">
                            Are there other services to look up terminology?
                        </button>
                    </h5>
                    </div>
                    <div id="usage-collapse-6" class="collapse" aria-labelledby="usage-heading-6" data-parent="#usage-accordion-6">
                        <div class="card-body">
                            <p className='justify'>
                                Yes, there are. There are a several terminology portals offered by standardization bodies like ISO, DIN or IEC where you can look up standardized terms and definitions. 
                                <ul>
                                    <li><a href="https://www.iso.org/obp/ui#search" target={"_blank"}>https://www.iso.org/obp/ui#search</a></li>
                                    <li><a href="https://www.electropedia.org/" target={"_blank"}>https://www.electropedia.org/</a></li>
                                    <li><a href="https://www.din.de/de/service-fuer-anwender/din-term" target={"_blank"}>https://www.din.de/de/service-fuer-anwender/din-term</a> (search for terms and definitions from German standards, requires registration)</li>
                                    <li><a href="https://www.din.de/de/service-fuer-anwender/din-termonline" target={"_blank"}>https://www.din.de/de/service-fuer-anwender/din-termonline</a> (search for terms and approved translations, available without registration)</li>
                                </ul>
                                A multiple domain search for terms is also possible on services like
                                <ul>
                                    <li><a href="https://bartoc-fast.ub.unibas.ch/bartocfast/" target={"_blank"}>https://bartoc-fast.ub.unibas.ch/bartocfast/</a></li>
                                    <li><a href="https://service.tib.eu/ts4tib/index" target={"_blank"}>https://service.tib.eu/ts4tib/index</a></li>                                    
                                </ul>
                                The following services allow the search for terminological collections from different domains or for specific sub-fields and concept fiels in the domain:
                                <ul>
                                    <li><a href="https://bartoc.org/" target={"_blank"}>https://bartoc.org/</a></li>
                                    <li><a href="https://lov.linkeddata.es/dataset/lov/" target={"_blank"}>https://lov.linkeddata.es/dataset/lov/</a></li>
                                    <li><a href="https://www.lod-cloud.net/" target={"_blank"}>https://www.lod-cloud.net/</a></li>
                                    <li><a href="https://archivo.dbpedia.org/list" target={"_blank"}>https://archivo.dbpedia.org/list</a></li>
                                </ul>
                            </p>                            
                        </div>
                    </div>
                </div>
            </div>
            {/* accordion-6 end */}  
            <br></br>
            {/* accordion-7 start */}
            <div id="usage-accordion-7">
                <div class="card">
                    <div class="card-header" id="usage-heading-7">
                    <h5 class="mb-0">
                        <button class="btn btn-link collpase-text-btn" data-toggle="collapse" data-target="#usage-collapse-7" aria-expanded="false" aria-controls="usage-collapse-7">
                            Are there further benefits for ontological terminology management for research data management?
                        </button>
                    </h5>
                    </div>
                    <div id="usage-collapse-7" class="collapse" aria-labelledby="usage-heading-7" data-parent="#usage-accordion-7">
                        <div class="card-body">
                            <p className='justify'>
                                Ontologies will realise a machine-processable expression of the semantics of established domain concepts. They will be applied to enable unambiguous and semantically enriched access to distributed datasets. They will function as the corner stone for a semantic web of data, enabling effective access and machine-actionable processing of information, easy and unambiguous exchange of data over system barriers, as well as the automation of related processes and reuse of data.
                            </p>                            
                        </div>
                    </div>
                </div>
            </div>
            {/* accordion-7 end */}
            <br></br>
            {/* accordion-8 start */}
            <div id="usage-accordion-8">
                <div class="card">
                    <div class="card-header" id="usage-heading-8">
                    <h5 class="mb-0">
                        <button class="btn btn-link collpase-text-btn" data-toggle="collapse" data-target="#usage-collapse-8" aria-expanded="false" aria-controls="usage-collapse-8">
                            Where can I learn more on terminologies in RDM?
                        </button>
                    </h5>
                    </div>
                    <div id="usage-collapse-8" class="collapse" aria-labelledby="usage-heading-8" data-parent="#usage-accordion-8">
                        <div class="card-body">
                            <p className='justify'>
                                <ul>
                                    <li>The FAIR Cookbook: a deliverable of the FAIRplus project (grant agreement 802750), funded by the IMI programme, a private-public partnership that receives support from the European Union’s Horizon 2020 research and innovation programme and EFPIA Companies. Introduction to terminologies and ontologies <a href="https://w3id.org/faircookbook/FCB019" target={"_blank"}>https://w3id.org/faircookbook/FCB019</a></li>
                                    <li><a href="https://www.w3.org/TR/rdf11-primer/" target={"_blank"}>https://www.w3.org/TR/rdf11-primer/</a></li>
                                    <li><a href="https://www.w3.org/TR/rdf-schema/" target={"_blank"}>https://www.w3.org/TR/rdf-schema/</a></li>
                                    <li><a href="https://www.w3.org/TR/owl2-primer/" target={"_blank"}>https://www.w3.org/TR/owl2-primer/</a></li>
                                    <li><a href="https://www.w3.org/TR/skos-reference/" target={"_blank"}>https://www.w3.org/TR/skos-reference/</a></li>
                                </ul>    
                            </p>                            
                        </div>
                    </div>
                </div>
            </div>
            {/* accordion-8 end */}
            <br/>
            {/* accordion-9 start */}
            <div id="usage-accordion-9">
                <div class="card">
                    <div class="card-header" id="usage-heading-9">
                    <h5 class="mb-0">
                        <button class="btn btn-link collpase-text-btn" data-toggle="collapse" data-target="#usage-collapse-9" aria-expanded="false" aria-controls="usage-collapse-9">
                            Where can I visualize my ontologies?
                        </button>
                    </h5>
                    </div>
                    <div id="usage-collapse-9" class="collapse" aria-labelledby="usage-heading-9" data-parent="#usage-accordion-9">
                        <div class="card-body">
                            <p className='justify'>
                                <ul>
                                    <li><a href="https://service.tib.eu/sc3/" target={"_blank"}>Ontology Curation Portal</a></li>
                                </ul>    
                            </p>                            
                        </div>
                    </div>
                </div>
            </div>
            {/* accordion-9 end */}
        </div>
    ];

    return content;
}
