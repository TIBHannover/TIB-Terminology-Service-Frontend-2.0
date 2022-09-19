import React from 'react'
import {generalAbout} from './General_About';
import {nfdi4chmeAbout} from './NDFI4Chem_About';

class About extends React.Component{
    render(){
        return(
            <span>
                {process.env.REACT_APP_PROJECT_ID === "general" && generalAbout()}
                {process.env.REACT_APP_PROJECT_ID === "nfdi4chem" && nfdi4chmeAbout()}
            </span>
        )
    }

}

export default About