import React from 'react'
import Toolkit from '../../Libs/Toolkit';
import '../layout/documentationPage.css';
import { renderAboutPage } from './AboutPageContent';

class About extends React.Component{
    render(){
        return(
          <span>
            {Toolkit.createHelmet("About")}
            <div className='row justify-content-center doc-design'>              
                <div className='col-sm-12'>                    
                    {renderAboutPage()}
                </div>                
            </div>
          </span>         
        )
    }

}

export default About