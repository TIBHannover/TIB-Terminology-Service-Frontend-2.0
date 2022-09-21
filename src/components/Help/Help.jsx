import React from 'react';
import {tibHelp} from './TIB_help';
import {nfdi4chemHelp} from './Nfdi4chem_help';

class Help extends React.Component{
    render(){
        return(           
           <div className='row justify-content-center'>
                <div className='col-sm-8'>
                    {process.env.REACT_APP_PROJECT_ID === "general" && tibHelp()}
                    {process.env.REACT_APP_PROJECT_ID === "nfdi4chem" && nfdi4chemHelp()}
                </div>                
            </div>      
        )
    }
}

export default Help