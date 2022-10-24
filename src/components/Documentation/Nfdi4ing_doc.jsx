export function nfdi4IngDoc(){
    let content = [
        <div>
            <div className="row">
                <div className="col-sm-12">
                    NFDI4Ing Terminology Service can be used both manually and programmatically. Manual access (User Interface) appeals to a larger audience whereas programmatical access (REST Interface) can play a key role in larger contexts. For this reason, they are both essential features of the service. 
                </div>
            </div>
            <br></br>
            <div className="row">
                <div className="col-sm-12">
                    {/* accordion-1 start */}
                    <div id="usage-accordion-1">
                        <div class="card">
                            <div class="card-header" id="usage-heading-8">
                            <h5 class="mb-0">
                                <button class="btn btn-link collpase-text-btn" data-toggle="collapse" data-target="#usage-collapse-1" aria-expanded="false" aria-controls="usage-collapse-1">
                                    User Interface Specification of NFDI4Ing Terminology Service
                                </button>
                            </h5>
                            </div>
                            <div id="usage-collapse-1" class="collapse" aria-labelledby="usage-heading-1" data-parent="#usage-accordion-1">
                                <div class="card-body">
                                    <p className='justify'>
                                        There are two main ways of browsing the Terminology Service . You can either browse the available ontologies via the Ontologies tab or you can make search on all available ontologies by using the search box in the main page. If you browse the available ontologies, you should pick an ontology from the list and then you can browse through its tree view to lower levels or you can make a search for a specific term in that particular ontology through its search box. Alternatively, if you make a search from the search box provided in the home page, the results will be displayed based on all ontologies that include the searched term. By using advanced search options, you can further restrict the results to one or multiple ontologies and/or to specific types. These types are class, property, individual or ontology. As a result, your search leads you to the graph based view of a term regardless of your browsing methodology.  
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
                            <div class="card-header" id="usage-heading-8">
                            <h5 class="mb-0">
                                <button class="btn btn-link collpase-text-btn" data-toggle="collapse" data-target="#usage-collapse-2" aria-expanded="false" aria-controls="usage-collapse-2">
                                    REST Interface Specification of NFDI4Ing Terminology Service
                                </button>
                            </h5>
                            </div>
                            <div id="usage-collapse-2" class="collapse" aria-labelledby="usage-heading-2" data-parent="#usage-accordion-2">
                                <div class="card-body">
                                    <p className='justify'>
                                        The main REST API interface of the
                                        <a href="with http://service.tib.eu/ts4tib/api" target={"_blank"}> TIB Central Terminology Service</a>  starts 
                                        . This API enables to search all the terminologies 
                                        maintained by TIB in addition to engineering terminologies. In addition to this interface, 
                                        NFDI4IngTS provides another REST API that enables to search a subset of these terminologies 
                                        that are only related to NFDI4Ing. This interface can be queried from
                                        <a href="http://service.tib.eu/ts4ing/api" target={"_blank"}> http://service.tib.eu/ts4ing/api</a>. 
                                        The methodology on how to use these interfaces is explained in the API documentation in detail.
                                    </p>
                                    <p className='justify'>
                                        Publicly available API commands can also be analyzed and executed from the 
                                        <a href="http://service.tib.eu/ts4tib/swagger-ui.html" target={"_blank"}><b> Swagger Documentation</b></a>. 
                                        The underlying models can further be viewed through this documentation for a deeper understanding of the API commands. 
                                    </p>                       
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* accordion-2 end */}
                </div>
            </div>
            <br></br>
            <h2>Report an Issue</h2>
            <div className="row">
                <div className="col-sm-12">
                    <p className="justify">
                        For feedback, enquiries or suggestion about NFDI4Ing TS or to request a new ontology please use our 
                        GitLab <a href="https://git.rwth-aachen.de/nfdi4ing/metadata4ing/terminology-service-issue-tracker/-/issues" target={"_blank"}> issue tracker</a>. 
                        For more information, you can <a href="https://nfdi4ing.de/contact/" target={"_blank"}> contact the NFDI4Ing management team</a>.
                    </p>
                </div>
            </div>

        </div>
    ];

    return content;
}