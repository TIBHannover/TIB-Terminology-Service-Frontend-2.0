import React from 'react';
import {tibDoc} from './TIB_doc';
import {nfdi4chemDoc} from './Nfdi4chem_doc';
import {nfdi4IngDoc} from './Nfdi4ing_doc';
import { Helmet, HelmetProvider } from 'react-helmet-async';


class Documentation extends React.Component{
    render(){
        return(
          <HelmetProvider>
                <div>
                  <Helmet>
                    <title>Documentation</title>
                  </Helmet>
                </div>             
            <div className='row justify-content-center doc-design'>
                <div className='col-sm-8'>
                    {process.env.REACT_APP_PROJECT_ID === "general" && tibDoc()}
                    {process.env.REACT_APP_PROJECT_ID === "nfdi4chem" && nfdi4chemDoc()}
                    {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" && nfdi4IngDoc()}
                </div>                
            </div>  
          </HelmetProvider>          
        )
    }
}

export default Documentation