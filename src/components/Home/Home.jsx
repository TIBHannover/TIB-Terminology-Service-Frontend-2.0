import React from "react";
import { Grid, Container, Button } from '@material-ui/core'
import "../layout/Home.css"
import NFDI4CHEM  from "../../assets/img/NFDI4Chem_Logo_mit_Claim/Web_Word_Powerpoint/png/NFDI4Chem-Logo-Claim_mehrfarbig_schwarz.png"
import COYPU from "../../assets/img/logo_CoyPu.png"
import FAIRDS from "../../assets/img/FAIR_DS_Logo_RGB.png"
import FIDMOVE from "../../assets/img/fidmove_logo.svg"
import BAUDIGITAL from "../../assets/img/baudigital_logo.png"

class Home extends React.Component{
  constructor(props){
    super(props)
    this.state=({
       statsResult: []
    })
    this.Stats = this.Stats.bind(this);
  }

  async Stats(){
    let statsResult = await fetch(`https://service.tib.eu/ts4tib/api/ontologies/getstatistics`)
    statsResult = (await statsResult.json());
    console.info(statsResult)
    this.setState({
      statsResult: statsResult
    })

  }

  componentDidMount(){
    this.Stats();
  }
    render(){
        return(
        <div id="mainpageSearchBox">
          <div className="container home-page-content-container">
            <div className="row">
              <div className="col-sm-12">
                  <h3>TIB Terminology Service</h3>
                  <p>
                      With its new Terminology Service, TIB – Leibniz Information Centre for Science and Technology
                      and University Library provides a single point of access to terminology from domains such as architecture,
                      chemistry, computer science, mathematics and physics. You can browse ontologies through the website or use its API
                      to retrieve terminological information and use it in your technical services. Layout template for TIB General. 
                  </p>
                  <p>
                    Examples: <a href='/search?q=oxidation'>Oxidation</a>, <a href='/search?q=IAO_0020000'>IAO_0020000</a>
                  </p>
                  <p></p>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <h3>Collections</h3>
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
                          <h3 class="h5 mb-0">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
                           tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.&nbsp;
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
                        <h3 class="h5 mb-0">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor .</h3>
                      </a>
                  </div>
              </div> 
              </div>
              <div className="col-sm-6">
                <div class="bg-white d-flex flex-column h-100 collection-holder-box"> 
                    <div class="p-3">
                        <img src={BAUDIGITAL}/>
                        <div class="font-weight-bold mb-2">FID Baudigital</div>
                        <h3 class="h5 mb-0"><a href="#" class="text-dark text-decoration-none">
                          Lorum Ipsum, Lorum Ipsum&nbsp;</a>Only static HTML - Web sites. You can click on menu item in navbar. 
                          Additionally avalaible: Layout search result 
                          <a href="file:///C:/Users/koeplero/Meine%20Ablage/Pinegrow%20-%20TS%20TIB%20General/search_results.html">EXAMPLE.
                          </a><span> and Detail page of ontology entry </span>
                          <a href="file:///C:/Users/koeplero/Meine%20Ablage/Pinegrow%20-%20TS%20TIB%20General/edam.html">EXAMPLE</a></h3>
                    </div>
                </div>
              </div>
            </div>

          </div>
            
          <Container maxWidth="lg" className="bg-infobox">
            <Grid item xs={8}>
               <div className="col-xl-10 mx-auto text-white">
                 <h3 className="font-weight-bold">Terminology Service Statistics</h3>
                 <div className="row">
                   <div className="col-lg-3 col-sm-6 pb-3 pt-3">
                   <div className="pl-3 pr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="3em" height="3em" class="mb-4">
                          <g>
                            <path fill="none" d="M0 0h24v24H0z"/>
                            <path d="M12 14v2a6 6 0 0 0-6 6H4a8 8 0 0 1 8-8zm0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm6 10.5l-2.939 1.545.561-3.272-2.377-2.318 3.286-.478L18 14l1.47 2.977 3.285.478-2.377 2.318.56 3.272L18 21.5z"/>
                          </g>
                        </svg>
                      <h4 className="font-weight-bold h2 mb-1">{this.state.statsResult.numberOfOntologies}</h4>
                      <p className="mb-0">Ontologies</p>
                    </div>   
                  </div>
                  <div className="col-lg-3 col-sm-6 pb-3 pt-3">
                    <div className="pl-3 pr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="3em" height="3em" class="mb-4">
                        <g>
                          <path fill="none" d="M0 0h24v24H0z"/>
                            <path d="M2 13h6v8H2v-8zm14-5h6v13h-6V8zM9 3h6v18H9V3zM4 15v4h2v-4H4zm7-10v14h2V5h-2zm7 5v9h2v-9h-2z"/>
                        </g>
                      </svg>
                      <h4 className="font-weight-bold h2 mb-1">{this.state.statsResult.numberOfTerms}</h4>
                      <p class="mb-0">terms</p>
                    </div>                                 
                  </div>
                    <div className="col-lg-3 col-sm-6 pb-3 pt-3">
                      <div className="pl-3 pr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="3em" height="3em" class="mb-4">
                          <g>
                            <path fill="none" d="M0 0h24v24H0z"/>
                              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-5-8h2a3 3 0 0 0 6 0h2a5 5 0 0 1-10 0z"/>
                          </g>
                        </svg>
                        <h4 className="font-weight-bold h2 mb-1">{this.state.statsResult.numberOfProperties}</h4>
                        <p className="mb-0">Properties</p>
                      </div>                                 
                    </div>  
                    <div className="col-lg-3 col-sm-6 pb-3 pt-3">
                      <div className ="pl-3 pr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="3em" height="3em" class="mb-4">
                          <g>
                            <path fill="none" d="M0 0h24v24H0z"/>
                            <path d="M5 4.604v9.185a4 4 0 0 0 1.781 3.328L12 20.597l5.219-3.48A4 4 0 0 0 19 13.79V4.604L12 3.05 5 4.604zM3.783 2.826L12 1l8.217 1.826a1 1 0 0 1 .783.976v9.987a6 6 0 0 1-2.672 4.992L12 23l-6.328-4.219A6 6 0 0 1 3 13.79V3.802a1 1 0 0 1 .783-.976zM12 13.5l-2.939 1.545.561-3.272-2.377-2.318 3.286-.478L12 6l1.47 2.977 3.285.478-2.377 2.318.56 3.272L12 13.5z"/>
                          </g>
                        </svg>
                        <h4 className ="font-weight-bold h2 mb-1">{this.state.statsResult.numberOfIndividuals}</h4>
                        <p className ="mb-0">individual</p>
                      </div>                                 
                    </div>   
                 </div>
               </div>
            </Grid>
          </Container>
        </div>
        );
    }
}
export default Home;