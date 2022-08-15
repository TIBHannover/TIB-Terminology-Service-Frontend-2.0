import React from 'react';
import NFDI4CHEMLogo  from "../../assets/img/NFDI4Chem_Logo_mit_Claim/Web_Word_Powerpoint/png/NFDI4Chem-Logo-Claim_mehrfarbig_schwarz.png";
import COYPU from "../../assets/img/logo_CoyPu.png";
import FAIRDS from "../../assets/img/FAIR_DS_Logo_RGB.png";
import FIDMOVE from "../../assets/img/fidmove_logo.svg";
import BAUDIGITAL from "../../assets/img/bau-digital_logo210420_RZ_Web_RGB_11.svg";
import '../layout/Collections.css';
import {getCollectionOntologies} from '../../api/fetchData';


class Collections extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            collectionOntologies: []
        });

        this.getOntologies = this.getOntologies.bind(this);
        this.createCollectionCard = this.createCollectionCard.bind(this);
    }


    /**
     * Get the list og ontologies for a collection
     * @param {*} collectionId 
     */
    async getOntologies(collectionId){
        let ontologies = await getCollectionOntologies(["NFDI4CHEM"], false);
        let collectionOntologies = {};
        collectionOntologies["NFDI4CHEM"] = []; 
        for (let onto of ontologies){
            collectionOntologies["NFDI4CHEM"].push(
                <a href="#" className='ontologies-link-tag'>{onto["ontologyId"]}</a>
            );
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
            <div className='row'>
                <div className='col-sm-2'>
                    <img class="img-fluid" alt="" width="200" height="100" src={Logo}/>
                </div>
                <div className='col-sm-10 collection-content'>
                    <div className='row'>
                        <div className='col-sm-12'>
                            <h4>{collectionName}</h4>
                        </div>                          
                    </div>
                    <div className='row'>
                        <div className='col-sm-12'>
                            <p align="justify">
                                {content}
                            </p>
                        </div>                          
                    </div>
                    <div className='row'>
                        <div className='col-sm-12 collection-ontologies-text'>
                            <b>Ontologies:</b>{this.state.collectionOntologies.length != 0 ? this.state.collectionOntologies[collectionId] : ""}
                        </div>
                    </div>           
                </div>
            </div>
        ];

        return card;
    }

    
    componentDidMount(){
        this.getOntologies("");
    }


    render(){
        return(
            <div className='container collections-info-container'>
                <div className='row'>
                    <div className='col-sm-2'></div>
                    <div className='col-sm-10'><h3>Collections</h3></div>  
                </div>
                <br></br>
                
            </div>
        );
    }
}

export default Collections;
