import { useEffect, useState } from "react";
import Pagination from "../../common/Pagination/Pagination";
import DropDown from "../../common/DropDown/DropDown";


const TITLE_SORT_KEY = "title";
const CLASS_SORT_KEY = "numberOfTerms";
const PROPERT_SORT_KEY = "numberOfProperties";
const INDIVIDUAL_SORT_KEY = "numberOfIndividuals";
const PREFIX_SORT_KEY = "ontologyId";
const TIME_SORT_KEY = "loaded"
const PAGE_SIZES_FOR_DROPDOWN = [{label: "10", value:10}, {label: "20", value:20}, {label: "30", value:30}, {label: "40", value:40}];
const SORT_DROPDONW_OPTIONS = [
    {label: "Title", value:TITLE_SORT_KEY},
    {label: "Prefix", value:PREFIX_SORT_KEY},
    {label: "Classes Count", value:CLASS_SORT_KEY},
    {label: "Properties Count", value:PROPERT_SORT_KEY},
    {label: "Individuals Count", value:INDIVIDUAL_SORT_KEY},
    {label: "Data Loaded", value:TIME_SORT_KEY},
];



export const OntologyListRender = (props) =>{

    const [ontologyListContent, setOntologyListContent] = useState('');

    function BuildCollectionForCard(collections){
        if (collections === null){
            return "";
        }
        let result = [];
        for(let i=0; i < collections.length; i++){
            if (i !== collections.length - 1){
                result.push(<span className='ontology-collection-name'><a href={process.env.REACT_APP_PROJECT_SUB_PATH + '/collections?col=' + collections[i] }>{collections[i]}</a></span>)
                result.push(",")
            }
            else{
                result.push(<span className='ontology-collection-name'><a href={process.env.REACT_APP_PROJECT_SUB_PATH + '/collections?col=' + collections[i]}>{collections[i]}</a></span>)
            }
            
        }
        return result;
    }


    function createOntologyList () {
        let ontologyList = []        
        for (let i = 0; i < props.ontologies.length; i++) {
          let item = props.ontologies[i]
          ontologyList.push(props.ontologiesHiddenStatus[i] &&                
                <div className="row result-card" id={'ontology_' + i} key={item.ontologyId}>
                  <div className='col-sm-9'>
                    <div className="ontology-card-title-section">                            
                      <a  href={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + item.ontologyId} className='ontology-button btn btn-secondary'>{item.ontologyId}</a>
                      <a  href={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + item.ontologyId} className="ontology-title-text-in-box"><b>{item.config.title}</b></a>
                    </div>
                    <div className="ontology-card-description">
                      <p>{item.config.description ? item.config.description : ""}</p>
                    </div>
                    {process.env.REACT_APP_PROJECT_ID === "general" &&
                    <div className='ontology-card-collection-name'>
                      <b>Collections:</b>              
                      {item.config.classifications[0]
                        ? BuildCollectionForCard(item.config.classifications[0].collection)
                        : "-"
                        }
                    </div>}
                  </div>
                  <div className="col-sm-3 ontology-card-meta-data">
                    <span className='ontology-meta-data-field-span'>{item.numberOfTerms} Classes</span>
                    <hr/>
                    <span className='ontology-meta-data-field-span'>{item.numberOfProperties} Properties</span>
                    <hr />
                    <span className='ontology-meta-data-field-span'>Loaded: {item.loaded ? item.loaded.split("T")[0] : "N/A"}</span>
                  </div>
                </div>                    
          )
        }
        
        setOntologyListContent(ontologyList);
    }


    useEffect(() => {
        createOntologyList();
    }, [props.ontologies, props.ontologiesHiddenStatus]);



    return(                    
        <div className='row'>           
            <div className='col-sm-12'>                                                                 
                <div className='row'>
                    <div className='col-sm-6'>                    
                        <h3 className='h-headers'>Browse Ontologies ({props.ontologies.length})</h3>                   
                    </div>                 
                </div>
                <div className='row'>
                    <div className='col-sm-12'>
                    Not able to find what you are looking for? You can suggest your ontology to be added to the list.
                    <a className="btn btn-sm btn-secondary ml-2 pt-0 pb-0 pl-1 pr-1" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologysuggestion"}>suggest</a>
                    </div>  
                </div>
                <br></br>
                <div className='row'>                    
                    <div className='col-sm-6 text-right zero-padding-col'>                                
                        <DropDown 
                            options={PAGE_SIZES_FOR_DROPDOWN}
                            dropDownId="list-result-per-page"                                        
                            dropDownTitle="page size"
                            dropDownValue={props.pageSize}
                            dropDownChangeHandler={props.handlePageSizeDropDownChange}
                            dropdownClassName={"white-dropdown"}                                
                        />                                                                 
                    </div>
                    <div className='col-sm-6 text-right zero-padding-col'>                     
                        <DropDown 
                            options={SORT_DROPDONW_OPTIONS}
                            dropDownId="ontology-list-sorting"                                    
                            dropDownTitle="sorted by"
                            dropDownValue={props.sortField}
                            dropDownChangeHandler={props.handleSortChange} 
                            dropdownClassName={"white-dropdown"}                               
                        />                             
                    </div>
                </div>     
                <div className='row'>
                    <div className='col-sm-12'>                        
                        {ontologyListContent} 
                    </div>
                </div>                         
            <Pagination 
                clickHandler={props.handlePagination} 
                count={props.pageCount}
                initialPageNumber={props.pageNumber}               
            />
            </div>
        </div>            
    );
}