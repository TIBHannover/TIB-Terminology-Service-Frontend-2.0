import { Component } from "react";
import React from "react";

class About extends Component{
    render(){
        return(
            <div id="content">
            <div class="sect1">
            <h2 id="_about_the_terminology_service">About the Terminology Service</h2>
            <div class="sectionbody">
            <div class="paragraph">
            <p>The NFDI4Chem Terminology Service is a repository for chemistry and related ontologies providing a single point of access to the latest ontology versions. You can browse or search the ontologies and look into their terms and relations. The Terminology Service can be used either by humans throught the website or by machines via the TS API. The ontologies have been selected based on their relevance for chemistry in general and for research data management for chemistry in particular. The NFDI4Chem Terminology Service is developed and maintained by TIB - Leibniz Information Centre for Science and Technology. It is part of the service portfolio of the NFDI4Chem consortium within the National Research Data Infrastructure. Future development will include curation and creation tools for terminologies. </p>
            </div>
            <h3>Description of NFDI4Chem consortium</h3>
            <img src="https://terminology.nfdi4chem.de/ts/img/nfdi4chemservice.png" width="1024" height="822.8" alt="archetypes"></img>
            
            <div class="paragraph">
            <p>As part of the outstanding National Research Data Infrastructure (NFDI) initiative for Germany as a center of science, the NFDI4Chem consortium has been formed for the field of chemistry. The overarching aim of this association of universities and non-university research institutions, infrastructure facilities, computing centers, and national professional societies (GDCh, DBG, DPhG) is to organize sustainable Research Data Management (RDM) in chemistry in order to better exploit the great potential of research data as a valuable resource for science and research. In addition to the digitalization and networking of all data-based processes in chemical research, our vision also includes the establishment and maintenance of the national research data infrastructure for chemistry and the development of innovative and easy-to-use services for the best possible subsequent use of research data. The associated cultural change in the chemical community is to be accompanied by a holistic education & training concept with, among other things, extensive measures to promote Open Science and RDM in accordance with the FAIR (<b>F</b>indable, <b>A</b>ccessible, <b>I</b>nteroperable and <b>R</b>eusable) data principles. In order to ensure the findability and thus the reusability of research data, comprehensive and, above all, meaningful (semantic) data annotation with the help of suitable metadata is indispensable. This in turn requires a uniform (metadata) vocabulary or standardized terminology, preferably on an ontological basis.</p>
            </div>
            <h3 id="_publications">Publications:</h3>
            <div class="paragraph">
              <p><a href="https://riojournal.com/article/55852/">NFDI4Chem - Towards a National Research Data Infrastructure for Chemistry in Germany</a></p>
            </div>
            </div>
            </div>
            </div>
        );
    }
}
export default About;