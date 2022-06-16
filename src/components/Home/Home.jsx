import { Component } from "react";
import SearchForm from "../Search/SearchForm";
import { Grid, Container, Button } from '@material-ui/core'
import "../layout/Home.css"

class Home extends Component{
    render(){
        return(
        <div id="mainpageSearchBox">
        <Container maxWidth="lg">
           <h4 style={{margin: 20}}>Welcome to NFDI4Chem Terminology Service</h4>
           <Grid item xs = {8}>
             <SearchForm />
           </Grid>
           <Grid item xs = {8}>
           <h4 style={{margin: 20}}>About NFDI4Chem TS</h4>
           <p class="about">The NFDI4Chem Terminology Service is a repository for chemistry and related ontologies providing a single point of access to the latest ontology versions. 
              You can browse or search the ontologies and look into their terms and relations. The Terminology Service can be used either by humans throught the website or by machines via the TS API.
              The NFDI4Chem Terminology Service is developed and maintained by TIB - Leibniz Information Centre for Science and Technology. 
              It is part of the service portfolio of the NFDI4Chem consortium within the National Research Data Infrastructure.</p>
           </Grid>
           </Container>
          <div className="bg-infobox">
          <Container>
            <Grid item xs={8}>
               <div className="col-xl-10 mx-auto text-white">
                 <h3 class="font-weight-bold h2">Terminology Service Stats</h3>
                 <div class="justify-content-center row">
                   <div className="col-lg-3 col-sm-6 pb-3 pt-3">
                   <div className="pl-3 pr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="3em" height="3em" class="mb-4">
                          <g>
                            <path fill="none" d="M0 0h24v24H0z"/>
                            <path d="M12 14v2a6 6 0 0 0-6 6H4a8 8 0 0 1 8-8zm0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm6 10.5l-2.939 1.545.561-3.272-2.377-2.318 3.286-.478L18 14l1.47 2.977 3.285.478-2.377 2.318.56 3.272L18 21.5z"/>
                          </g>
                        </svg>
                      <h4 class="font-weight-bold h2 mb-1">19</h4>
                      <p class="mb-0">Ontologies</p>
                    </div>   
                  </div>  
                 </div>
               </div>
            </Grid>
          </Container>
          </div>
        </div>
        );
    }
}
export default Home;