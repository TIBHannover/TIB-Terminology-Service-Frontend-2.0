import React from 'react';
import { ontologyMetadata } from './infoBoxhelper';

class OntologyOverview extends React.Component{
    constructor(props){
        super(props)
        this.state = {
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

    ];
    return row;    
   }
}

export default OntologyOverview