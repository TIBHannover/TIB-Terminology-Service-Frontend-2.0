import React from 'react';
import {tibHelp} from './TIB_help';
import {nfdi4chemHelp} from './Nfdi4chem_help';
import {nfdi4IngHelp} from './Nfdi4ing_help';
import { Helmet, HelmetProvider } from 'react-helmet-async';

function Help() {
        return(  
          <HelmetProvider>
              <div>
                <Helmet>
                  <title>Help</title>
                </Helmet>
              </div>                   
           <div className='row justify-content-center doc-design'>            
                <div className='col-sm-8'>
                    {process.env.REACT_APP_PROJECT_ID === "general" && tibHelp()}
                    {process.env.REACT_APP_PROJECT_ID === "nfdi4chem" && nfdi4chemHelp()}
                    {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" && nfdi4IngHelp()}
                </div>                
            </div>  
          </HelmetProvider>      
        )
 };

export default Help;