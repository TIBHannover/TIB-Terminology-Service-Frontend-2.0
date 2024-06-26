import React from 'react';
import '../layout/collectionList.css';
import CollectionApi from '../../api/collection';
import collectionsInfoJson from "../../assets/collectionsText.json";
import queryString from 'query-string'; 
import { Helmet, HelmetProvider } from 'react-helmet-async';


class Collections extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            collectionOntologies: [],
        });

        this.setComponentData = this.setComponentData.bind(this);
        this.createCollectionCard = this.createCollectionCard.bind(this);
        this.createCollectionList = this.createCollectionList.bind(this);
    }

    
    async setComponentData(){
        let collectionApi = new CollectionApi();
        let collectionOntologies = {};
        for (let col in collectionsInfoJson){            
            let ontologies = await collectionApi.fetchOntologyListForCollections([collectionsInfoJson[col]["id"]], false);            
            collectionOntologies[col] = [];
            for (let onto of ontologies){
                collectionOntologies[col].push(
                    <a href={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + onto["ontologyId"]} className='ontologies-link-tag' target="_blank">{onto["ontologyId"]}</a>
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
    createCollectionCard(collectionId, collectionJson){
        let card = [
            <div className='row collection-card-row' key={collectionId} id={"section_" + collectionJson["html_id"]}>
                <div className='col-sm-3' key={collectionId + "_logo"}>                    
                    <a href={process.env.REACT_APP_PROJECT_SUB_PATH + collectionJson["ontology_list_url"]} className="collection-image-anchor">
                        <img class="img-fluid" className='collection-logo-in-list ' alt="logo"  src={collectionJson["logo"]}/>
                    </a>
                </div>
                <div className='col-sm-9 collection-content'>
                    <div className='row' key={collectionId + "_name"}>
                        <div className='col-sm-12'>
                            <h4>{collectionJson["name"]}</h4>
                        </div>
                    </div>
                    <div className='row' key={collectionId + "_content"}>
                        <div className='col-sm-12'>
                            <p align="justify">
                                {collectionJson["text"]}
                            </p>
                        </div>                          
                    </div>
                    <div className='row' key={collectionId + "_projectUrl"}>
                        <div className='col-sm-12 collection-ontologies-text'>
                            <b>Project Homepage: </b>
                            <a href={collectionJson["project_homepage"]} target="_blank">{collectionJson["project_homepage"]}</a>
                        </div>
                    </div>
                    <div className='row' key={collectionId + "_domainLink"}>
                        <div className='col-sm-12 collection-ontologies-text'>
                            <b>Domain-specific terminolgy service: </b>
                            <a href={collectionJson["domain_ts_link"]} target="_blank">{collectionJson["domain_ts_link"]}</a>
                        </div>
                    </div>  
                    <div className='row' key={collectionId + "_ontoList"}>
                        <div className='col-sm-12 collection-ontologies-text'>
                            <b>Ontology Selection Criteria:</b>
                            <div dangerouslySetInnerHTML={{__html: collectionJson["selection_criteria"]}} ></div>
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
            result.push(this.createCollectionCard(col, collectionsInfoJson[col]));
        }

        return result;
    }

    
    componentDidMount(){
        this.setComponentData();
        let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
        let targetCollectionId = targetQueryParams.col;
        if(typeof(targetCollectionId) !== "undefined"){
            document.getElementById("section_" + targetCollectionId).scrollIntoView();
        }        
    }


    render(){
        return(
            <>
                <HelmetProvider>
                    <div>
                        <Helmet>
                        <title>Collections</title>
                        </Helmet>
                    </div>
                </HelmetProvider>
                <div className='row'> 
                    <div className='col-sm-12 collections-info-container'>
                        {this.createCollectionList()}
                    </div>                                            
                </div>
            </>
        );
    }
}

export default Collections;
