import Toolkit from '../../Libs/Toolkit';
import '../layout/documentationPage.css';
import { renderHelpPage } from './HelpPageContent';


function Help() {
        return( 
          <span>
            {Toolkit.createHelmet("Help")}                             
            <div className='row justify-content-center doc-design'>            
                  <div className='col-sm-12'>                      
                      {renderHelpPage()}
                  </div>                
            </div>
          </span>
                      
        )
 };

export default Help;