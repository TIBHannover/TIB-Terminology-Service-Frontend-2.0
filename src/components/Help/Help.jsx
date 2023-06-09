import {tibHelp} from './TIB_help';
import {nfdi4chemHelp} from './Nfdi4chem_help';
import {nfdi4IngHelp} from './Nfdi4ing_help';
import Toolkit from '../common/Toolkit';


function Help() {
        return( 
          <span>
            {Toolkit.createHelmet("Help")}                             
            <div className='row justify-content-center doc-design'>            
                  <div className='col-sm-8'>
                      {process.env.REACT_APP_PROJECT_ID === "general" && tibHelp()}
                      {process.env.REACT_APP_PROJECT_ID === "nfdi4chem" && nfdi4chemHelp()}
                      {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" && nfdi4IngHelp()}
                  </div>                
            </div>
          </span>
                      
        )
 };

export default Help;