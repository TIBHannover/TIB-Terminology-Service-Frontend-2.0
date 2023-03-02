import React from 'react';
import { ontologyMetadata, formatText } from './infoBoxhelper';

class OntologyOverview extends React.Component{
    constructor(props){
        super(props)
        this.state = {
          data: true,
          iriIsCopied: false,
        }
        this.createRow = this.createRow.bind(this);
        this.createTable = this.createTable.bind(this);
    }

  /**
   * create a table row 
   */
   createRow(metadataLabel, metadataValue, copyButton){
    let row = [
        <div className="col-sm-12 node-detail-table-row" key={metadataLabel}>
          <div className='row'>
            <div className="col-sm-4 col-md-3 node-metadata-value" key={metadataLabel + "-label"}>
              <div className="node-metadata-label">{metadataLabel}</div>
            </div>
            <div  className="col-sm-8 col-md-9 node-metadata-value"  key={metadataLabel + "-value"}>
              {formatText(metadataLabel, metadataValue, copyButton)}
              {copyButton &&
                <button 
                  type="button" 
                  class="btn btn-secondary btn-sm copy-link-btn"
                  key={"copy-btn"} 
                  onClick={() => {                  
                    navigator.clipboard.writeText(metadataValue);
                    this.setState({
                      iriIsCopied: true
                    });
                  }}
                  >
                  copy {this.state.iriIsCopied && <i class="fa fa-check" aria-hidden="true"></i>}
                </button>
              }
            </div>
          </div>
        </div>
    ];
    return row;    
   }

   /**
   * Create the view to render 
   */
createTable(){    
  let metadataToRender = "";
    metadataToRender =  this.ontologyMetaData(this.state.data);
  let result = [];
  
  for(let key of Object.keys(metadataToRender)){    
    let row = this.createRow(key, metadataToRender[key][0], metadataToRender[key][1]);
    result.push(row);
  }
  return result;
}


}


export default OntologyOverview