import NFDI4CHEM  from "../../assets/img/NFDI4Chem_Logo_mit_Claim/Web_Word_Powerpoint/png/NFDI4Chem-Logo-Claim_mehrfarbig_schwarz.png"
import COYPU from "../../assets/img/logo_CoyPu.png"
import FAIRDS from "../../assets/img/FAIR_DS_Logo_RGB.png"
import FIDMOVE from "../../assets/img/fidmove_logo.svg"
import BAUDIGITAL from "../../assets/img/bau-digital_logo210420_RZ_Web_RGB_11.svg"

export function createCollectionCards(){
    let cards = [
        <div className="container home-page-content-container">
            <div className="row">
              <div className="col-sm-12">
                  <h3 className="text-dark">TIB Terminology Service</h3>
                  <p className="text-justify text-dark text-decoration-none h5 mb-0">
                      With its new Terminology Service, TIB – Leibniz Information Centre for Science and Technology
                      and University Library provides a single point of access to terminology from domains such as architecture,
                      chemistry, computer science, mathematics and physics. You can browse ontologies through the website or use its API
                      to retrieve terminological information and use it in your technical services. Layout template for TIB General. 
                  </p>
                  <br/>
                  <p className="text-justify text-dark text-decoration-none h5 mb-0">
                    Examples: <a href='/search?q=oxidation' style={{textDecoration: "none"}}>Oxidation</a>, <a href='/search?q=IAO_0020000' style={{textDecoration: "none"}}>IAO_0020000</a>
                  </p>
                  <p></p>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <h3 className="text-dark">Collections</h3>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div class="bg-white d-flex flex-column h-100 collection-holder-box"> 
                  <a href="#" class="d-block">
                    <img class="img-fluid w-100" alt="Blog" width="700" height="480" src="https://terminology.nfdi4ing.de/ts4ing/img/logo_nfdi4ing_rgb_quer_scaled.png"/>
                  </a>
                  <div class="p-3">
                      <div class="font-weight-bold mb-2">NFDI4Ing</div>
                      <a href="#" class="text-dark text-decoration-none">
                        <h3 class="h5 mb-0">NFDI4Ing Terminology Service is a repository for engineering ontologies that aims to 
                          provide a single point of access to the latest ontology versions. You can browse engineering ontologies either through
                          this website or via the Rest API. NFDI4Ing TS is developed and maintained by TIB as an extension of the
                          TIB Central Terminology Service .
                        </h3>
                      </a>
                  </div>       
                </div> 
              </div>
              <div className="col-sm-6">
                <div class="bg-white d-flex flex-column h-100 collection-holder-box">
                  <a href="#" class="d-block"><img class="img-fluid w-100" alt="" width="700" height="480" src={NFDI4CHEM}/></a>
                    <div class="p-3">
                        <div class="font-weight-bold mb-2">NFDI4Chem</div>
                          <a href="#" class="text-dark text-decoration-none">
                            <h3 class="h5 mb-0">The NFDI4Chem Terminology Service is a repository for chemistry and related ontologies 
                              providing a single point of access to the latest ontology versions. You can browse or search the ontologies 
                              and look into their terms and relations. The Terminology Service can be used either by humans throught 
                              the website or by machines via the TS API. The NFDI4Chem Terminology Service is 
                              developed and maintained by TIB - Leibniz Information Centre for Science and Technology. 
                              It is part of the service portfolio of the NFDI4Chem consortium within the National Research 
                              Data Infrastructure.
                            </h3>
                          </a>
                    </div>
                </div> 
              </div>
            </div>
            <br></br>
            <div className="row">
              <div className="col-sm-6">
                <div class="bg-white d-flex flex-column h-100 collection-holder-box"> 
                  <a href="#" class="d-block"><img src={COYPU} class="img-fluid p-1 w-100" alt="Blog image" width="650" height="400"/></a>
                    <div class="p-3">
                        <div class="font-weight-bold mb-2">CoyPu</div>
                          <a href="#" class="text-dark text-decoration-none">
                            <h3 class="h5 mb-0">The CoyPu collection by TIB Terminology Service provides a well-selected set of ontologies 
                              for representing the domain for integrating, structuring, networking, analyzing and evaluating heterogeneous 
                              data from economic value networks as well as the industry environment and social context.
                            </h3>
                          </a>
                    </div>         
                </div>  
              </div>
              <div className="col-sm-6">
                <div class="bg-white d-flex flex-column h-100 collection-holder-box"> 
                  <a href="#" class="d-block"><img class="img-fluid w-100" alt="Blog image" width="700" height="480" src={FAIRDS}/></a>
                    <div class="p-3">
                        <div class="font-weight-bold mb-2">FAIR Data Spaces</div>
                        <a href="#" class="text-dark text-decoration-none">
                          <h3 class="h5 mb-0">The collection of ontologies used in FAIR Data Spaces project is developed by the demonstrators from the  biodiversity, engineering sciences, and healthcare domain to enable the implementation of a common cloud-based data space for industry and academia within the Gaia-X European data infrastructure.  The focus of this collection is to ensure interoperability and reusability in Gaia-X, especially for organizations.
                           </h3>
                        </a>
                    </div>     
                </div>  
              </div>
            </div>
            <br></br>
            <div className="row">
              <div className="col-sm-6">
              <div class="bg-white d-flex flex-column h-100 collection-holder-box"> 
                <a href="#" class="d-block"><img class="img-fluid w-100" alt="Blog image" width="700" height="480" src={FIDMOVE}/></a>
                  <div class="p-3">
                      <div class="font-weight-bold mb-2">FID Move</div>
                      <a href="#" class="text-dark text-decoration-none">
                        <h3 class="h5 mb-0">The FID move collection on TIB Terminology Service provides a well-selected set of ontologies related to the domains of mobility and transportation research.</h3>
                      </a>
                  </div>
              </div> 
              </div>
              <div className="col-sm-6">
                <div class="bg-white d-flex flex-column h-100 collection-holder-box"> 
                    <div class="p-3">
                        <img src={BAUDIGITAL} width="500" height="180"/>
                        <div class="font-weight-bold mb-2">FID Baudigital</div>
                        <h3 class="h5 mb-0"><a href="#" class="text-dark text-decoration-none">
                        The FID BAUdigital collection provides a well-selected set of ontologies and controlled vocabularies related to the domains of civil engineering, architecture and urban planning with a focus on digital methods and technologies.</a></h3>
                    </div>
                </div>
              </div>
            </div>

        </div>
    ];

    return cards;

} 