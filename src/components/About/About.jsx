import React from 'react'
import NFDI4CHEM from "../../assets/img/NFDI4Chem_Logo_mit_Claim/Web_Word_Powerpoint/png/NFDI4Chem-Logo-Claim_mehrfarbig_schwarz.png"
import COYPU from "../../assets/img/logo_CoyPu.png"
import NFDI4ING from "../../assets/img/logo_nfdi4ing_rgb_quer_scaled.png"

class About extends React.Component{
    render(){
        return(
            <div>
                <br/>
                <h1>About TIB Terminology Service</h1>
                <br/>
                <h3>What is TIB Terminology Service?</h3>
                <p>TIB Terminology Service is an open source, free of charge web service hosted by <a href="https://www.tib.eu/de/">TIB – Leibniz Information Centre for Science and Technology and University Library.</a></p>
                <p>TIB Terminology Service intends to be your one-stop-shop for terminology search, browsing and look-up. In particular, it enables you to:</p>
                <ul>
                    <li>Access the latest versions of the most relevant terminologies from chemistry, engineering, architecture and many more domains.</li>
                    <li>Explore domain knowledge via concept hierarchies, find synonyms or translations of terms, look up definitions and retrieve a concept’s persistent identifier.</li>
                    <li>Use TIB Terminology Service data (JSON) in your own service or application via REST API.</li>
                    <li>Publish your own terminology on TIB Terminology Service.</li>
                </ul>
                <h3>Roadmap</h3>
                <p>TIB Terminology Service is still under development. In the future, more contents and functionality will be added, e.g.</p>
                <ul>
                    <li>further general-purpose and domain terminologies,</li>
                    <li>reliable storage for newly developed terminologies,</li>
                    <li>tools for the collaborative creation of terminologies (e.g. versioning system, online editor)</li>
                    <li>a help-desk to assist the user community in the curation of terminologies.</li>
                </ul>
                <h3>Community Terminology Services</h3>
                <p>Visit our community services with specific collections for engineering, chemistry or economics:</p>
                <img src={NFDI4ING} alt="nfdi4ing" />
                <img src={NFDI4CHEM} alt="nfdi4chem" style={{ borderWidth: 0, height: '300px' }}/>
                <img src={COYPU} alt="coypu" style={{ borderWidth: 0, height: '100px' }}/>

            </div>
        )
    }

}

export default About