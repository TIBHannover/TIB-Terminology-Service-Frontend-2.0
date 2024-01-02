import React from 'react';
import Toolkit from '../common/Toolkit';
import '../layout/documentationPage.css';
import { renderDocumentation } from './DocContentPage';


class Documentation extends React.Component{
    render(){
        return(
          <span>
            {Toolkit.createHelmet("Documentation")}
            <div className='row justify-content-center doc-design'>
                <div className='col-sm-12'>                   
                    {renderDocumentation()}
                </div>                
            </div>
          </span>                    
        )
    }
}

export default Documentation