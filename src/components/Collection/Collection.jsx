import React from 'react';
import NFDI4CHEM  from "../../assets/img/NFDI4Chem_Logo_mit_Claim/Web_Word_Powerpoint/png/NFDI4Chem-Logo-Claim_mehrfarbig_schwarz.png";
import COYPU from "../../assets/img/logo_CoyPu.png";
import FAIRDS from "../../assets/img/FAIR_DS_Logo_RGB.png";
import FIDMOVE from "../../assets/img/fidmove_logo.svg";
import BAUDIGITAL from "../../assets/img/bau-digital_logo210420_RZ_Web_RGB_11.svg";
import '../layout/Collections.css';


class Collections extends React.Component{

    render(){
        return(
            <div className='container collections-info-container'>
                <div className='row'>
                    <div className='col-sm-2'></div>
                    <div className='col-sm-10'><h3>Collections</h3></div>  
                </div>
                <br></br>
                <div className='row'>
                    <div className='col-sm-2'>
                        <img class="img-fluid" alt="" width="200" height="100" src={NFDI4CHEM}/>
                    </div>
                    <div className='col-sm-10'>
                        <div className='row'>
                            <div className='col-sm-12'>
                                <h4>NFDI4Chem Project</h4>
                            </div>                          
                        </div>
                        <div className='row'>
                            <div className='col-sm-12'>
                                <p>
                                    The NFDI4Chem Terminology Service is a repository for chemistry and related ontologies 
                                    providing a single point of access to the latest ontology versions. You can browse or search the ontologies 
                                    and look into their terms and relations. The Terminology Service can be used either by humans throught 
                                    the website or by machines via the TS API. The NFDI4Chem Terminology Service is 
                                    developed and maintained by TIB - Leibniz Information Centre for Science and Technology. 
                                    It is part of the service portfolio of the NFDI4Chem consortium within the National Research 
                                    Data Infrastructure.
                                </p>
                            </div>                          
                        </div>
                        <div className='row'>
                            <div className='col-sm-12'>
                                <b>Ontologies:</b>
                            </div>                          
                        </div>                                                
                    </div>
                </div>

            </div>
        );
    }
}

export default Collections;
