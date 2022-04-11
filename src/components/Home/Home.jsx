import { Component } from "react";
import SearchForm from "../Search/SearchForm";
import { Grid, Container, Button } from '@material-ui/core'

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
        </div>
        );
    }
}
export default Home;