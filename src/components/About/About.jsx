import React from 'react'
import {generalAbout} from './General_About';
import {nfdi4chemAbout} from './NDFI4Chem_About';
import {nfdi4IngAbout} from './NFDI4Ing_about';
import Toolkit from '../common/Toolkit';
import '../layout/documentationPage.css';

class About extends React.Component{
    render(){
        return(
          <span>
            {Toolkit.createHelmet("About")}
            <div className='row justify-content-center doc-design'>              
                <div className='col-sm-12'>
                    {/* {process.env.REACT_APP_PROJECT_ID === "general" && generalAbout()}
                    {process.env.REACT_APP_PROJECT_ID === "nfdi4chem" && nfdi4chemAbout()}
                    {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" && nfdi4IngAbout()} */}
                    {nfdi4chemAbout()}
                </div>                
            </div>
          </span>         
        )
    }

}

export default About