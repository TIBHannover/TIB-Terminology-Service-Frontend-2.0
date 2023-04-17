export function nfdi4ingHomePage(){
    let content = [
        <div className="row justify-content-center">
            <div className="col-sm-8">
                <div className="row">
                    <div className="col-sm-4">
                        <a href="#" className="d-block">
                            <img className="img-fluid home-image" alt="Blog image" src="/about.svg"/>
                        </a>
                        <div className="p-3">
                            <div className="font-weight-bold mb-2">
                                <h4><b><center>NFDI4Ing Terminology Service</center></b></h4>
                            </div>
                            <p>
                                NFDI4Ing Terminology Service is a repository for engineering ontologies that aims 
                                to provide a single point of access to the latest ontology versions. You can browse engineering 
                                ontologies either through this website or via the Rest API. NFDI4Ing TS is developed and maintained 
                                by <a href="https://www.tib.eu">TIB</a> as an extension of the <a href="https://service.tib.eu/ts4tib">TIB Central Terminology Service</a> . 
                            </p>
                        </div>   
                    </div>
                    <div className="col-sm-4">
                        <a href="#" className="d-block">
                            <img className="img-fluid home-image" alt="Blog image" src="/brainstorm.svg"/>
                        </a>
                        <div className="p-3">
                            <div className="font-weight-bold mb-2">
                               <h4><b><center>Community Vision of NFDI4Ing</center></b></h4>
                            </div>
                            <p>
                                NFDI4Ing Terminology Service is a community driven offer, that intends to reflect the interests 
                                of engineers (see respective DFG Subjects Area) . We appreciate and encourage everyone interested 
                                to get involved in shaping it by proposing further existing ontologies and new features. 
                                To make such proposals please either write an email to felix.engel (AT) tib.eu or use our GitLab issue tracker. 
                            </p>
                        </div>   
                    </div>
                    <div className="col-sm-4">
                        <a href="#" className="d-block">
                            <img className="img-fluid home-image" alt="Blog image" src="/function.svg"/>
                        </a>
                        <div className="p-3">
                            <div className="font-weight-bold mb-2">
                             <h4><b><center>Specifications</center></b></h4>
                            </div>
                            <p> 
                            This service can be used to search for terminologies both manually and programmatically. Users can access the extensive and interactive metadata of each term from the user interface. On the other hand, data repositories or electronic lab notebooks can use the comprehensive API to retrieve ontology terms. More information can be found on <a className="ahome" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/docs"}>Documentation</a> about the usage.
                            </p>
                        </div>   
                    </div>
                </div>               
            </div>
        </div>
    ];

    return content;
}
