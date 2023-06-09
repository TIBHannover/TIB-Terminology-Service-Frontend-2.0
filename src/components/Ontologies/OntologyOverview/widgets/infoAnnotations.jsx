import React from 'react'

class InfoAnnotations extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            ontologyShowAll: false,
            showMoreLessOntologiesText: "+ Show more information"          
        })
        this.createAnnotations = this.createAnnotations.bind(this);
        this.handleOntologyShowMoreClick = this.handleOntologyShowMoreClick.bind(this);
        this.formatCreators = this.formatCreators.bind(this);
        this.alphabeticSort = this.alphabeticSort.bind(this);
        this.createOverview = this.createOverview.bind(this);
        this.formatSubject = this.formatSubject.bind(this);
    }

    /**
     * Handle the creators array 
     */
      formatCreators (creators) {
        let answer = []
        let value = []
        for (let i = 0; i < creators.length; i++) {
          value.push(creators[i])
        }
        answer = value.join(',\n')
        return answer
      }
    
    /**
     * Handle the subjects in classifications 
     */   
      formatSubject(){
        let ontology = this.props.ontology;
        if(ontology.config.classifications[1] !== undefined){
        let answer = []
        let value = []
        for(let i=0; i< ontology.config.classifications[1].Subject.length; i++){
          value.push(ontology.config.classifications[1].Subject[i])
        }
        answer = value.join(',\n')
        return answer
        }          
      }

    /**
     * sort item alphabetically 
     */
      alphabeticSort(item){
         return item.sort();
      }
    
    /**
     * Handle the show more button in the ontology facet list
     * @param {*} e 
     */
    handleOntologyShowMoreClick(e){                        
        if(this.state.ontologyShowAll){
            this.setState({
                showMoreLessOntologiesText: "+ Show more information",
                ontologyShowAll: false
            });
        }
        else{
            this.setState({
                showMoreLessOntologiesText: "- Show less",
                ontologyShowAll: true
            });
        }

    }


    /**
     * fetching and arranging annotation values
     */
    createAnnotations(){
        let ontology = this.props.ontology;
        let entries = Object.entries(ontology.config.annotations);
        let annotations = [];
        if(entries.length !== 0){
          for(let [key,value] of entries){
            annotations.push(
              <tr>
                <td className="ontology-overview-table-id-column"><b>{key}</b></td>
                <td>{(value).join(',\n')}</td>
              </tr>
              )
          }
        }
        else{
          annotations.push(
            <tr>
              <td colSpan={3}>No additional information available</td>
            </tr>
            )
        }
        
        return annotations;
      };

    /**
     * Ontology Overview 
     */
    createOverview(){
        let ontology = this.props.ontology;
        if (!ontology || ontology === null) {
            return false
        }
        else{
            return(
                <div className="ontology-detail-table-wrapper">
                  <div className='row'>
                    <div className='col-sm-11 ontology-detail-text'>
                       <h4><b>{ontology.config.title}</b></h4>
                       <p>
                         {ontology.config.description}
                       </p>
                    </div>
                   </div>

                   <table className="ontology-detail-table" striped="columns">
                    <tbody>
                        <tr>
                          <td className="ontology-overview-table-id-column"><b>Version</b></td>
                          <td>
                            {ontology.config.version}
                          </td>
                        </tr>
                        <tr>
                          <td className="ontology-overview-table-id-column"><b>VersionIRI</b></td>
                          <td>
                            <a href={ontology.config.versionIri} target="_blank" rel="noopener noreferrer">{ontology.config.versionIri}</a>
                          </td>
                        </tr>
                        <tr>
                          <td className="ontology-overview-table-id-column"><b>IRI</b></td>
                          <td>
                            <a href={ontology.config.id}  className="anchor-in-table"  target="_blank" rel="noopener noreferrer">{ontology.config.id}</a>
                             {typeof(ontology.config.id) !== 'undefined' && ontology.config.id !== null
                             ? <button 
                                 type="button" 
                                 class="btn btn-secondary btn-sm copy-link-btn"
                                 onClick={() => {                  
                                 navigator.clipboard.writeText(ontology.config.id);
                                  }}
                                >
                                copy
                               </button>          
                            : ""
                            }  
                          </td>
                        </tr>
                        <tr>
                          <td className="ontology-overview-table-id-column"><b>HomePage</b></td>
                          <td>
                            <a href={ontology.config.homepage} className="anchor-in-table" target="_blank" rel="noopener noreferrer">{ontology.config.homepage}</a>
                             {typeof(ontology.config.homepage) !== 'undefined' && ontology.config.homepage !== null
                               ? <button 
                                   type="button" 
                                   class="btn btn-secondary btn-sm copy-link-btn"
                                   onClick={() => {                  
                                     navigator.clipboard.writeText(ontology.config.homepage);
                                      }}
                                  >
                                    copy 
                                 </button>  
                                : ""
                             }               
                           </td>
                        </tr>
                        <tr>
                          <td className="ontology-overview-table-id-column"><b>Issue tracker</b></td>
                          <td>
                            <a href={ontology.config.tracker} className="anchor-in-table" target="_blank" rel="noopener noreferrer">{ontology.config.tracker}</a>
                              {typeof(ontology.config.tracker) !== 'undefined' && ontology.config.tracker !== null
                              ? <button 
                                   type="button" 
                                   class="btn btn-secondary btn-sm copy-link-btn"
                                   onClick={() => {                  
                                   navigator.clipboard.writeText(ontology.config.tracker);                     
                                      }}
                                 >
                                copy 
                               </button>  
                               : ""
                              }               
                          </td>
                        </tr>
                        <tr>
                          <td className="ontology-overview-table-id-column"><b>License</b></td>
                          <td>
                            <a href={ontology.config.license.url} target="_blank" rel="noopener noreferrer">{ontology.config.license.label}</a>
                          </td>
                        </tr>
                        <tr>
                           <td className="ontology-overview-table-id-column"><b>Creator</b></td>
                           <td>
                             {this.formatCreators(ontology.config.creators)}
                           </td>
                        </tr>
                        {process.env.REACT_APP_PROJECT_ID === "general" && 
                        <tr>
                           <td className="ontology-overview-table-id-column"><b>Subject</b></td>
                           <td>
                             {this.formatSubject()}
                           </td>
                        </tr>}
                        <tr>
                           <td className="ontology-overview-table-id-column"><b>Is Skos</b></td>
                           <td>
                              {String(ontology.config.skos)}
                           </td>
                        </tr>
                        <tr>
                           <td className="ontology-overview-table-id-column"><b>Download</b></td>
                           <td>                     
                             <a                
                               href={"https://service.tib.eu/ts4tib/ontologies/" + ontology.ontologyId + "/download"}
                               className='btn btn-primary btn-dark download-ontology-btn'
                               target="_blank"                               
                              >
                              <i class="fa fa-download"></i>OWL
                             </a>
                             <a 
                               className='btn btn-primary btn-dark download-ontology-btn'                                
                               onClick={async () => {                    
                                 const jsonFile = JSON.stringify(ontology);
                                 const blob = new Blob([jsonFile],{type:'application/json'});
                                 const href = await URL.createObjectURL(blob);
                                 const link = document.createElement('a');
                                 link.href = href;
                                 link.download = ontology.ontologyId + "_metadata.json";
                                 document.body.appendChild(link);
                                 link.click();
                                 document.body.removeChild(link);
                               }}
                              >
                              <i class="fa fa-download"></i>Ontology metadata as JSON</a>
                            </td>
                        </tr>                                         
                    </tbody>
                   </table>
                </div> 
            )
        }
    }

    componentDidMount(){
        this.createOverview();
        this.createAnnotations();
    }

    componentDidUpdate(){
        this.createOverview();
        this.createAnnotations();
    }


    render(){
        return(
            <div>
                {this.createOverview()}
                {this.state.ontologyShowAll &&
                  <table className="ontology-detail-table">
                    <tbody>
                        <tr>
                          <td colSpan={3} id="annotation-heading"><b>Additional information from Ontology source</b></td>
                        </tr>                
                      {this.createAnnotations()}                
                    </tbody>
                  </table>}
                <div className="text-center" id="search-facet-show-more-ontology-btn">
                            <a className="show-more-btn"  onClick={this.handleOntologyShowMoreClick}>{this.state.showMoreLessOntologiesText}</a>
                </div>
            </div>          
            )
        }

}

export default InfoAnnotations