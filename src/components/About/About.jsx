import React from 'react'
import {generalAbout} from './General_About';
import {nfdi4chemAbout} from './NDFI4Chem_About';
import {nfdi4IngAbout} from './NFDI4Ing_about';
import { Helmet, HelmetProvider } from 'react-helmet-async';

class About extends React.Component{
    render(){
        return(
          <HelmetProvider>
                <div>
                  <Helmet>
                    <title>About</title>
                  </Helmet>
                </div>              
            <div className='row justify-content-center doc-design'>
              
                <div className='col-sm-8'>
                    {process.env.REACT_APP_PROJECT_ID === "general" && generalAbout()}
                    {process.env.REACT_APP_PROJECT_ID === "nfdi4chem" && nfdi4chemAbout()}
                    {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" && nfdi4IngAbout()}
                </div>                
            </div>
          </HelmetProvider>
        )
    }

}

export default About