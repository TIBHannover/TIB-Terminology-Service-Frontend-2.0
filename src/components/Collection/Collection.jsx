import React from 'react';
import NFDI4CHEMLogo  from "../../assets/img/NFDI4Chem_Logo_mit_Claim/Web_Word_Powerpoint/png/NFDI4Chem-Logo-Claim_mehrfarbig_schwarz.png";
import COYPULogo from "../../assets/img/logo_CoyPu.png";
import FAIRDSLogo from "../../assets/img/FAIR_DS_Logo_RGB.png";
import FIDMOVELogo from "../../assets/img/fidmove_logo.svg";
import BAUDIGITALLogo from "../../assets/img/bau-digital_logo210420_RZ_Web_RGB_11.svg";
import '../layout/Collections.css';
import {getCollectionOntologies} from '../../api/fetchData';


class Collections extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            collectionOntologies: [],
            collectionIds: {"NFDI4CHEM": {}, "NFDI4ING":{}, "CoyPu":{}, "FID move":{}, "FAIR Data Spaces":{}, "FID BAUdigital":{}}
        });

        this.getOntologies = this.getOntologies.bind(this);
        this.createCollectionCard = this.createCollectionCard.bind(this);
        this.createCollectionList = this.createCollectionList.bind(this);
    }


    /**
     * Get the list og ontologies for a collection
     * @param {*} collectionId 
     */
    async getOntologies(){
        let collectionOntologies = {};
        for (let col in this.state.collectionIds){
            let ontologies = await getCollectionOntologies([col], false);
            collectionOntologies[col] = [];
            for (let onto of ontologies){
                collectionOntologies[col].push(
                    <a href={'/ontologies/' + onto["ontologyId"]} className='ontologies-link-tag' target="_blank">{onto["ontologyId"]}</a>
                );
            }

        }
        
        this.setState({
            collectionOntologies: collectionOntologies
        });
    }


    /**
     * Create the skeleton for rendering a collectin info
     * @param {*} collectionName 
     * @param {*} collectionId 
     * @param {*} Logo 
     * @param {*} content 
     * @returns 
     */
    createCollectionCard(collectionName, collectionId, Logo, content){
        let card = [
            <div className='row collection-card-row' key={collectionId}>
                <div className='col-sm-2' key={collectionId + "_logo"}>
                    <img class="img-fluid" alt="" width="200" height="100" src={Logo}/>
                </div>
                <div className='col-sm-10 collection-content'>
                    <div className='row' key={collectionId + "_name"}>
                        <div className='col-sm-12'>
                            <h4>{collectionName}</h4>
                        </div>                          
                    </div>
                    <div className='row' key={collectionId + "_content"}>
                        <div className='col-sm-12'>
                            <p align="justify">
                                {content}
                            </p>
                        </div>                          
                    </div>
                    <div className='row' key={collectionId + "_ontoList"}>
                        <div className='col-sm-12 collection-ontologies-text'>
                            <b>Ontologies:</b>{this.state.collectionOntologies.length != 0 ? this.state.collectionOntologies[collectionId] : ""}
                        </div>
                    </div>           
                </div>
            </div>
        ];

        return card;
    }


    createCollectionList(){
        let nfdi4ingLogoUrl = "https://terminology.nfdi4ing.de/ts4ing/img/logo_nfdi4ing_rgb_quer_scaled.png";
        let collectionIds = this.state.collectionIds;
        collectionIds["NFDI4CHEM"] = {"logo": NFDI4CHEMLogo, "name": "NFDI4Chem Project", "content": "The NFDI4Chem Terminology Service is a repository for chemistry and related ontologies providing a single point of access to the latest ontology versions. You can browse or search the ontologies and look into their terms and relations. The Terminology Service can be used either by humans throught the website or by machines via the TS API. The NFDI4Chem Terminology Service is developed and maintained by TIB - Leibniz Information Centre for Science and Technology. It is part of the service portfolio of the NFDI4Chem consortium within the National Research Data Infrastructure."};
        collectionIds["NFDI4ING"] = {"logo": nfdi4ingLogoUrl, "name": "NFDI4Ing Project", "content":"NFDI4Ing Terminology Service is a repository for engineering ontologies that aims to provide a single point of access to the latest ontology versions. You can browse engineering ontologies either through this website or via the Rest API. NFDI4Ing TS is developed and maintained by TIB as an extension of the TIB Central Terminology Service ." };
        collectionIds["CoyPu"] = {"logo": COYPULogo, "name": "CoyPu Project", "content": "The CoyPu collection by TIB Terminology Service provides a well-selected set of ontologies for representing the domain for integrating, structuring, networking, analyzing and evaluating heterogeneous data from economic value networks as well as the industry environment and social context."};
        collectionIds["FAIR Data Spaces"] = {"logo": FAIRDSLogo, "name": "FAIR Data Spaces Project", "content": "The collection of ontologies used in FAIR Data Spaces project is developed by the demonstrators from the  biodiversity, engineering sciences, and healthcare domain to enable the implementation of a common cloud-based data space for industry and academia within the Gaia-X European data infrastructure.  The focus of this collection is to ensure interoperability and reusability in Gaia-X, especially for organizations."};
        collectionIds["FID BAUdigital"] = {"logo": BAUDIGITALLogo , "name": "FID Baudigital Project", "content": "The FID BAUdigital collection provides a well-selected set of ontologies and controlled vocabularies related to the domains of civil engineering, architecture and urban planning with a focus on digital methods and technologies"};
        collectionIds["FID move"] = {"logo": FIDMOVELogo, "name": "FID Move Project", "content": "The FID move collection on TIB Terminology Service provides a well-selected set of ontologies related to the domains of mobility and transportation research."};
        let result = [];
        for (let col in collectionIds){
            result.push(this.createCollectionCard(collectionIds[col]["name"], col, collectionIds[col]["logo"], collectionIds[col]["content"]));
        }

        return result;
    }

    
    componentDidMount(){
        this.getOntologies();        
    }


    render(){
        return(
            <div className='container collections-info-container'>
                <div className='row'>
                    <div className='col-sm-2'></div>
                    <div className='col-sm-10'><h3 className="text-dark">Collections</h3></div>  
                </div>
                <br></br>
                {this.createCollectionList()}
            </div>
        );
    }
}

export default Collections;