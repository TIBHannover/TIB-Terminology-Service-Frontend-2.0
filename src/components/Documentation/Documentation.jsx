import React from 'react';
import {tibDoc} from './TIB_doc';
import {nfdi4chemDoc} from './Nfdi4chem_doc';


class Documentation extends React.Component{
    render(){
        return(
            <div className='doc-design'>
                {process.env.REACT_APP_PROJECT_ID === "general" && tibDoc()}
                {process.env.REACT_APP_PROJECT_ID === "nfdi4chem" && nfdi4chemDoc()}
            </div>
        )
    }
}

export default Documentation