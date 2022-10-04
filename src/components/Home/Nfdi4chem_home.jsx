export function nfdi4chemHomePage(){
    let content = [
        <div className="row justify-content-center">
            <div className="col-sm-8">
                <div className="row">
                    <div className="col-sm-4">
                        <a href="#" class="d-block">
                            <img class="img-fluid" alt="Blog image" src="/chem_sample1.jpg"/>
                        </a>
                        <div class="p-3">
                            <div class="font-weight-bold mb-2">
                                <a href="#">WHAT IS THIS ?</a>
                            </div>
                            <a href="#" class="text-dark text-decoration-none"><h3 class="h5 mb-0">The Terminology Service is a repository for chemistry ontologies. It is a central point of access to the latest versions of these ontologies providing comprehensive information about their scope, application and curators. The ontologies have been selected by a set of <a href="/about">quality criteria</a> defining their feasibility to describe chemistry research activities and research data in an open and FAIR manner.</h3></a>
                        </div>   
                    </div>
                    <div className="col-sm-4">
                        <a href="#" class="d-block">
                            <img class="img-fluid" alt="Blog image" src="/chem_sample2.jpg"/>
                        </a>
                        <div class="p-3">
                            <div class="font-weight-bold mb-2">
                               <a href="#">HOW TO SEARCH ?</a>
                            </div>
                            <a href="#" class="text-dark text-decoration-none"><h3 class="h5 mb-0">You can search the Terminology Service by metadata, classes and properties of the ontologies to check if and where a class, term or concept is described. You can filter the result list by several criteria. Alternatively, you can first browse first a list of ontologies and then their classes or properties using the tree view.</h3></a>
                        </div>   
                    </div>
                    <div className="col-sm-4">
                        <a href="#" class="d-block">
                            <img class="img-fluid" alt="Blog image" src="/chem_sample3.jpg"/>
                        </a>
                        <div class="p-3">
                            <div class="font-weight-bold mb-2">
                             <a href="#">NOT A HUMAN ?</a>
                            </div>
                            <a href="#" class="text-dark text-decoration-none"><h3 class="h5 mb-0">The Terminology Service is available in particular for use by other services. Data repositories or electronic lab notebooks can use the comprehensive API of the Terminology Service to retrieve and provide ontology terms in their user interfaces enabling semantic data annotation. Please visit the comprehensive <a href="/documentation">API documentation</a> to find out more about the API and how to use it for your services.  </h3></a>
                        </div>   
                    </div>
                </div>               
            </div>
        </div>
    ];

    return content;
}