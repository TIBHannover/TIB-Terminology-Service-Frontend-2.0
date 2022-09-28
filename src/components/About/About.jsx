import React from 'react'
import {generalAbout} from './General_About';
import {nfdi4chmeAbout} from './NDFI4Chem_About';

class About extends React.Component{
    render(){
        return(
            <div className='row justify-content-center doc-design'>
                <div className='col-sm-8'>
                    {process.env.REACT_APP_PROJECT_ID === "general" && generalAbout()}
                    {process.env.REACT_APP_PROJECT_ID === "nfdi4chem" && nfdi4chmeAbout()}
                </div>                
            </div>
        )
    }

}

export default About