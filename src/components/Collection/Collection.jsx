import React from 'react';
import '../layout/Collections.css';
import {getCollectionOntologies} from '../../api/fetchData';
import collectionsInfoJson from "../../assets/collectionsText.json";


class Collections extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            collectionOntologies: [],
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
        for (let col in collectionsInfoJson){            
            let ontologies = await getCollectionOntologies([collectionsInfoJson[col]["id"]], false);            
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
        let result = [];
        for (let col in collectionsInfoJson){
            result.push(this.createCollectionCard(collectionsInfoJson[col]["name"], col, collectionsInfoJson[col]["logo"], collectionsInfoJson[col]["text"]));
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
                    <div className='col-sm-10'><h3>Collections</h3></div>  
                </div>
                <br></br>
                {this.createCollectionList()}
            </div>
        );
    }
}

export default Collections;
