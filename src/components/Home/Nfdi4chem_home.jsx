export function nfdi4chemHomePage(){
    let content = [
        <div className="row justify-content-center">
            <div className="col-sm-8">
                <div className="row">
                    <div className="col-sm-4">
                            <img className="img-fluid" alt="Blog image" src="/Icon1-4.png"/>
                        <div class="p-3">
                            <div class="font-weight-bold mb-2">
                                <h5>WHAT IS THIS ?</h5>
                            </div>
                            <p>The Terminology Service is a repository for chemistry ontologies. It is a central point of access to the latest versions of these ontologies providing comprehensive information about their scope, application and curators. The ontologies have been selected by a set of <a className = "ahome" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/about"}>quality criteria</a> defining their feasibility to describe chemistry research activities and research data in an open and FAIR manner.</p>
                        </div>   
                    </div>
                    <div className="col-sm-4">
                            <img className="img-fluid" alt="Blog image" src="/Icon2-4.png"/>
                        <div class="p-3">
                            <div class="font-weight-bold mb-2">
                               <h5>HOW TO SEARCH ?</h5>
                            </div>
                            <p>You can search the Terminology Service by metadata, classes and properties of the ontologies to check if and where a class, term or concept is described. You can filter the result list by several criteria. Alternatively, you can first browse first a list of ontologies and then their classes or properties using the tree view.</p>
                        </div>   
                    </div>
                    <div className="col-sm-4">
                            <img className="img-fluid" alt="Blog image" src="/Icon3-4.png"/>
                        <div class="p-3">
                            <div class="font-weight-bold mb-2">
                             <h5>NOT A HUMAN ?</h5>
                            </div>
                            <p>The Terminology Service is available in particular for use by other services. Data repositories or electronic lab notebooks can use the comprehensive API of the Terminology Service to retrieve and provide ontology terms in their user interfaces enabling semantic data annotation. Please visit the comprehensive <a className="ahome" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/api"}>API documentation</a> to find out more about the API and how to use it for your services.</p>
                        </div>   
                    </div>
                </div>               
            </div>
        </div>
    ];

    return content;
}