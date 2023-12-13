import React from 'react';
import {tibDoc} from './TIB_doc';
import {nfdi4chemDoc} from './Nfdi4chem_doc';
import {nfdi4IngDoc} from './Nfdi4ing_doc';
import Toolkit from '../common/Toolkit';
import '../layout/documentationPage.css';


class Documentation extends React.Component{
    render(){
        return(
          <span>
            {Toolkit.createHelmet("Documentation")}
            <div className='row justify-content-center doc-design'>
                <div className='col-sm-12'>
                    {/* {process.env.REACT_APP_PROJECT_ID === "general" && tibDoc()}
                    {process.env.REACT_APP_PROJECT_ID === "nfdi4chem" && nfdi4chemDoc()}
                    {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" && nfdi4IngDoc()} */}
                    {nfdi4chemDoc()}
                </div>                
            </div>
          </span>                    
        )
    }
}

export default Documentation