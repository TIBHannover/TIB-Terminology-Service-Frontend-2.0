import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import TIB_LOGO from '../../../assets/img/TIB_Logo_EN_WM_W.SVG';
import DFG_LOGO from '../../../assets/img/dfg_logo_schriftzug_weiss_foerderung_en.gif';


const Footer = () => (       
        <div className='row site-footer'>
            <div className="col-sm-4 footer-col">
                {process.env.REACT_APP_PROJECT_ID === "general" &&
                    <a href="https://www.dfg.de/en/index.jsp" target="_blank" rel="noopener noreferrer">
                        <img src={DFG_LOGO} alt="" className="footer-logo"/>
                    </a>
                }       
                {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" &&
                    <span>

                        <a href="https://www.dfg.de/en/index.jsp" target="_blank" rel="noopener noreferrer">
                            <img src="/dfg_logo.png" alt="" className="footer-logo"/>
                         </a>
                         <ul className="footer-list">
                            <li><small>NFDI4ING is funded by DFG</small></li>
                            <li><small>Project Number 442146713</small></li>
                        </ul>

                    </span>

                }
                {process.env.REACT_APP_PROJECT_ID === "nfdi4chem" &&
                    <span>
                        <a href="https://www.dfg.de/en/index.jsp" target="_blank" rel="noopener noreferrer">
                            <img src={DFG_LOGO} alt="" className="footer-logo"/>
                        </a>
                        <ul className="footer-list">
                            <li>NFDI4Chem is funded by DFG</li>
                            <li>Project Number 441958208</li>
                        </ul>
                    </span>                    
                }
            </div>

            <div className="col-sm-2">
                <h6>ABOUT</h6>
                <hr className="me-5"/>
                <ul className="footer-list">
                    <li>
                        <Link to={process.env.REACT_APP_PROJECT_SUB_PATH + "/PrivacyPolicy"} className='footer-link'>Privacy Policy</Link>
                    </li>
                    <li>
                        <Link to={process.env.REACT_APP_PROJECT_SUB_PATH + "/TermsOfUse"} className='footer-link'>Terms of use</Link>
                    </li>
                    <li>
                        <Link to={process.env.REACT_APP_PROJECT_SUB_PATH + "/imprint"}  className='footer-link'>Imprint</Link>
                    </li>
                    {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" &&
                        <li><small>Free SVG Background by <a target="_blank" href="https://bgjar.com">BGJar</a></small></li>
                    }
                </ul>
            </div>

            <div className="col-sm-2">
                {process.env.REACT_APP_PROJECT_ID !== "nfdi4ing" &&
                  <h6>RESOURCES</h6>
                }

                {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" &&
                  <h6>COMMUNITY</h6>
                }

                
                <hr className="me-5" />
                {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" &&
                   <a href="https://nfdi4ing.de/" target="_blank" rel="noopener noreferrer">
                        <img src="/nfdi4ing_logo.png" alt="Logo NFDI4ING" className="footer-funding-logo" />
                    </a>
                }
                {process.env.REACT_APP_PROJECT_ID === "nfdi4chem" &&
                    <ul className="footer-list">
                    <li><a href="https://www.nfdi4chem.de/" target="_blank" rel="noopener noreferrer" className='footer-link'>NFDI4Chem Website</a></li>
                    <li><a href="https://www.nfdi4chem.de/index.php/frequently-asked-questions/" target="_blank" rel="noopener noreferrer" className='footer-link'>NFDI4Chem FAQ</a></li>
                    <li><a href="https://www.nfdi4chem.de/index.php/helpdesk/" target="_blank" rel="noopener noreferrer" className='footer-link'>NFDI4Chem Helpdesk</a></li>
                    <li><a href="https://knowledgebase.nfdi4chem.de/knowledge_base/" target="_blank" rel="noopener noreferrer" className='footer-link'>NFDI4Chem Knowledge Base</a></li>
                    <li><a href="https://search.nfdi4chem.de/" target="_blank" rel="noopener noreferrer" className='footer-link'>NFDI4Chem Search Service</a></li>
                    <li><a href="https://github.com/NFDI4Chem" target="_blank" rel="noopener noreferrer" className='footer-link'>GitHub repository</a></li>
                    </ul>
                }
                {process.env.REACT_APP_PROJECT_ID === "general" &&
                <ul className="footer-list">
                    <li>
                        <Link to={process.env.REACT_APP_PROJECT_SUB_PATH + "/api"} className='footer-link'>Documentation</Link>
                    </li>
                    <li>
                        <a href="https://service.tib.eu/ts4tib/swagger-ui.html" target="_blank" rel="noopener noreferrer" className='footer-link'>API</a>
                    </li>
                    <li>
                        <a href="https://gitlab.com/TIBHannover/terminology/tib-terminology-service-issue-tracker" target="_blank" rel="noopener noreferrer"  className='footer-link'>GitLab Issue Tracker</a>
                    </li>
                </ul>
                }
            </div>


            <div className="col-sm-4">
                <h6>PROVIDED BY</h6>
                <hr className="me-5"/>
                    {process.env.REACT_APP_PROJECT_ID === "general" &&
                        <a href="https://www.tib.eu/en/" target="_blank" rel="noopener noreferrer">
                            <img src={TIB_LOGO} alt="Logo Technische Informationsbibliothek (TIB)" className="footer-logo" />
                        </a>
                    }       
                    {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" &&
                        <a href="https://www.tib.eu/en/" target="_blank" rel="noopener noreferrer">
                            <img src="/TIB_Logo_EN_WM_B.SVG" alt="Logo Technische Informationsbibliothek (TIB)" className="footer-logo" />
                        </a>
                    }
                    {process.env.REACT_APP_PROJECT_ID === "nfdi4chem" &&
                        <a href="https://www.tib.eu/en/" target="_blank" rel="noopener noreferrer">
                            <img src={TIB_LOGO} alt="Logo Technische Informationsbibliothek (TIB)" className="footer-logo" />
                        </a>                  
                    }               
            </div>
        </div>            
);

export default Footer;
